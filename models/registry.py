from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

MODEL_REGISTRY = {
    "mistral-7b-instruct": {
        "name": "TheBloke/Mistral-7B-Instruct-v0.1-GPTQ",
        "model": None,
        "tokenizer": None
    }
}

def load_models():
    for key, config in MODEL_REGISTRY.items():
        config["tokenizer"] = AutoTokenizer.from_pretrained(config["name"])
        config["model"] = AutoModelForCausalLM.from_pretrained(
            config["name"],
            device_map="auto",
            torch_dtype=torch.float16
        )

def get_model(model_key):
    return MODEL_REGISTRY[model_key]["model"], MODEL_REGISTRY[model_key]["tokenizer"]
