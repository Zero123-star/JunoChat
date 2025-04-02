import axios from 'axios';
import { Character } from '@/types/character'; // Importă tipul dintr-un singur loc

// Configurarea URL-ului de bază al API-ului
const API = axios.create({
  baseURL: 'http://localhost:8000/api/', // Înlocuiește cu URL-ul backend-ului tău
});

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
  const response = await axios.get<Character[]>('http://127.0.0.1:8000/api/characters/');
  return response.data; // Returnează datele personajelor
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