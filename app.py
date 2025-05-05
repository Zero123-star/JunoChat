import json
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from models.registry import load_models, get_model, MODEL_REGISTRY
from utils import (
    load_persona,
    build_prompt_with_history,
    get_history,
    append_history,
    maybe_summarize
)
from vector_memory import store_message, retrieve_similar
from api_metering import RateLimiterMiddleware, count_tokens, get_usage_stats
import torch
from pathlib import Path

app = FastAPI()
app.add_middleware(RateLimiterMiddleware)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Load all models into memory at startup
load_models()

@app.get("/models")
def list_models():
    return list(MODEL_REGISTRY.keys())

@app.get("/personas")
def list_personas():
    return [f.stem for f in Path("personas").glob("*.json")]

@app.get("/stats")
def stats(user_id: str = "demo"):
    return JSONResponse(get_usage_stats(user_id))

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    models = list_models()
    personas = list_personas()
    return templates.TemplateResponse("index.html", {"request": request, "models": models, "personas": personas})

@app.post("/chat", response_class=HTMLResponse)
async def chat_post(request: Request, character: str = Form(...), model: str = Form(...), message: str = Form(...)):
    user_id = "demo"
    persona = load_persona(character)
    model_id = model or persona["model"]
    model_obj, tokenizer = get_model(model_id)

    history = get_history(character, user_id)
    summary, trimmed_history = maybe_summarize(history)

    memory_snippets = retrieve_similar(character, user_id, message)
    if memory_snippets:
        summary = (summary or "") + "\n" + "\n".join(memory_snippets)

    prompt = build_prompt_with_history(persona, trimmed_history, message, summary)
    gen_args = persona.get("generation_params", {})

    inputs = tokenizer(prompt, return_tensors="pt").to(model_obj.device)
    with torch.no_grad():
        outputs = model_obj.generate(**inputs, **gen_args)
    reply = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True).strip()

    append_history(character, message, reply, user_id)
    store_message(character, user_id, message, reply)
    count_tokens(tokenizer, prompt, reply, user_id)

    models = list_models()
    personas = list_personas()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "models": models,
        "personas": personas,
        "selected_model": model,
        "selected_character": character,
        "user_message": message,
        "reply": reply,
        "reflection": reflection
    })
