import axios from 'axios';
import { API_BASE_URL } from './config';

const RPG_API = axios.create({
  baseURL: `${API_BASE_URL}/api/rpg/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
RPG_API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const initializeGame = async () => {
  const response = await RPG_API.post('initialize/');
  return response.data;
};

export const getGameState = async () => {
  const response = await RPG_API.get('state/');
  return response.data;
};

export const playerAction = async (actionType: string, abilityName?: string) => {
  const response = await RPG_API.post('player_action/', {
    action_type: actionType,
    ability_name: abilityName
  });
  return response.data;
};

export const aiAction = async () => {
  const response = await RPG_API.post('ai_action/');
  return response.data;
};

export const endTurn = async () => {
  const response = await RPG_API.post('end_turn/');
  return response.data;
};