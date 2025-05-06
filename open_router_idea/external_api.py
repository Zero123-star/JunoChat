from fastapi import APIRouter
from pydantic import BaseModel
from utils import build_prompt_with_history
from models.registry import get_model
import torch

router = APIRouter()

class GenerateRequest(BaseModel):
    chat_id: str
    bot_description: str
    history: list
    user_prompt: str

@router.post("/generate")
def generate_reply(data: GenerateRequest):
    # Build pseudo-persona
    persona = {
        "persona": data.bot_description,
        "character_memory": [],
        "example_dialogue": [],
        "generation_params": {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_new_tokens": 200
        },
        "model": "mistral-7b-instruct"
    }

    # Map to local history format
    structured_history = []
    for turn in data.history:
        if turn["sender"] == "user":
            structured_history.append({"user": turn["text"], "assistant": ""})
        else:
            structured_history[-1]["assistant"] = turn["text"]

    prompt = build_prompt_with_history(persona, structured_history, data.user_prompt)

    model, tokenizer = get_model(persona["model"])
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(**inputs, **persona["generation_params"])
    reply = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True).strip()

    return { "bot_reply": reply }
