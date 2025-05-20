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
  const response = await API.post('auth/register/', userData);
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

// User endpoints
export const getCurrentUser = async () => {
  const response = await API.get('users/me/');
  return response.data;
};