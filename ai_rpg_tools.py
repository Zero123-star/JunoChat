import json
from game.npc import NPC
from game.inventory import Inventory
from game.moveset import Moveset
from game.ability import Ability, formulas
from game.statsheet import Statsheet, Stats
from combat_logic import combat
# --- GAME STATE MANAGER ---
class GameManager:
    def __init__(self):
        self.ai_npc = None
        self.player_npc = None
        self.combat_engine = combat()
    def initialize_game(self):
        # 1. Setup AI NPC (The Boss)
        ai_inventory = Inventory()
        ai_moveset = Moveset([
            Ability("Fireball", formulas.fireball_damage, cost=20, cost_type="mana"),
            Ability("Cleave", formulas.cleave_damage, cost=15, cost_type="stamina"),
            Ability("Doom_Slash", formulas.base_formula, cost=30, cost_type="stamina") # Basic 30 dmg
        ])
        ai_stats = Statsheet({"STRENGTH": 5, "WISDOM": 8, "CONSTITUTION": 10})
        self.ai_npc = NPC(hp=200, mana=100, stamina=100, inventory=ai_inventory, moveset=ai_moveset, stats=ai_stats)

        # 2. Setup Player NPC (The Target)
        player_inventory = Inventory()
        player_moveset = Moveset([Ability("Slash", formulas.cleave_damage, cost=10, cost_type="stamina")])
        player_stats = Statsheet({"STRENGTH": 3, "CONSTITUTION": 5})
        self.player_npc = NPC(hp=100, mana=50, stamina=50, inventory=player_inventory, moveset=player_moveset, stats=player_stats)
        print("\n--- Game State Initialized ---")
        print(f"AI Boss HP: {self.ai_npc.get_health()}")
        print(f"Player HP: {self.player_npc.get_health()}")
        print("------------------------------\n")

# Global instance to be accessed by tool functions
GAME = GameManager()

# --- TOOL FUNCTIONS ---

def get_my_abilities(dummy_arg=None):
    """Returns the list of ability names known by the AI NPC."""
    if not GAME.ai_npc: return "Error: AI NPC not initialized."
    abilities = GAME.ai_npc.list_abilities()
    return f"Your known abilities are: {', '.join(abilities)}"

def get_my_status(dummy_arg=None):
    """Returns the current health, mana, and stamina of the AI NPC."""
    if not GAME.ai_npc: return "Error: Game not initialized."
    npc = GAME.ai_npc
    return f"HP: {npc.get_health()}, Mana: {npc.get_mana()}, Stamina: {npc.get_stamina()}"

def inspect_player(dummy_arg=None):
    """Returns the visible status of the player."""
    if not GAME.player_npc: return "Error: Player not initialized."
    return f"Player HP is currently: {GAME.player_npc.get_health()}"

def speak_to_player(message):
    """Allows the AI to speak explicitly to the player."""
    return f"You said to Player: '{message}'"

def Loving_whispers(dummy=None): 
    """Restores 100hp to the AI"""
    GAME.ai_npc.change_health(100)
    return f"Restored 100 hp"

def mage_armor(dummy=None):
    """Doubles constitution for 3 turns"""
    GAME.ai_npc.get_stats().remove_source("Mage_Armor")  # Remove existing Mage_Armor effects
    GAME.ai_npc.get_stats().add_temporary(stat="CONSTITUTION", value=GAME.ai_npc.get_stats().get_permanent_and_temporary("CONSTITUTION"), turns=3, source="Mage_Armor")
    return f"Your CONSTITUTION has been doubled for 3 turns."

def battle_trance(dummy=None):
    """Increases attack damage by 50% for 3 turns"""
    GAME.ai_npc.get_stats().remove_source("Battle_Trance")  # Remove existing Battle_Trance effects
    GAME.ai_npc.get_stats().add_temporary(stat="STRENGTH", value=int(GAME.ai_npc.get_stats().get_permanent_and_temporary("STRENGTH") * 0.5), turns=3, source="Battle_Trance")
    GAME.ai_npc.get_stats().add_temporary(stat="WISDOM", value=int(GAME.ai_npc.get_stats().get_permanent_and_temporary("WISDOM") * 0.5), turns=3, source="Battle_Trance")
    return f"Your STRENGTH has been increased by 50% for 3 turns."


def use_ability_on_player(ability_name):
    """Uses a specific ability from the AI's moveset to attack the player."""
    if not GAME.ai_npc or not GAME.player_npc: return "Error: Game entities not initialized."
    
    ai = GAME.ai_npc
    player = GAME.player_npc
    combat_engine = GAME.combat_engine
    if not ai.has_ability(ability_name):
        return f"Action Failed: You do not know the ability '{ability_name}'. Use 'get_my_abilities' to check your moves."

    # NPC.use_ability returns the damage integer
    damage = ai.use_ability(ability_name)
    
    if damage is None:
        return "Error: Failed to calculate damage (Ability logic returned None)."

    new_damage=combat_engine.npc_calculate_damage(player, damage)
    new_hp = player.change_health(-new_damage)
    return f"SUCCESS: You used '{ability_name}'. It dealt {damage} damage. Player HP is now {new_hp}."

# --- TOOL DEFINITIONS (JSON SCHEMA) ---

RPG_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_my_abilities",
            "description": "Get a list of abilities available to you. Call this to check what moves you have.",
            "parameters": {"type": "object", "properties": {}},
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_status",
            "description": "Check your current HP, Mana, and Stamina.",
            "parameters": {"type": "object", "properties": {}},
        }
    },
    {
        "type": "function",
        "function": {
            "name": "inspect_player",
            "description": "Check the status (HP) of the opponent.",
            "parameters": {"type": "object", "properties": {}},
        }
    },
    {
        "type": "function",
        "function": {
            "name": "speak_to_player",
            "description": "Speak to the player. Use this tool to taunt, reply, or make dramatic statements.",
            "parameters": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The message you want to say to the player."
                    }
                },
                "required": ["message"]
            },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "loving_whispers",
            "description": "Restores 100 HP to yourself, the AI",
            "parameters": {"type": "object","properties": {}},
            },
    },
    {
        "type": "function",
        "function": {
            "name": "mage_armor",
            "description": "For the next 3 turns, doubles your constitution, reducing twice as much damage from physical attacks. No mana cost",
            "parameters": {"type": "object","properties": {}},
            },
    },
    {
        "type": "function",
        "function": {
            "name": "use_ability_on_player",
            "description": "Execute an attack ability against the player.",
            "parameters": {
                "type": "object",
                "properties": {
                    "ability_name": {
                        "type": "string",
                        "description": "The exact name of the ability to use (e.g., 'Fireball').",
                    },
                },
                "required": ["ability_name"],
            },
        }
    }
]

RPG_FUNCTION_MAP = {
    'get_my_abilities': get_my_abilities,
    'get_my_status': get_my_status,
    'inspect_player': inspect_player,
    'speak_to_player': speak_to_player,
    'use_ability_on_player': use_ability_on_player,
    'loving_whispers' : Loving_whispers,
    'mage_armor' : mage_armor,
}