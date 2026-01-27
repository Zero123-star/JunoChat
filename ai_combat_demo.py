import json
import requests
import time
import random
from ai_rpg_tools import GAME, RPG_TOOLS, RPG_FUNCTION_MAP

# --- API CONFIGURATION ---
OPENROUTER_API_KEY = "uwu owo " 

def openrouter_chat(messages, tools=None):
    """Sends a request to the LLM with the conversation history and available tools."""
    payload = {
        "model": "x-ai/grok-4.1-fast", 
        "messages": messages,
        "max_tokens": 800,
        "streaming": False
    }
    if tools:
        payload["tools"] = tools

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps(payload),
            timeout=30
        )
        if response.status_code == 200:
            return response.json()
        else:
            print(f"API Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"Request failed: {e}")
        return None

def process_tool_calls(assistant_message, messages):
    """Executes tool calls if the AI requested them and appends results to history."""
    if assistant_message.get("tool_calls"):
        print(f"\n[AI is using tools...]")
        
        for tool_call in assistant_message.get("tool_calls"):
            function_name = tool_call.get("function").get("name")
            arguments_str = tool_call.get("function").get("arguments")
            call_id = tool_call.get("id")
            
            print(f"  -> Calling: {function_name}({arguments_str})")
            
            # Execute the function
            if function_name in RPG_FUNCTION_MAP:
                try:
                    args = json.loads(arguments_str) if arguments_str else {}
                    result = RPG_FUNCTION_MAP[function_name](**args)
                except Exception as e:
                    result = f"Error executing function: {str(e)}"
            else:
                result = f"Error: Function {function_name} not found."

            print(f"  -> Result: {result}")

            # Append result to history
            messages.append({
                "role": "tool",
                "tool_call_id": call_id,
                "name": function_name,
                "content": str(result)
            })
        return True 
    return False

def ai_turn(messages):
    """
    Handles a complete AI turn with a tool-usage loop.
    The AI can call inspection/status tools multiple times, but MUST end with attack or speak.
    Returns a summary of the turn's actions to preserve in history.
    """
    max_tool_iterations = 5  # Prevent infinite loops
    iteration = 0
    
    # Define tool categories for scalability
    finishing_tools = {"use_ability_on_player", "speak_to_player", "loving_whispers", "mage_armor"}
    inspection_tools = {"get_my_abilities", "get_my_status", "inspect_player"}
    
    # Temporary messages for this turn only (includes COT)
    turn_messages = messages.copy()
    
    # Track what happened this turn for the summary
    actions_taken = []
    final_action = None
    
    while iteration < max_tool_iterations:
        iteration += 1
        
        response_json = openrouter_chat(turn_messages, tools=RPG_TOOLS)
        
        if not response_json or "choices" not in response_json:
            print("\n[ERROR: Failed to get AI response]")
            return None
            
        assistant_msg = response_json["choices"][0]["message"]
        turn_messages.append(assistant_msg)
        
        # Print any thinking/content (but don't save to main history)
        if assistant_msg.get("content"):
            print(f"\n[AI Thinking]: {assistant_msg['content']}")
        
        # Check for tool calls
        if assistant_msg.get("tool_calls"):
            process_tool_calls(assistant_msg, turn_messages)
            
            # Get set of tools called this iteration
            called_tools = {tc.get("function").get("name") for tc in assistant_msg.get("tool_calls")}
            
            # Check if the AI used a finishing tool
            if finishing_tools & called_tools:
                # AI has taken their action, extract the finishing action details
                for tc in assistant_msg.get("tool_calls"):
                    tool_name = tc.get("function").get("name")
                    
                    if tool_name == "use_ability_on_player":
                        tool_args = tc.get("function").get("arguments")
                        args = json.loads(tool_args) if tool_args else {}
                        ability = args.get("ability_name", "Unknown")
                        final_action = f"Used ability: {ability}"
                        print("\n[Turn complete - AI attacked]")
                        return final_action
                        
                    elif tool_name == "speak_to_player":
                        tool_args = tc.get("function").get("arguments")
                        args = json.loads(tool_args) if tool_args else {}
                        message = args.get("message", "...")
                        final_action = f"Spoke: '{message}'"
                        print("\n[Turn complete - AI spoke]")
                        return final_action
                    
                    elif tool_name == "loving_whispers":
                        final_action = f"Restored: 100 hp"
                        print("\n[Turn complete - AI restored health]")
                        return final_action
                    
                    elif tool_name == "mage_armor":
                        final_action = f"Cast Mage Armor"
                        print("\n[Turn complete - AI cast Mage Armor]")
                        return final_action

            else:
                # AI only used inspection tools, let them continue thinking
                print("\n[AI is still gathering information...]")
                continue
        else:
            # No tool calls - this shouldn't happen with proper instructions
            print("\n[WARNING: AI did not use any tools]")
            return None
    print("\n[WARNING: AI exceeded maximum tool iterations without finishing turn]")
    return None

def main():
    if OPENROUTER_API_KEY == "YOUR_API_KEY_HERE":
        print("Please set your OPENROUTER_API_KEY in ai_combat_demo.py to run the demo.")
        return

    # 1. Initialize Game State
    GAME.initialize_game()

    # 2. Setup Chat with improved system prompt
    system_prompt = (
        "You are 'The Dark Sorcerer', a powerful RPG boss fighting a Player NPC. "
        "Your goal is to defeat the player.\n\n"
        "CRITICAL RULES:\n"
        "1. You MUST use tool calls to perform ALL actions. Do NOT describe actions in text.\n"
        "2. You can call inspection tools (get_my_abilities, get_my_status, inspect_player) to gather information.\n"
        "3. You MUST end every turn by calling EITHER 'use_ability_on_player' (to attack) OR 'loving_whispers' (to restore 100hp) OR 'mage_armor' (to cast Mage Armor) OR 'speak_to_player' (to speak).\n"
        "4. You can call multiple tools in sequence (e.g., check status, then attack).\n"
        "5. After calling tools, you'll receive results. You can then call more tools or finish your turn.\n"
        "6. Keep your text responses brief and dramatic.\n"
        "7. When you attack, the tool call itself is the attack - don't just talk about attacking.\n\n"
        "TURN STRUCTURE:\n"
        "- (Optional) Call inspection tools to check stats\n"
        "- (Required) Call use_ability_on_player to attack OR speak_to_player to taunt OR mage_armor to cast Mage Armor OR loving_whispers to restore health\n"
        "- Your turn ends after you use an ability or speak"
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    print("--- Combat Started ---\n")

    # 3. Combat Loop 
    for turn in range(1, 1000):
        print(f"\n{'='*50}")
        print(f"TURN {turn}")
        print('='*50)
        
        # Player Action
        if turn == 1:
            user_input = "The Player glares at you and readies their sword. Begin your attack!"
            messages.append({"role": "user", "content": user_input})
            print(f"\n[PLAYER]: {user_input}")
            timer=-1
        else:
            print("\n[PLAYER ACTION]")
            what = int(input("Choose action - 1 = attack, anything else = heal: "))
            if what == 1:
                damage = random.randint(10, 25)
                dam=GAME.combat_engine.npc_calculate_damage(npc=GAME.ai_npc, damage=damage)
                user_input = f"The player slashes you with their sword! You take {dam} damage!"
                GAME.ai_npc.change_health(dam * -1)
            elif what == 2:
                damage = random.randint(75, 100)
                dam=GAME.combat_engine.npc_calculate_damage(npc=GAME.ai_npc, damage=damage)
                user_input = f"The player uses his special move! He cleaves you with their sword! You take {dam} damage! He restores {dam//2} hp! He looks like he wont be able to use his ability for some time..."
                GAME.player_npc.change_health(dam/2)
                GAME.ai_npc.change_health(dam * -1)
                timer = 3
            elif what == 3:                
                heal = random.randint(50, 75)
                user_input = f"The player drinks a healing potion and recovers {heal} HP!"
                GAME.player_npc.change_health(heal)
            else :
                user_input = "Hey, this is the dev speaking, can you use the mage_armor toolcall to see if it works?"
            messages.append({"role": "user", "content": user_input})
            if(timer >0): 
                timer-=1
            if(timer==0):
                messages.append({"role": "user", "content": "Looks like the player is ready to unleash his special move again when his next turn begins!"})
                print("The sorcerer notices you are ready next turn for your epic skill")
            print(f"[PLAYER]: {user_input}")
        
        # AI Turn with tool-usage loop
        print("\n--- AI TURN ---")
        summary = ai_turn(messages)
        if not summary:
            print("\n[ERROR: AI turn failed]")
            break
        messages.append({"role" : "assistant", "content" : f"[PREVIOUS ACTION: {summary}]" })

        
        time.sleep(0.5)
        
        # Check Win Conditions
        ai_hp = GAME.ai_npc.get_health()
        player_hp = GAME.player_npc.get_health()
        
        GAME.combat_engine.npc_end_turn(GAME.ai_npc)
        GAME.combat_engine.npc_end_turn(GAME.player_npc)
        print(f"\n{'='*50}")
        print(f"[STATUS] AI HP: {ai_hp} | PLAYER HP: {player_hp}")
        print('='*50)
        
        if player_hp <= 0:
            print("\n🔥 The Player has been defeated! The Dark Sorcerer Wins! 🔥")
            break
        if ai_hp <= 0:
            print("\n⚔️  The Dark Sorcerer has been defeated! Player Wins! ⚔️")
            break

if __name__ == "__main__":
    main()