def format_prompt(template_name, persona, history, message, summary=None):
    persona_text = persona["persona"].strip()

    # Default to plain
    if template_name == "plain":
        lines = [persona_text, ""]
        if summary:
            lines.append(f"Summary of previous discussion: {summary}\n")
        for turn in history:
            lines.append(f"User: {turn['user']}")
            lines.append(f"Assistant: {turn['assistant']}")
        lines.append(f"User: {message}")
        lines.append("Assistant:")
        return "\n".join(lines)

    elif template_name == "llama2":
        lines = [f"<<SYS>>\n{persona_text}\n<</SYS>>\n"]
        if summary:
            lines.append(f"[INST] Summary of earlier chat: {summary} [/INST]\n")
        for turn in history:
            lines.append(f"[INST] {turn['user']} [/INST] {turn['assistant']}")
        lines.append(f"[INST] {message} [/INST]")
        return "\n".join(lines)

    elif template_name == "chatml":
        lines = [f"<|system|>\n{persona_text}\n"]
        if summary:
            lines.append(f"<|system|> Summary: {summary}\n")
        for turn in history:
            lines.append(f"<|user|> {turn['user']}\n<|assistant|> {turn['assistant']}\n")
        lines.append(f"<|user|> {message}\n<|assistant|>")
        return "".join(lines)

    elif template_name == "alpaca":
        base = f"### Instruction:\n{persona_text}\n"
        if summary:
            base += f"\n### Note:\n{summary}\n"
        for turn in history:
            base += f"\n### User:\n{turn['user']}\n### Response:\n{turn['assistant']}\n"
        base += f"\n### User:\n{message}\n### Response:\n"
        return base

    elif template_name == "oasst":
        lines = [f"<|system|>{persona_text}<|end|>"]
        for turn in history:
            lines.append(f"<|user|>{turn['user']}<|end|><|assistant|>{turn['assistant']}<|end|>")
        lines.append(f"<|user|>{message}<|end|><|assistant|>")
        return "".join(lines)

    elif template_name == "zephyr":
        lines = [f"<|system|> {persona_text}\n"]
        for turn in history:
            lines.append(f"<|user|> {turn['user']}\n<|assistant|> {turn['assistant']}\n")
        lines.append(f"<|user|> {message}\n<|assistant|>")
        return "".join(lines)

    elif template_name == "deepseek":
        lines = [f"<|system|>\n{persona_text}\n"]
        if summary:
            lines.append(f"<|system|> Summary: {summary}\n")
        for turn in history:
            lines.append(f"<|user|> {turn['user']}\n<|assistant|> {turn['assistant']}\n")
        lines.append(f"<|user|> {message}\n<|assistant|>")
        return "".join(lines)

    elif template_name == "huggingface":
        lines = [f"<s>[INST] {persona_text} [/INST] "]
        for turn in history:
            lines.append(f"<s>[INST] {turn['user']} [/INST] {turn['assistant']} </s>")
        lines.append(f"<s>[INST] {message} [/INST]")
        return "\n".join(lines)

    elif template_name == "phi":
        lines = [f"System: {persona_text}"]
        for turn in history:
            lines.append(f"User: {turn['user']}\nAssistant: {turn['assistant']}")
        lines.append(f"User: {message}\nAssistant:")
        return "\n".join(lines)

    elif template_name == "falcon":
        lines = [f"<|system|>{persona_text}\n"]
        for turn in history:
            lines.append(f"<|user|>{turn['user']}<|end|><|assistant|>{turn['assistant']}<|end|>")
        lines.append(f"<|user|>{message}<|end|><|assistant|>")
        return "\n".join(lines)

    # Fallback
    return format_prompt("plain", persona, history, message, summary)
