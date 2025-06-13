from transformers import AutoModelForCausalLM, AutoTokenizer
import os
import torch
from lora_utils import load_lora_adapter
from dotenv import load_dotenv
load_dotenv()

device = "cuda" if torch.cuda.is_available() else "cpu"

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_URL = os.getenv("HF_MODEL_URL", "https://api-inference.huggingface.co/models/nousresearch/hermes-3-llama-3.1-8b")
""
MODEL_REGISTRY = {
    "mistral-7b-instruct": {
        "name": "TheBloke/Mistral-7B-Instruct-v0.1-GPTQ",
        "model": None,
        "tokenizer": None
    },
     "hermes": {
        "type": "remote",
        "url": HF_MODEL_URL,
        "token": HF_API_TOKEN
    }
}
def load_models():
    for key, config in MODEL_REGISTRY.items():
        if config.get("type") != "local":
            continue

        try:
            config["tokenizer"] = AutoTokenizer.from_pretrained(
                config["name"],
                trust_remote_code=True
            )
            config["model"] = AutoModelForCausalLM.from_pretrained(
                config["name"],
                device_map="auto",
                torch_dtype=torch.float16,
                trust_remote_code=True
            ).to(device)

        except RuntimeError as e:
            # GPTQ models on CPU will raise this
            if "GPU is required to quantize or run quantize model" in str(e):
                print(f"[WARN] Skipping local load of '{key}': {e}")
                config["model"] = None
                config["tokenizer"] = None
            else:
                raise




def get_model(model_key: str, adapter_path: str = None):
    config = MODEL_REGISTRY.get(model_key)
    if not config:
        raise ValueError(f"Model '{model_key}' not found")

    if config["type"] == "local":
        model = config["model"]
        tokenizer = config["tokenizer"]
        model = load_lora_adapter(model, adapter_path)
        return model.to(device), tokenizer

    elif config["type"] == "remote":
        return config["url"], config["token"]

    raise ValueError(f"Unsupported model type '{config['type']}'")

