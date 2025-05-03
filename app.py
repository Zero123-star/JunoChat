
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os, requests

load_dotenv()

app = Flask(__name__)

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_URL = os.getenv("HF_MODEL_URL", "https://api-inference.huggingface.co/models/NousResearch/Hermes-3-Llama-3.1-8B")

def build_hermes_prompt(bot_description, history, user_prompt):
   # prompt = f"<|im_start|>system\n{bot_description}<|im_end|>\n"
    prompt = f"<|im_start|>system\nYou are {bot_description}. Always stay in character.\n<|im_end|>\n"

    for msg in history:
        role = "user" if msg["sender"] == "user" else "assistant"
        prompt += f"<|im_start|>{role}\n{msg['text']}<|im_end|>\n"

    prompt += f"<|im_start|>user\n{user_prompt}<|im_end|>\n"
    prompt += "<|im_start|>assistant\n"
    return prompt


@app.route("/", methods=["GET"])
def home():
    return '''
    <h1>Flask AI Server is Running!</h1>
    <p>Send a POST request to <code>/generate</code> with JSON:</p>
    <pre>
    {
      "bot_description": "You are a kind assistant.",
      "history": [],
      "user_prompt": "Hello!"
    }
    </pre>
    '''

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    bot_description = data.get("bot_description", "")
    history = data.get("history", [])
    user_prompt = data.get("user_prompt", "")

    prompt = build_hermes_prompt(bot_description, history, user_prompt)

    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7,
            "top_p": 0.9,
            "repetition_penalty": 1.1,
            "stop": ["<|im_end|>"]
        }
    }

    try:
        response = requests.post(HF_MODEL_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        full_output = response.json()[0]["generated_text"]
        reply = full_output.split("<|im_start|>assistant\n")[-1].split("<|im_end|>")[0].strip()
    except Exception as e:
        print("Error:", e)
        reply = "I'm sorry, something went wrong."

    return jsonify({"bot_reply": reply})
