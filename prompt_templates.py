# Abridged: see full version previously sent for all templates
def format_prompt(template_name, persona, history, message, summary=None):
    persona_text = persona["persona"].strip()
    if template_name == "plain":
        lines = [persona_text, ""]
        if summary:
            lines.append(f"Summary: {summary}")
        for turn in history:
            lines.append(f"User: {turn['user']}\nAssistant: {turn['assistant']}")
        lines.append(f"User: {message}\nAssistant:")
        return "\n".join(lines)
    return format_prompt("plain", persona, history, message, summary)
