import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Swords, Heart, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { initializeGame, playerAction, aiAction, endTurn, getGameState } from '../rpgApi';

interface NPCState {
  name: string;
  hp: number;
  max_hp: number;
  mana: number;
  max_mana: number;
  stamina: number;
  max_stamina: number;
  abilities: string[];
}

interface GameState {
  turn: number;
  game_over: boolean;
  winner: string | null;
  ai: NPCState;
  player: NPCState;
}

const RPGCombatDemo: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const addToLog = (message: string) => {
    setCombatLog(prev => [...prev, `[Turn ${gameState?.turn || 0}] ${message}`]);
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const state = await initializeGame();
      setGameState(state);
      setCombatLog(['Game initialized! Combat begins!']);
      toast.success('Combat started!');
    } catch (error) {
      toast.error('Failed to start game');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerAttack = async (abilityName: string) => {
    if (!gameState || gameState.game_over) return;
    
    setLoading(true);
    try {
      const response = await playerAction('attack', abilityName);
      setGameState(response.game_state);
      addToLog(response.result.message);
      
      if (!response.game_state.game_over) {
        setTimeout(() => handleAITurn(), 1000);
      }
    } catch (error) {
      toast.error('Failed to execute action');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerHeal = async () => {
    if (!gameState || gameState.game_over) return;
    
    setLoading(true);
    try {
      const response = await playerAction('heal');
      setGameState(response.game_state);
      addToLog(response.result.message);
      
      if (!response.game_state.game_over) {
        setTimeout(() => handleAITurn(), 1000);
      }
    } catch (error) {
      toast.error('Failed to heal');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAITurn = async () => {
    setLoading(true);
    try {
      const response = await aiAction();
      setGameState(response.game_state);
      addToLog(response.result.message);
      
      if (!response.game_state.game_over) {
        const endResponse = await endTurn();
        setGameState(endResponse);
        addToLog('Turn ended. Regeneration applied.');
      }
    } catch (error) {
      toast.error('AI action failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const HealthBar = ({ current, max, label }: { current: number; max: number; label: string }) => {
    const percentage = (current / max) * 100;
    return (
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{label}</span>
          <span>{current} / {max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const ResourceBar = ({ current, max, label, color }: { current: number; max: number; label: string; color: string }) => {
    const percentage = (current / max) * 100;
    return (
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{label}</span>
          <span>{current} / {max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-8">RPG Combat Demo</h1>
          <Button onClick={startGame} gradient className="px-8 py-4 text-xl" disabled={loading}>
            {loading ? 'Initializing...' : 'Start Combat'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">RPG Combat Demo</h1>
          <p className="text-xl text-purple-300">Turn {gameState.turn}</p>
        </div>

        {/* Game Over Screen */}
        {gameState.game_over && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center max-w-md">
              <h2 className="text-3xl font-bold mb-4">
                {gameState.winner === 'player' ? '🎉 Victory!' : '💀 Defeated!'}
              </h2>
              <p className="text-xl mb-6">
                {gameState.winner === 'player' 
                  ? 'You have defeated the Dark Sorcerer!' 
                  : 'The Dark Sorcerer has defeated you!'}
              </p>
              <Button onClick={startGame} gradient>
                Play Again
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Swords className="text-red-500" />
                {gameState.ai.name}
              </h2>
            </div>
            
            <HealthBar current={gameState.ai.hp} max={gameState.ai.max_hp} label="HP" />
            <ResourceBar current={gameState.ai.mana} max={gameState.ai.max_mana} label="Mana" color="bg-blue-500" />
            <ResourceBar current={gameState.ai.stamina} max={gameState.ai.max_stamina} label="Stamina" color="bg-green-500" />
            
            <div className="mt-4">
              <h3 className="text-white font-semibold mb-2">Abilities:</h3>
              <div className="space-y-1">
                {gameState.ai.abilities.map((ability, idx) => (
                  <div key={idx} className="text-purple-300 text-sm">• {ability}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Combat Log */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Combat Log</h2>
            <div className="h-96 overflow-y-auto space-y-2">
              {combatLog.map((log, idx) => (
                <div key={idx} className="text-sm text-gray-300 p-2 bg-black/30 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Player Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="text-blue-500" />
                {gameState.player.name}
              </h2>
            </div>
            
            <HealthBar current={gameState.player.hp} max={gameState.player.max_hp} label="HP" />
            <ResourceBar current={gameState.player.mana} max={gameState.player.max_mana} label="Mana" color="bg-blue-500" />
            <ResourceBar current={gameState.player.stamina} max={gameState.player.max_stamina} label="Stamina" color="bg-green-500" />
            
            <div className="mt-6 space-y-3">
              <h3 className="text-white font-semibold">Your Actions:</h3>
              
              {gameState.player.abilities.map((ability) => (
                <Button
                  key={ability}
                  onClick={() => handlePlayerAttack(ability)}
                  disabled={loading || gameState.game_over}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Swords className="h-4 w-4" />
                  {ability}
                </Button>
              ))}
              
              <Button
                onClick={handlePlayerHeal}
                disabled={loading || gameState.game_over}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Heart className="h-4 w-4" />
                Heal (25 HP)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPGCombatDemo;