"""
RPG Tools for AI Combat Decision Making
Defines the tool functions and schemas for the AI to interact with the game
"""
import json

# Tool function definitions
def get_my_abilities(game_manager):
    """Returns the list of ability names known by the AI NPC."""
    print("AI requested ability list.")
    if not game_manager.ai_npc:
        return "Error: AI NPC not initialized."
    abilities = game_manager.ai_npc.list_abilities()
    costs = []
    for ability_name in abilities:
        ability = game_manager.ai_npc.get_moveset().get_ability(ability_name)
        costs.append(f"{ability_name} (Cost: {ability.get_cost()} {ability.get_cost_type()})")
    return f"Your known abilities are: {', '.join(costs)}"

def get_my_status(game_manager):
    """Returns the current health, mana, and stamina of the AI NPC."""
    print("AI requested status.")
    if not game_manager.ai_npc:
        return "Error: Game not initialized."
    npc = game_manager.ai_npc
    return f"HP: {npc.get_health()}/{npc.get_max_health()}, Mana: {npc.get_mana()}/{npc.get_max_mana()}, Stamina: {npc.get_stamina()}/{npc.get_max_stamina()}"

def inspect_player(game_manager):
    """Returns the visible status of the player."""
    print("AI inspecting player status.")
    if not game_manager.player_npc:
        return "Error: Player not initialized."
    player = game_manager.player_npc
    return f"Player HP: {player.get_health()}/{player.get_max_health()}, Mana: {player.get_mana()}/{player.get_max_mana()}, Stamina: {player.get_stamina()}/{player.get_max_stamina()}"

def speak_to_player(game_manager, message):
    print(f"AI speaking to player: {message}")
    """Allows the AI to speak explicitly to the player."""
    return f"You said to Player: '{message}'"

def use_ability_on_player(game_manager, ability_name):
    """Uses a specific ability from the AI's moveset to attack the player."""
    print(f"AI attempting to use ability: {ability_name}")
    if not game_manager.ai_npc or not game_manager.player_npc:
        return "Error: Game entities not initialized."
    
    ai = game_manager.ai_npc
    if not ai.has_ability(ability_name):
        return f"Action Failed: You do not know the ability '{ability_name}'. Use 'get_my_abilities' to check your moves."
    
    # Check if AI has enough resources
    ability = ai.get_moveset().get_ability(ability_name)
    cost = ability.get_cost()
    cost_type = ability.get_cost_type()
    
    if cost_type == "mana" and ai.get_mana() < cost:
        return f"Action Failed: Not enough mana. You have {ai.get_mana()} but need {cost}."
    elif cost_type == "stamina" and ai.get_stamina() < cost:
        return f"Action Failed: Not enough stamina. You have {ai.get_stamina()} but need {cost}."
    
    # This will be handled by the game manager
    return f"READY_TO_ATTACK:{ability_name}"

# Tool schemas for OpenRouter
RPG_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_my_abilities",
            "description": "Get a list of abilities available to you with their costs. Call this to check what moves you have and their resource requirements.",
            "parameters": {"type": "object", "properties": {}},
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_status",
            "description": "Check your current HP, Mana, and Stamina including maximum values.",
            "parameters": {"type": "object", "properties": {}},
        }
    },
    {
        "type": "function",
        "function": {
            "name": "inspect_player",
            "description": "Check the opponent's current HP, Mana, and Stamina.",
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
            "name": "use_ability_on_player",
            "description": "Execute an attack ability against the player. This ends your turn.",
            "parameters": {
                "type": "object",
                "properties": {
                    "ability_name": {
                        "type": "string",
                        "description": "The exact name of the ability to use (e.g., 'Fireball', 'Cleave', 'Doom_Slash').",
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
}