import axios from 'axios';
import { Character } from '@/types/character'; // Importă tipul dintr-un singur loc

// Configurarea URL-ului de bază al API-ului
const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  } //Openrouter API used to send a 401 error when no key was given. Hence great confusion as to why we got redirected to login when sending a message
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
  const response = await API.post('api/chat/', m);
  return response.data;
}




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
  creator_id: any 
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
export const getChatHistory = async (user_id: any) => {
  console.log("(API)Fetching chat history for user ID:", user_id);
  const json = { user_id: user_id };
  const response = await API.post('chats/get_chats/', json);
  console.log("(API)Chat history data:", response.data);
  return response.data;
};

// Fetches the chat messages for a given chat id
export const getChatMessages = async (chat_id: any) => {
  const json={ chat_id: chat_id };
  console.log("(API)Fetching chat messages for chat ID:", chat_id);
  const response = await API.post('messages/get_messages_list/',json);//Generates 405. Probably some router problem
  console.log("(API)Chat messages data:", response.data);
  return response.data;
};
//Stores a new message in the database, given the chat id and the message content
export const storeMessage = async (chat_id: any, message: { role: any, content: any, id: any }) => {
  console.log("(API)Storing message in chat ID:", chat_id, "with content:", message);
  const json = { chat_id: chat_id, message: message };
  const response = await API.post('messages/store_message/', json);
  console.log("(API)Message stored:", response.data);
  return response.data;
};



// User endpoints
// Fetches the current user based on the user_id
export const getCurrentUser = async (user_id: any) => {
  console.log("(API)Fetching current user with ID:", user_id);
  const json= {id: user_id};
  const response = await API.post('users/get_username/', json);
  console.log("(API)Current user data:", response.data);
  return response.data;
};