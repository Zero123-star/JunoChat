# lora_utils.py

from peft import PeftModel

def load_lora_adapter(model, adapter_path):
    if not adapter_path:
        return model
    try:
        return PeftModel.from_pretrained(model, adapter_path)
    except Exception as e:
        print(f"[WARN] Failed to load LoRA adapter from {adapter_path}: {e}")
        return model
