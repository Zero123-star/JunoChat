import axios from 'axios';

const RPG_API = axios.create({
  baseURL: 'http://localhost:8000/api/rpg/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initializeGame = async () => {
  const response = await RPG_API.post('initialize/');
  return response.data;
};

export const getGameState = async () => {
  const response = await RPG_API.get('state/');
  return response.data;
};

export const setApiKey = async (apiKey: string) => {
  const response = await RPG_API.post('set_api_key/', {
    api_key: apiKey
  });
  return response.data;
};

export const playerAction = async (actionType: string, abilityName?: string, message?: string) => {
  const response = await RPG_API.post('player_action/', {
    action_type: actionType,
    ability_name: abilityName,
    message: message
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