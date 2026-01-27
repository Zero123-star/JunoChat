from backend_game.game.npc import NPC
from backend_game.game.inventory import Inventory
from backend_game.game.moveset import Moveset
from backend_game.game.ability import Ability, formulas
from backend_game.game.statsheet import Statsheet
from backend_game.combat_engine import CombatEngine
import json

class GameManager:
    def __init__(self):
        self.ai_npc = None
        self.player_npc = None
        self.combat_engine = CombatEngine()
        self.turn_number = 0
        self.game_over = False
        self.winner = None
        self.MAX_HP=100
        self.MAX_MANA=100
        self.MAX_STAMINA=100

    def initialize_game(self):
        """Initialize a new combat game"""
        # AI Boss
        ai_inventory = Inventory()
        ai_moveset = Moveset([
            Ability("Fireball", formulas.fireball_damage, cost=20, cost_type="mana"),
            Ability("Cleave", formulas.cleave_damage, cost=15, cost_type="stamina"),
            Ability("Doom_Slash", formulas.base_formula, cost=30, cost_type="stamina")
        ])
        ai_stats = Statsheet({"STRENGTH": 5, "WISDOM": 8, "CONSTITUTION": 10})
        self.ai_npc = NPC(hp=200, mana=100, stamina=100, inventory=ai_inventory, moveset=ai_moveset, stats=ai_stats)
        
        # Player
        player_inventory = Inventory()
        player_moveset = Moveset([
            Ability("Slash", formulas.cleave_damage, cost=10, cost_type="stamina")
        ])
        player_stats = Statsheet({"STRENGTH": 3, "CONSTITUTION": 5})
        self.player_npc = NPC(hp=100, mana=50, stamina=50, inventory=player_inventory, moveset=player_moveset, stats=player_stats)
        
        self.turn_number = 0
        self.game_over = False
        self.winner = None
        
        return self.get_game_state()
    
    def get_game_state(self):
        """Get current game state"""
        return {
            "turn": self.turn_number,
            "game_over": self.game_over,
            "winner": self.winner,
            "ai": {
                "name": "Dark Sorcerer",
                "hp": self.ai_npc.get_health() if self.ai_npc else 0,
                "max_hp": self.MAX_HP*2 if self.ai_npc else 0,
                "mana": self.ai_npc.get_mana() if self.ai_npc else 0,
                "max_mana": self.MAX_MANA,
                "stamina": self.ai_npc.get_stamina() if self.ai_npc else 0,
                "max_stamina": self.MAX_STAMINA,
                "abilities": self.ai_npc.list_abilities() if self.ai_npc else []
            },
            "player": {
                "name": "Player",
                "hp": self.player_npc.get_health() if self.player_npc else 0,
                "max_hp": self.MAX_HP,
                "mana": self.player_npc.get_mana() if self.player_npc else 0,
                "max_mana": self.MAX_MANA,
                "stamina": self.player_npc.get_stamina() if self.player_npc else 0,
                "max_stamina": self.MAX_STAMINA,
                "abilities": self.player_npc.list_abilities() if self.player_npc else []
            }
        }
    
    def player_action(self, action_type, ability_name=None):
        """Execute player action"""
        if self.game_over:
            return {"error": "Game is over"}
        
        result = {"action": action_type, "success": False, "message": ""}
        
        if action_type == "attack" and ability_name:
            damage = self.player_npc.use_ability(ability_name)
            if damage is not None:
                final_damage = self.combat_engine.npc_calculate_damage(self.ai_npc, damage)
                self.ai_npc.change_health(-final_damage)
                result["success"] = True
                result["damage"] = final_damage
                result["message"] = f"Player used {ability_name}! Dealt {final_damage} damage!"
            else:
                result["message"] = "Not enough resources to use this ability!"
        
        elif action_type == "heal":
            heal_amount = 25
            self.player_npc.change_health(heal_amount)
            result["success"] = True
            result["heal"] = heal_amount
            result["message"] = f"Player healed for {heal_amount} HP!"
        
        # Check if AI is defeated
        if self.ai_npc.get_health() <= 0:
            self.game_over = True
            self.winner = "player"
            result["message"] += " AI defeated! Player wins!"
        
        return result
    
    def ai_action(self, ability_name):
        """Execute AI action"""
        if self.game_over:
            return {"error": "Game is over"}
        
        result = {"action": "attack", "success": False, "message": ""}
        
        damage = self.ai_npc.use_ability(ability_name)
        if damage is not None:
            final_damage = self.combat_engine.npc_calculate_damage(self.player_npc, damage)
            self.player_npc.change_health(-final_damage)
            result["success"] = True
            result["damage"] = final_damage
            result["message"] = f"AI used {ability_name}! Dealt {final_damage} damage!"
        else:
            result["message"] = "AI failed to use ability!"
        
        # Check if player is defeated
        if self.player_npc.get_health() <= 0:
            self.game_over = True
            self.winner = "ai"
            result["message"] += " Player defeated! AI wins!"
        
        return result
    
    def end_turn(self):
        """End turn and apply regeneration"""
        self.combat_engine.npc_end_turn(self.ai_npc)
        self.combat_engine.npc_end_turn(self.player_npc)
        self.turn_number += 1

# Global instance
GAME = GameManager()