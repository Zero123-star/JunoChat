import axios from 'axios';

export async function fetchBotReply({ character, model_key, message, session_id }: {
  character: string;
  model_key: string;
  message: string;
  session_id?: string;
}) {
  // You may want to store session_id in localStorage or context for continuity
  const response = await axios.post('http://localhost:8000/chat', {
    character,
    model_key,
    message,
    session_id,
  });
  return response.data;
}

// For OpenRouter-style endpoint (FastAPI external_api.py)
export async function fetchBotReplyOpenRouter({
  character,
  bot_description,
  history,
  user_prompt,
  model_key,
}: {
  character: string;
  bot_description: string;
  history: { sender: string; text: string }[];
  user_prompt: string;
  model_key?: string;
}) {
  // Always send a model_key, default to 'hermes-3-llama' if not provided
  const model = model_key || 'hermes-3-llama';
  const response = await axios.post('http://localhost:8000/generate', {
    chat_id: character,
    bot_description,
    history,
    user_prompt,
    model_key: model,
  });
  return response.data;
}
