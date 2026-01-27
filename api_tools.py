import json, requests
from openai import OpenAI

OPENROUTER_API_KEY = f""
tools = [
    {
        "type": "function",
        "function":{
        "name": "get_bad_meaning_of_life",
        "description": "Function to return bad meaning of life",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Name of the AI model who calls this function: GLM/GPT5.1/GEMINI PRO/Etc",
                },
            },
            "required": ["name"],
        },
    }
},
 {
        "type": "function",
        "function":{
        "name": "get_good_meaning_of_life",
        "description": "Function to return a good meaning of life",
        "parameters": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "Important word, used in the function to deduce life using very complicated math. Can be home/life/heart, etc",
                },
                "desire" : {
                     "type" : "integer",
                     "description": "How large is your desire to know the meaning of life? Integer between 1-100. If picked a value not in this range, it will default to a random one within it."
                },
            },
            "required": ["word","desire"],
        },
    }
},
]        

# ... [Existing OPENROUTER_API_KEY and tools list remain unchanged] ...

# --- NEW HELPER FUNCTIONS ---

def append_response_to_history(messages, response_json):
    """
    Takes an OpenRouter response and appends the assistant message 
    and any resulting tool calls/results to the message list.
    """
    if "choices" not in response_json:
        print("Error: Invalid response format.")
        return messages

    choice = response_json["choices"][0]
    assistant_message = choice.get("message")
    
    # 1. Append the Assistant's response (containing tool_calls if present)
    messages.append(assistant_message)

    # 2. If there are tool calls, execute them and append the results
    if assistant_message.get("tool_calls"):
        for tool_call in assistant_message.get("tool_calls"):
            result = call_function(tool_call)
            
            # The tool message must include the tool_call_id to match the request
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.get("id"),
                "name": tool_call.get("function").get("name"),
                "content": str(result)
            })
    
    return messages

def clear_history(system_prompt="You are a helpful assistant."):
    """Resets the conversation with a system prompt."""
    return [{"role": "system", "content": system_prompt}]

def get_last_content(response_json):
    """Extracts the text content from the latest response for easy printing."""
    try:
        return response_json["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        return "No content found."

# --- EXISTING LOGIC (Modified to use helpers) ---

def openrouter_chat(messages):
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps({
            "model": "x-ai/grok-4.1-fast",
            "messages": messages,
            "max_tokens": 800,
            "tools": tools,
            "streaming": False
        })
    )

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "details": response.text}

def get_bad_meaning_of_life(name):
    return f"Meaning of life is currently 42, {name}"

def get_good_meaning_of_life(word, desire):
    return f"I dont know the meaning of life, but you used: {word} with a desire of {desire}"

FUNCTION_MAP = {
    'get_bad_meaning_of_life': get_bad_meaning_of_life,
    'get_good_meaning_of_life': get_good_meaning_of_life,
}

def call_function(tool_request):
    function_name = tool_request.get("function").get("name")
    args = tool_request.get("function").get("arguments")
    # Handle cases where args might already be a dict or a JSON string
    arguments = json.loads(args) if isinstance(args, str) else args
    return FUNCTION_MAP[function_name](**arguments)

# --- EXAMPLE USAGE ---

# 1. Initialize
chat_history = clear_history()
chat_history.append({"role": "user", "content": "What is the meaning of life?"})

# 2. First Call (LLM decides to use tools)
response = openrouter_chat(chat_history)

# 3. Use helper to process tool calls and update history automatically
chat_history = append_response_to_history(chat_history, response)

# 4. Final Call (LLM looks at tool results and gives final answer)
final_response = openrouter_chat(chat_history)
print(get_last_content(final_response))
print(chat_history)