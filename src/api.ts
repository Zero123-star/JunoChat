import axios from 'axios';
import type { Character } from '@/types/character';

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

// MOCK API for frontend preview (no backend required)

// Mock character data
let mockCharacters = [
  {
    id: '1',
    name: 'MockBot',
    description: 'A mock character for preview.',
    tags: 'fun,ai',
    color: '#ff00ff',
    creator: 'guest',
    avatar: '',
    public: true,
  },
];

// Mock chat messages
let mockMessages = [
  { sender: 'user', text: 'Hello!' },
  { sender: 'character', text: 'Hi! I am MockBot.' },
];

export const fetchCharacters = async () => Promise.resolve([...mockCharacters]);
export const fetchCharacter = async (id: string) => {
  // Defensive: if not found, add a fallback mock character
  let found = mockCharacters.find(c => String(c.id) === String(id));
  if (!found) {
    found = {
      id: String(id),
      name: 'Unknown Character',
      description: 'This is a fallback mock character.',
      tags: 'mock',
      color: '#cccccc',
      creator: 'guest',
      avatar: '',
      public: true,
    };
    mockCharacters.push(found);
  }
  return Promise.resolve(found);
};
export const createCharacter = async (data: any) => {
  const newChar = { ...data, id: String(Date.now()) };
  mockCharacters.push(newChar);
  // Sync to AI app
  await syncCharacterToAIApp(newChar);
  return Promise.resolve(newChar);
};
export const updateCharacter = async (id: string, data: any) => {
  mockCharacters = mockCharacters.map(c => c.id === id ? { ...c, ...data } : c);
  return Promise.resolve(mockCharacters.find(c => c.id === id));
};
export const deleteCharacter = async (id: string) => {
  mockCharacters = mockCharacters.filter(c => c.id !== id);
  return Promise.resolve();
};
export const fetchChats = async () => Promise.resolve([{ id: 'chat1', characterId: '1', messages: mockMessages }]);
export const fetchCharacterChat = async (characterId: string) => Promise.resolve({ id: 'chat1', characterId, messages: mockMessages });
export const login = async (_credentials: any) => Promise.resolve({ auth_token: 'mock-token' });
export const logout = async () => Promise.resolve();
export const signup = async (userData: any) => Promise.resolve({ ...userData, id: String(Date.now()) });
export const getCurrentUser = async () => Promise.resolve({ username: 'mockuser', is_moderator: false });
export const fetchUsers = async () => Promise.resolve([
  { id: 1, username: 'mockuser', email: 'mock@demo.com' },
  { id: 2, username: 'guest', email: 'guest@demo.com' },
]);
export const banUser = async (_userId: any) => Promise.resolve();

// Chat CRUD
export const editMessage = async (_chatId: string, messageId: number, newText: string) => {
  mockMessages[messageId].text = newText;
  return Promise.resolve();
};
export const deleteMessage = async (_chatId: string, messageId: number) => {
  mockMessages.splice(messageId, 1);
  return Promise.resolve();
};
export const rerollMessage = async (_chatId: string, messageId: number) => {
  mockMessages.splice(messageId + 1, 0, { sender: 'character', text: 'Rerolled response!' });
  return Promise.resolve();
};
export const deleteChat = async (_chatId: string) => {
  mockMessages = [];
  return Promise.resolve();
};

// Tag/Follow
export const followUser = async (_userId: any, _creatorId: any) => Promise.resolve();
export const fetchTags = async () => Promise.resolve(['fun', 'ai', 'anime']);
export const searchCharactersByTag = async (tag: string) => Promise.resolve(mockCharacters.filter(c => c.tags.includes(tag)));

// Fetch all AI app personas as characters
export const fetchAIAppCharacters = async () => {
  // This assumes you have an endpoint in your AI app that lists all personas (see below for backend suggestion)
  const res = await axios.get('http://localhost:8000/personas');
  // For each persona, fetch its details
  const personaNames: string[] = res.data;
  const details = await Promise.all(
    personaNames.map(async (name) => {
      const detailRes = await axios.get(`http://localhost:8000/persona/${encodeURIComponent(name)}`);
      const d = detailRes.data;
      return {
        id: name,
        name: d.name || name,
        description: d.persona || '',
        tags: '',
        color: '#cccccc',
        creator: 'ai-app',
        avatar: d.image_url || '',
        public: true,
      };
    })
  );
  return details;
};

// Helper to sync a local character to OpenRouter AI app (create if not exists)
export const syncCharacterToAIApp = async (character: Character) => {
  // Always POST to /personas, do not treat any error as success
  try {
    await axios.post('http://localhost:8000/personas', {
      name: character.name,
      persona: character.description,
      image_url: character.avatar,
      template: 'plain',
      generation_params: { max_new_tokens: 200, temperature: 0.7, top_p: 0.9 },
    });
    return true;
  } catch (e: any) {
    // Log error for debugging
    console.error('Failed to sync character to AI app:', e?.response?.data || e);
    return false;
  }
};