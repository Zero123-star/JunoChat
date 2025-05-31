import os
import json
from glob import glob
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import torch


# Configuration
PERSONAS_DIR = "personas"
LOGS_DIR = "logs"
ADAPTER_BASE_DIR = "adapters"
BASE_MODELS = {
    # map persona.model strings to HF model names
    "mistral-7b-instruct": "TheBloke/Mistral-7B-Instruct-v0.1-GPTQ",
    # add other base models here if needed
}

def load_chat_logs(character):
    path = os.path.join(LOGS_DIR, f"{character}_chat.jsonl")
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return [json.loads(line) for line in f]

def prepare_dataset(records):
    examples = []
    for r in records:
        user = r.get("user")
        assistant = r.get("assistant")
        if not user or not assistant:
            continue
        examples.append({
            "instruction": user,
            "context": "",
            "response": assistant
        })
    return Dataset.from_list(examples)

def train_lora_for_character(path):
    # Load persona config
    with open(path) as f:
        persona = json.load(f)
    name = persona.get("name") or os.path.splitext(os.path.basename(path))[0]
    model_key = persona.get("model")
    adapter_path = persona.get("adapter_path")
    if not adapter_path:
        print(f"Skipping {name}: no adapter_path defined.")
        return

    # Prepare logs
    records = load_chat_logs(name)
    if not records:
        print(f"No chat logs for {name}, skipping.")
        return
    dataset = prepare_dataset(records)

    # Base model
    base_model_name = BASE_MODELS.get(model_key)
    if not base_model_name:
        print(f"Unsupported model {model_key} for {name}, skipping.")
        return

    tokenizer = AutoTokenizer.from_pretrained(base_model_name, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )
    model = prepare_model_for_kbit_training(model)

    # LoRA config
    lora_config = LoraConfig(
        r=8,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )
    model = get_peft_model(model, lora_config)

    def tokenize_fn(ex):
        prompt = f"### Instruction:\n{ex['instruction']}\n"
        if ex.get('context'):
            prompt += f"### Context:\n{ex['context']}\n"
        prompt += f"### Response:\n{ex['response']}"
        return tokenizer(prompt, truncation=True, padding='max_length', max_length=512)

    tokenized = dataset.map(tokenize_fn, remove_columns=dataset.column_names)

    # Training arguments
    output_dir = os.path.join(ADAPTER_BASE_DIR, adapter_path)
    os.makedirs(output_dir, exist_ok=True)
    args = TrainingArguments(
        per_device_train_batch_size=4,
        num_train_epochs=3,
        learning_rate=2e-4,
        logging_steps=10,
        output_dir=output_dir,
        save_total_limit=1,
        save_strategy="epoch",
        bf16=True,
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=tokenized,
        tokenizer=tokenizer
    )
    print(f"Training LoRA adapter for {name}, saving to {output_dir}")
    trainer.train()
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print(f"Adapter for {name} saved.")

def main():
    persona_files = glob(os.path.join(PERSONAS_DIR, "*.json"))
    for path in persona_files:
        train_lora_for_character(path)

if __name__ == "__main__":
    main()