import axios from 'axios';
import { Character } from '@/types/character'; // Importă tipul dintr-un singur loc

// Configurarea URL-ului de bază al API-ului
const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  
});

// Add request interceptor to include auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for authentication 401s, not OpenRouter API errors
    if (error.response?.status === 401) {
      const errorData = error.response?.data;
      const currentPath = window.location.pathname;
      
      // Check if this is an OpenRouter API key issue
      if (errorData?.error?.includes('OpenRouter') || errorData?.details?.includes('cookie auth')) {
        console.error('OpenRouter API key missing or invalid. Please add your API key.');
        // Don't redirect to login - this is an API configuration issue, not an auth issue
      } else if (currentPath !== '/login' && currentPath !== '/register') {
        // Only redirect if not already on login/register page
        // This is a real authentication issue with Django
        console.log('Authentication failed, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tipuri pentru datele API
export interface User {
  id: number;
  username: string;
  email: string;
}

// Funcții pentru cereri API
export const fetchUsers = async () => {
  const response = await API.get<User[]>('users/');
  return response.data; // Returnează doar datele utilizatorilor
};

export const fetchCharacters = async (): Promise<Character[]> => {
  const response = await API.get<Character[]>('characters/');
  return response.data;
};

export const fetchCharacter = async (id: string): Promise<Character> => {
  const response = await API.get<Character>(`characters/${id}/`);
  return response.data;
};

export const fetchUserCharacters = async (userId: number) => {
  const response = await API.get<Character[]>(`users/${userId}/characters/`);
  return response.data; // Returnează doar personajele utilizatorului
};

export const fetchChats = async () => {
  const response = await API.get('chats/');
  return response.data; // Returnează datele despre chat-uri
};

export const fetchCharacterChat = async (characterId: string) => {
  const response = await API.get(`chat/${characterId}/`);
  return response.data; // Returnează datele despre chat-ul personajului
}



//Use this for openrouter
export const openrouter_chat = async (messages: {role: string; content: string}[],id: string | undefined) => {
  console.log("Reply from frontend apy:",messages,id);
  const m={messages,id};
  const response = await API.post('chat/openrouter_chat/', m);
  return response.data;
}

// Favorites
export const favoriteCharacter = async (characterId: string) => {
  const response = await API.post(`characters/${characterId}/favorite/`);
  return response.data;
};

export const unfavoriteCharacter = async (characterId: string) => {
  const response = await API.post(`characters/${characterId}/unfavorite/`);
  return response.data;
};




// Auth endpoints
export const login = async (credentials: { username: string; password: string }) => {
  //console.log(credentials)
  const response = await API.post('users/check_credentials/', credentials);
  return response.data;
};

export const logout = async () => {
  await API.post('auth/token/logout/');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const signup = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await API.post('users/register/', userData);
  return response.data;
};

// Character management endpoints
export const createCharacter = async (data: { 
  formData: Omit<Character, 'id' | 'creator'>, 
  creator_id: number 
}) => {
  
  console.log("Front end",data);
  try{
  const response = await API.post<Character>('characters/create_character/', data);
  console.log(response.data);
  return response.data;
  }
  catch(error)
  {
    console.log(error);
    throw data;
  }
};
export const updateCharacter = async (id: string, characterData: Partial<Omit<Character, 'id' | 'creator'>>) => {
  const response = await API.put<Character>(`characters/${id}/`, characterData);
  return response.data;
};

export const deleteCharacter = async (id: string) => {
  await API.delete(`characters/${id}/`);
};

//Creates a new chat with the given character and user, returns the chat id
export const create_chat=async(json:{character_id: string, user_id: string})=>{
  console.log("(REACT API)Called create_chat with the following data:",json);
  const response = await API.post('chats/create_first_chat/', json);
  return response.data;
}
//Returns the first chat id for the given character and user. If no chat found, calls create_chat to create a new chat
export const get_first_chat=async(bot_id_userid_json: {character_id: string, user_id: string})=>{
  console.log("(REACT API)Called get_first_chat with the following data:",bot_id_userid_json);
  const response = await API.post('chats/get_first_chat/', bot_id_userid_json);
  console.log("Response from get_first_chat:",response.data["chat_id"]);
  if(response.data["chat_id"]==null){
    console.log("No chat found, creating a new one");
    return create_chat(bot_id_userid_json);}
  else
  return response.data;
}

// Fetches the chat history for a given user id, calling the API endpoint 'chats/get_chat_history/' with the user_id
export const getChatHistory = async (user_id: number) => {
  console.log("(API)Fetching chat history for user ID:", user_id);
  const json = { user_id: user_id };
  const response = await API.post('chats/get_chats/', json);
  console.log("(API)Chat history data:", response.data);
  return response.data;
};

// Fetches the chat messages for a given chat id
export const getChatMessages = async (chat_id: number) => {
  const json={ chat_id: chat_id };
  console.log("(API)Fetching chat messages for chat ID:", chat_id);
  const response = await API.post('messages/get_messages_list/',json);//Generates 405. Probably some router problem
  console.log("(API)Chat messages data:", response.data);
  return response.data;
};
//Stores a new message in the database, given the chat id and the message content
export const storeMessage = async (chat_id: number, message: { role: string, content: string, id: string }) => {
  console.log("(API)Storing message in chat ID:", chat_id, "with content:", message);
  const json = { chat_id: chat_id, message: message };
  const response = await API.post('messages/store_message/', json);
  console.log("(API)Message stored:", response.data);
  return response.data;
};



// User endpoints
// Fetches the current user based on the user_id
export const getCurrentUser = async (user_id: number) => {
  console.log("(API)Fetching current user with ID:", user_id);
  const json= {id: user_id};
  const response = await API.post('users/get_username/', json);
  console.log("(API)Current user data:", response.data);
  return response.data;
};


//Group Chat Endpoints
// Create a new group chat with multiple characters
export const createGroupChat = async (user_id: string, character_ids: string[]) => {
  console.log("(API) Creating group chat with:", { user_id, character_ids });
  const response = await API.post('group_chats/create_group_chat/', {
    user_id,
    character_ids
  });
  console.log("(API) Group chat created:", response.data);
  return response.data;
};

// Get existing group chat or return null
export const getGroupChat = async (user_id: string, character_ids: string[]) => {
  console.log("(API) Getting group chat for:", { user_id, character_ids });
  const response = await API.post('group_chats/get_group_chat/', {
    user_id,
    character_ids
  });
  console.log("(API) Group chat response:", response.data);
  return response.data;
};

// Get all group chats for a user
export const getGroupChats = async (user_id: string) => {
  console.log("(API) Fetching group chats for user ID:", user_id);
  const response = await API.post('group_chats/get_group_chats/', { user_id });
  console.log("(API) Group chats data:", response.data);
  return response.data;
};

// Get messages from a group chat
export const getGroupChatMessages = async (group_chat_id: string) => {
  console.log("(API:0) Fetching group chat messages for chat ID:", group_chat_id);
  console.log("(API:1) POST ROUTE: ", `group_chats/${group_chat_id}/messages/get_messages_list/`); 
  const response = await API.post(`group_chats/${group_chat_id}/messages/get_messages_list/`, {
    group_chat_id
  });
  console.log("(API) Group chat messages:", response.data);
  return response.data;
};

// Store a message in a group chat
export const storeGroupChatMessage = async (
  group_chat_id: string,
  message: { role: string; content: string; id: string }
) => {
  console.log("(API) Storing group chat message:", { group_chat_id, message });
  const response = await API.post(`group_chats/${group_chat_id}/messages/store_message/`, {
    group_chat_id,
    message
  });
  console.log("(API) Group chat message stored:", response.data);
  return response.data;
};

// Send message to group chat via OpenRouter
export const sendGroupChatMessage = async (
  bot_id: string,
  messages: { role: string; content: string }[],
  other_bot_ids: string[]
) => {
  console.log("(API) Sending group chat message to OpenRouter:", {
    bot_id,
    messages,
    other_bot_ids
  });
  const response = await API.post('chat/openrouter_chat/', {
    id: bot_id,
    messages,
    is_group_chat: true,
    other_bot_ids
  });
  return response.data;
};

// ============================================================================
// OPENROUTER API CONFIGURATION - Funcții pentru configurarea conexiunii
// ============================================================================

/**
 * TODO BACKEND: Implementează endpoint-ul pentru obținerea modelelor disponibile
 * 
 * Endpoint: GET /api/openrouter/models/
 * 
 * Returnează: { models: string[] }
 * Exemplu: { models: ["ChatGPT-4", "Claude-Sonnet-3.5", "Gemini-Pro", ...] }
 * 
 * Implementare sugerată în backend (Django):
 * - Creează un view în api/views/ (ex: openrouter_config_views.py)
 * - Funcția va face un request la OpenRouter API pentru a obține lista de modele
 * - Endpoint OpenRouter: https://openrouter.ai/api/v1/models
 * - Parseaza răspunsul și returnează doar numele modelelor
 */
export const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await API.get('openrouter/models/');
    return response.data.models || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    // Return some popular models as fallback for testing
    return [
      'ChatGPT-4',
      'Claude-Sonnet-3.5',
      'Gemini-Pro',
      'Llama-3.1-70B'
    ];
  }
};

/**
 * TODO BACKEND: Implementează endpoint-ul pentru testarea conexiunii API
 * 
 * Endpoint: POST /api/openrouter/test-connection/
 * 
 * Body: { api_key: string }
 * 
 * Returnează: { success: boolean, message?: string }
 * 
 * Implementare sugerată în backend (Django):
 * - Primește API key-ul în request body
 * - Fă un request simplu la OpenRouter API (ex: GET /api/v1/auth/key pentru validare)
 * - Headers: { "Authorization": f"Bearer {api_key}" }
 * - Dacă primești 200 OK, returnează { success: true }
 * - Dacă primești eroare (401, 403, etc.), returnează { success: false, message: "Invalid API key" }
 */
export const testAPIConnection = async (apiKey: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await API.post('openrouter/test-connection/', {
      api_key: apiKey
    });
    return response.data;
  } catch (error) {
    console.error('Error testing connection:', error);
    return { 
      success: false, 
      message: 'Could not connect to server' 
    };
  }
};

/**
 * TODO BACKEND: Implementează endpoint-ul pentru conectarea și salvarea configurației
 * 
 * Endpoint: POST /api/openrouter/connect/
 * 
 * Body: { api_key: string, model: string }
 * 
 * Returnează: { success: boolean, message?: string }
 * 
 * Implementare sugerată în backend (Django):
 * - Primește API key și modelul selectat
 * - Validează din nou API key-ul (opțional, dar recomandat)
 * - Salvează configurația pentru utilizatorul curent (în session sau în database)
 * - Opțiuni de salvare:
 *   1. Session: request.session['openrouter_api_key'] = api_key
 *   2. Database: Creează un model OpenRouterConfig cu user, api_key_encrypted, model
 * - Atenție: Criptează API key-ul înainte de a-l salva în database!
 * - Returnează { success: true } dacă totul e OK
 */
export const connectToAPI = async (
  apiKey: string, 
  model: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await API.post('openrouter/connect/', {
      api_key: apiKey,
      model: model
    });
    return response.data;
  } catch (error) {
    console.error('Error connecting to API:', error);
    return { 
      success: false, 
      message: 'Could not save configuration' 
    };
  }
};