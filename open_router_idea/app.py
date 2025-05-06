import json
import uuid
from pathlib import Path
from datetime import datetime

import torch
import requests
from fastapi import FastAPI, Request, Form, Query, BackgroundTasks, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from external_api import router as external_router
from models.db import init_db, SessionLocal, Chat, Message
from models.registry import load_models, get_model, MODEL_REGISTRY
from prompt_templates import format_prompt
from utils import (
    load_persona,
    maybe_summarize,
    save_persona,
    reflect_on_session,
)
from vector_memory import store_message, retrieve_similar
from api_metering import RateLimiterMiddleware, count_tokens, get_usage_stats
from train_lora_adapters import train_lora_for_character
from persona_startup import autopopulate_defaults

# FastAPI setup
app = FastAPI()
app.add_middleware(RateLimiterMiddleware)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def on_startup():
    autopopulate_defaults()
    load_models()
    init_db()

# ───────────────────── ROUTES ─────────────────────
@app.post("/chat-debug")
async def chat_debug(
    character: str = Form(...),
    model_key: str = Form(...),
    message: str = Form(...),
    session_id: str = Query(default_factory=lambda: str(uuid.uuid4()))
):
    return {
        "character": character,
        "model_key": model_key,
        "message": message,
        "session_id": session_id
    }

@app.get("/models")
def list_models():
    return list(MODEL_REGISTRY.keys())

@app.get("/personas")
def list_personas():
    return [p.stem for p in Path("personas").glob("*.json")]

@app.get("/stats")
def stats(user_id: str = "demo"):
    return JSONResponse(get_usage_stats(user_id))

def get_persona_data():
    personas = list_personas()
    persona_data = {p: load_persona(p) for p in personas}
    return personas, persona_data

@app.get("/")
def index(request: Request):
    personas, persona_data = get_persona_data()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "models": list_models(),
        "personas": personas,
        "persona_data": persona_data,
        "selected_character": None,
        "selected_model": None,
        "user_message": "",
        "reply": None,
        "reflection": None
    })
from fastapi.logger import logger

@app.post("/chat", response_class=HTMLResponse)
async def chat_post(
    request: Request,
    character: str = Form(...),
    model_key: str = Form(...),
    message: str = Form(...),
    session_id: str = Query(default_factory=lambda: str(uuid.uuid4()))
):
    try:
        personas = list_personas()
        persona_data = {p: load_persona(p) for p in personas}

        # ❗ Try to load or create persona if not found
        if character not in persona_data:
            logger.warning(f"Persona '{character}' not found. Creating default...")
            default_persona = {
                "name": character,
                "persona": f"{character} is a helpful, friendly assistant.",
                "image_url": "",
                "character_memory": [],
                "generation_params": {"max_new_tokens": 300, "temperature": 0.7, "top_p": 0.9},
                "template": "plain"
            }
            save_persona(character, default_persona)
            persona = default_persona
            persona_data[character] = default_persona
        else:
            persona = persona_data[character]

        model_obj, tokenizer_or_token = get_model(model_key or persona.get("model"))

        db = SessionLocal()
        chat = db.query(Chat).filter_by(session_id=session_id, user_id="demo", character=character).first()
        if not chat:
            chat = Chat(session_id=session_id, user_id="demo", character=character)
            db.add(chat)
            db.commit()
            db.refresh(chat)

        db_messages = db.query(Message).filter_by(chat_id=chat.id).order_by(Message.timestamp).all()
        history = []
        for m in db_messages:
            if m.sender == "user":
                history.append({"user": m.content, "assistant": ""})
            else:
                history[-1]["assistant"] = m.content

        summary, recent = maybe_summarize(history)
        
        snippets = retrieve_similar(character, "demo", message, top_k=5)
        if snippets:
            summary = (summary or "") + "\n" + "\n".join(snippets)

        if message.startswith("<<character info>>"):
            info = message.replace("<<character info>>", "").strip()
            if info:
                persona.setdefault("character_memory", []).append(info)
                save_persona(character, persona)
            return RedirectResponse(url="/", status_code=303)

        prompt = format_prompt(persona.get("template", "plain"), persona, recent, message, summary)
        gen_args = persona.get("generation_params", {})

        if isinstance(model_obj, str):
            headers = {"Authorization": f"Bearer {tokenizer_or_token}"}
            payload = {"inputs": prompt, "parameters": gen_args}
            resp = requests.post(model_obj, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            reply = resp.json()[0]["generated_text"].split("<|assistant|>")[-1].strip()
        else:
            inputs = tokenizer_or_token(prompt, return_tensors="pt").to(model_obj.device)
            with torch.no_grad():
                outputs = model_obj.generate(**inputs, **gen_args)
            reply = tokenizer_or_token.decode(
                outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True
            ).strip()

        db.add_all([
            Message(chat_id=chat.id, sender="user", content=message),
            Message(chat_id=chat.id, sender="assistant", content=reply)
        ])
        db.commit()

        store_message(character, "demo", message, reply)
        count_tokens(tokenizer_or_token, prompt, reply, "demo")

        if len(history) % 5 == 0:
            refl = reflect_on_session(model_obj, tokenizer_or_token, persona, recent)
            persona.setdefault("character_memory", []).append(refl)
            save_persona(character, persona)
        else:
            refl = None

        return templates.TemplateResponse("index.html", {
            "request": request,
            "models": list_models(),
            "personas": personas,
            "persona_data": persona_data,
            "selected_character": character,
            "selected_model": model_key,
            "user_message": message,
            "reply": reply,
            "reflection": refl
        })

    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error(tb)
        return HTMLResponse(f"<h2>Internal Error</h2><pre>{tb}</pre>", status_code=500)

@app.post("/train-adapters/{character}")
async def train_adapters(character: str, background_tasks: BackgroundTasks):
    path = Path("personas") / f"{character}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Persona not found")
    background_tasks.add_task(train_lora_for_character, str(path))
    return {"status": "started"}

# Mount external API endpoints
app.include_router(external_router)
