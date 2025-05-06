import json
import os
from pathlib import Path
from persona_startup import autopopulate_defaults
import torch

USE_OPENAI = os.getenv("OPENAI_API_KEY")

def save_persona(name: str, persona_data: dict):
    """
    Persist a persona JSON under personas/{name}.json.
    """
    os.makedirs("personas", exist_ok=True)
    path = os.path.join("personas", f"{name}.json")
    with open(path, "w") as f:
        json.dump(persona_data, f, indent=2)

def reflect_on_session(
    model: torch.nn.Module,
    tokenizer,
    persona: dict,
    history: list[dict],
    max_reflection_tokens: int = 100
) -> str:
    """
    Ask the model to produce a brief ‘reflection’ on the recent conversation turns,
    to be added into character_memory.
    """
    # Build a small prompt
    prompt_lines = [
        f"You are reflecting on the character’s recent conversation to improve its memory.",
        f"Character persona: {persona.get('persona', '').strip()}",
        "",
        "Recent conversation:"
    ]
    for turn in history:
        prompt_lines.append(f"User: {turn['user']}")
        prompt_lines.append(f"Assistant: {turn['assistant']}")
    prompt_lines.append("\nReflection:")
    prompt = "\n".join(prompt_lines)

    # Tokenize and generate
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_reflection_tokens,
            temperature=0.7,
            top_p=0.9,
            eos_token_id=tokenizer.eos_token_id
        )
    # Decode only the new tokens
    reflection = tokenizer.decode(
        outputs[0][inputs["input_ids"].shape[-1]:],
        skip_special_tokens=True
    ).strip()

    return reflection


history_store = {}

def persist_history(character, user_id="demo", session_id="default"):
    path = Path("history") / f"{character}_{user_id}_{session_id}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        json.dump(history_store.get((character, user_id, session_id), []), f, indent=2)

def load_persona(name):
    path = Path("personas") / f"{name}.json"
    if not path.exists():
        print(f"[INFO] Creating default persona for: {name}")
        default = {
            "name": name,
            "persona": f"{name} is a helpful assistant.",
            "image_url": "",
            "character_memory": [],
            "generation_params": {
                "max_new_tokens": 200,
                "temperature": 0.7,
                "top_p": 0.9
            },
            "example_dialogue": [],
            "template": "plain"
        }
        save_persona(name, default)
        return default
    with path.open() as f:
        return json.load(f)

def build_prompt_with_history(persona, history, message, summary=None, retrieved_memory=None):
  #  lines = [persona["persona"].strip()]
    lines = []
    lines.append(persona["persona"].strip())

    if retrieved_memory:
        lines.append("\n[Retrieved Memory]\n" + "\n".join(retrieved_memory))

    # Base persona description
   #ppend(persona["persona"].strip())

    # Optional character memory
    memory = persona.get("character_memory", [])
    if memory:
        lines.append("\n[Memory]\n" + "\n".join(memory))

    # Optional examples
    examples = persona.get("example_dialogue", [])
    if examples:
        lines.append("\n[Examples]")
        for ex in examples:
            lines.append(f"User: {ex['user']}\nAssistant: {ex['assistant']}")

    # Optional summary
    if summary:
        lines.append(f"\n[Summary]\n{summary}")

    # Chat history
    lines.append("\n[Conversation]")
    for turn in history:
        lines.append(f"User: {turn['user']}\nAssistant: {turn['assistant']}")

    # Current input
    lines.append(f"User: {message}\nAssistant:")

    return "\n".join(lines)

def get_history(character, user_id="demo", session_id="default"):
    return history_store.get((character, user_id, session_id), [])

def append_history(character, user_input, assistant_reply, user_id="demo", session_id="default"):
    key = (character, user_id, session_id)
    if key not in history_store:
        history_store[key] = []
    history_store[key].append({"user": user_input, "assistant": assistant_reply})


def maybe_summarize(history, max_turns=6):
    if len(history) <= max_turns:
        return None, history

    early = history[:-max_turns]
    recent = history[-max_turns:]

    try:
        import os
        import openai
        openai.api_key = os.getenv("OPENAI_API_KEY")

        conv = "".join(f"User: {t['user']}\nAssistant: {t['assistant']}\n" for t in early)
        prompt = f"Summarize the following conversation concisely for memory retention:\n{conv}\nSummary:"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=150
        )
        summary = response.choices[0].message.content.strip()
    except Exception:
        summary = "Previously discussed topics: " + "; ".join(
            f"User asked about: {t['user']}" for t in early
        )

    return summary, recent

def restore_history(character, user_id="demo", session_id="default"):
    path = Path("history") / f"{character}_{user_id}_{session_id}.json"
    if path.exists():
        with path.open() as f:
            history_store[(character, user_id, session_id)] = json.load(f)
