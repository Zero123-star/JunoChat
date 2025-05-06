# persona_setup.py

import os
import json
from train_lora_adapters import train_lora_for_character

# List of default personas to create on startup
DEFAULT_PERSONAS = [
    {
        "name": "Default",
        "model": "mistral-7b-instruct",
        "template": "plain",
        "adapter_path": None
    },
    {
        "name": "Luna",
        "model": "mistral-7b-instruct",
        "template": "zephyr",
        "adapter_path": "luna_lora"
    },
    {
        "name": "HermesBot",
        "model": "hermes-3-llama",
        "template": "chatml",
        "adapter_path": None
    }
]

def create_persona(name, model, template="plain", adapter_path=None):
    os.makedirs("personas", exist_ok=True)
    path = os.path.join("personas", f"{name}.json")
    if os.path.exists(path):
        return
    persona = {
        "name": name,
        "model": model,
        "template": template,
        "persona": f"You are {name}, a helpful assistant.",
        "character_memory": [],
        "example_dialogue": [],
        "generation_params": {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_new_tokens": 200
        }
    }
    if adapter_path:
        persona["adapter_path"] = adapter_path
    with open(path, "w") as f:
        json.dump(persona, f, indent=2)

def autopopulate_defaults():
    for p in DEFAULT_PERSONAS:
        create_persona(
            name=p["name"],
            model=p["model"],
            template=p["template"],
            adapter_path=p["adapter_path"]
        )
        # if there's an adapter to train, kick off training
        if p.get("adapter_path"):
            persona_path = os.path.join("personas", f"{p['name']}.json")
            train_lora_for_character(persona_path)

if __name__ == "__main__":
    autopopulate_defaults()
