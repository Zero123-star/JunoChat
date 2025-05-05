import json
from pathlib import Path

history_store = {}

def load_persona(name):
    path = Path("personas") / f"{name}.json"
    with path.open() as f:
        return json.load(f)

def build_prompt_with_history(persona, history, message, summary=None):
    lines = [persona["persona"].strip(), ""]
    if summary:
        lines.append(f"Summary of previous discussion: {summary}\n")
    for turn in history:
        lines.append(f"User: {turn['user']}")
        lines.append(f"Assistant: {turn['assistant']}")
    lines.append(f"User: {message}")
    lines.append("Assistant:")
    return "\n".join(lines)

def get_history(character, user_id="demo"):
    return history_store.get((character, user_id), [])

def append_history(character, user_input, assistant_reply, user_id="demo"):
    key = (character, user_id)
    if key not in history_store:
        history_store[key] = []
    history_store[key].append({ "user": user_input, "assistant": assistant_reply })

def maybe_summarize(history, max_turns=6):
    if len(history) <= max_turns:
        return None, history
    early = history[:-max_turns]
    recent = history[-max_turns:]
    summary_parts = [f"User asked about: {turn['user']}" for turn in early]
    summary = "Previously discussed topics: " + "; ".join(summary_parts)
    return summary, recent
