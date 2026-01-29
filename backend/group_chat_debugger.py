import os
import django

# Setup Django environment BEFORE importing models
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
os.makedirs('logs', exist_ok=True)
django.setup()

# Now import models after Django is set up
from api.models import CustomUser, Character, GroupChat, GroupChatMessage

print("=" * 80)
print("GROUP CHAT DEBUGGER - Testing Suite")
print("=" * 80)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'=' * 80}")
    print(f"  {title}")
    print(f"{'=' * 80}\n")

def print_success(message):
    """Print success message"""
    print(f"✓ SUCCESS: {message}")

def print_error(message):
    """Print error message"""
    print(f"✗ ERROR: {message}")

def print_info(message):
    """Print info message"""
    print(f"ℹ INFO: {message}")


# ============================================================================
# 1. CREATE TEST DATA
# ============================================================================

def create_test_user(username="test_group_user"):
    """Create a test user for group chat testing"""
    print_section("Creating Test User")
    
    try:
        # Delete existing test user if exists
        CustomUser.objects.filter(username=username).delete()
        
        user = CustomUser.objects.create(
            username=username,
            email=f"{username}@test.com",
            password="test123",
            is_superuser=False,
            is_staff=False,
            is_active=True,
            confirmed_email=True,
            blocked=False
        )
        print_success(f"Created user: {user.username} (ID: {user.id})")
        return user
    except Exception as e:
        print_error(f"Failed to create user: {str(e)}")
        return None


def create_test_characters():
    """Create test characters for group chat"""
    print_section("Creating Test Characters")
    
    characters_data = [
        {
            "name": "Test Bot Alpha",
            "description": "A helpful AI assistant focused on coding and technical topics.",
            "source": "Test"
        },
        {
            "name": "Test Bot Beta",
            "description": "A creative AI assistant who loves storytelling and art.",
            "source": "Test"
        },
        {
            "name": "Test Bot Gamma",
            "description": "A logical AI assistant specialized in mathematics and science.",
            "source": "Test"
        }
    ]
    
    created_characters = []
    
    for char_data in characters_data:
        try:
            # Delete if exists
            Character.objects.filter(name=char_data["name"]).delete()
            
            character = Character.objects.create(
                name=char_data["name"],
                description=char_data["description"],
                source=char_data["source"]
            )
            created_characters.append(character)
            print_success(f"Created character: {character.name} (ID: {character.id})")
        except Exception as e:
            print_error(f"Failed to create character {char_data['name']}: {str(e)}")
    
    return created_characters


# ============================================================================
# 2. GROUP CHAT OPERATIONS
# ============================================================================

def create_group_chat(user, characters):
    """Create a group chat with multiple characters"""
    print_section("Creating Group Chat")
    
    if not user:
        print_error("No user provided")
        return None
    
    if not characters or len(characters) < 2:
        print_error("Need at least 2 characters for a group chat")
        return None
    
    try:
        group_chat = GroupChat.objects.create(user=user)
        
        # Add all characters to the group chat
        for character in characters:
            group_chat.chatbots.add(character)
        
        bot_names = ", ".join([bot.name for bot in characters])
        print_success(f"Created group chat (ID: {group_chat.id})")
        print_info(f"Participants: {bot_names}")
        
        return group_chat
    except Exception as e:
        print_error(f"Failed to create group chat: {str(e)}")
        return None


def list_all_group_chats(user):
    """List all group chats for a user"""
    print_section("Listing All Group Chats")
    
    if not user:
        print_error("No user provided")
        return []
    
    try:
        group_chats = GroupChat.objects.filter(user=user)
        
        if not group_chats.exists():
            print_info("No group chats found for this user")
            return []
        
        print_success(f"Found {group_chats.count()} group chat(s)")
        
        for gc in group_chats:
            bot_names = [bot.name for bot in gc.chatbots.all()]
            message_count = gc.messages.count()
            print(f"  • Chat ID {gc.id}: {', '.join(bot_names)} ({message_count} messages)")
        
        return list(group_chats)
    except Exception as e:
        print_error(f"Failed to list group chats: {str(e)}")
        return []


def send_user_message(group_chat, user, content):
    """Send a message from the user to the group chat"""
    print_section(f"Sending User Message")
    
    if not group_chat or not user:
        print_error("Invalid group chat or user")
        return None
    
    try:
        message = GroupChatMessage.objects.create(
            group_chat=group_chat,
            sender_user=user,
            sender_bot=None,
            description=content
        )
        print_success(f"User message sent (ID: {message.id}, Number: {message.number})")
        print_info(f"Content: '{content}'")
        return message
    except Exception as e:
        print_error(f"Failed to send user message: {str(e)}")
        return None


def send_bot_message(group_chat, character, content):
    """Send a message from a bot to the group chat"""
    print_section(f"Sending Bot Message ({character.name})")
    
    if not group_chat or not character:
        print_error("Invalid group chat or character")
        return None
    
    try:
        message = GroupChatMessage.objects.create(
            group_chat=group_chat,
            sender_user=None,
            sender_bot=character,
            description=content
        )
        print_success(f"Bot message sent (ID: {message.id}, Number: {message.number})")
        print_info(f"From: {character.name}")
        print_info(f"Content: '{content}'")
        return message
    except Exception as e:
        print_error(f"Failed to send bot message: {str(e)}")
        return None


def get_all_messages(group_chat):
    """Get all messages from a group chat in order"""
    print_section("Retrieving All Messages")
    
    if not group_chat:
        print_error("No group chat provided")
        return []
    
    try:
        messages = GroupChatMessage.objects.filter(group_chat=group_chat).order_by('number')
        
        if not messages.exists():
            print_info("No messages in this group chat")
            return []
        
        print_success(f"Found {messages.count()} message(s)")
        print("\nMessage History:")
        print("-" * 80)
        
        for msg in messages:
            sender = msg.sender_user.username if msg.sender_user else msg.sender_bot.name
            role = "USER" if msg.sender_user else "BOT"
            print(f"[{msg.number}] {role:6} | {sender:20} | {msg.description}")
        
        print("-" * 80)
        return list(messages)
    except Exception as e:
        print_error(f"Failed to retrieve messages: {str(e)}")
        return []


def get_messages_for_openrouter(group_chat):
    """Get messages in OpenRouter format (role + content)"""
    print_section("Converting Messages to OpenRouter Format")
    
    if not group_chat:
        print_error("No group chat provided")
        return []
    
    try:
        messages = GroupChatMessage.objects.filter(group_chat=group_chat).order_by('number')
        
        messages_list = []
        for message in messages:
            role = 'user' if message.sender_user else 'assistant'
            messages_list.append({
                'role': role,
                'content': message.description
            })
        
        print_success(f"Converted {len(messages_list)} messages to OpenRouter format")
        
        for i, msg in enumerate(messages_list, 1):
            print(f"  {i}. [{msg['role']:9}] {msg['content'][:60]}...")
        
        return messages_list
    except Exception as e:
        print_error(f"Failed to convert messages: {str(e)}")
        return []


def delete_specific_message(message_id):
    """Delete a specific message by ID"""
    print_section(f"Deleting Message ID {message_id}")
    
    try:
        message = GroupChatMessage.objects.get(id=message_id)
        message_number = message.number
        group_chat_id = message.group_chat.id
        
        message.delete()
        
        print_success(f"Deleted message #{message_number} from group chat {group_chat_id}")
        print_info("Message numbers have been automatically adjusted")
    except GroupChatMessage.DoesNotExist:
        print_error(f"Message with ID {message_id} not found")
    except Exception as e:
        print_error(f"Failed to delete message: {str(e)}")


def clear_all_messages(group_chat):
    """Delete all messages from a group chat"""
    print_section("Clearing All Messages")
    
    if not group_chat:
        print_error("No group chat provided")
        return
    
    try:
        messages = GroupChatMessage.objects.filter(group_chat=group_chat)
        count = messages.count()
        messages.delete()
        
        print_success(f"Deleted {count} message(s) from group chat {group_chat.id}")
    except Exception as e:
        print_error(f"Failed to clear messages: {str(e)}")


def delete_group_chat(group_chat):
    """Delete a group chat and all its messages"""
    print_section("Deleting Group Chat")
    
    if not group_chat:
        print_error("No group chat provided")
        return
    
    try:
        chat_id = group_chat.id
        message_count = group_chat.messages.count()
        
        group_chat.delete()
        
        print_success(f"Deleted group chat {chat_id}")
        print_info(f"Also deleted {message_count} message(s)")
    except Exception as e:
        print_error(f"Failed to delete group chat: {str(e)}")


def delete_all_group_chats(user):
    """Delete all group chats for a user"""
    print_section("Deleting All Group Chats")
    
    if not user:
        print_error("No user provided")
        return
    
    try:
        group_chats = GroupChat.objects.filter(user=user)
        count = group_chats.count()
        group_chats.delete()
        
        print_success(f"Deleted {count} group chat(s) for user {user.username}")
    except Exception as e:
        print_error(f"Failed to delete group chats: {str(e)}")


# ============================================================================
# 3. CLEANUP FUNCTIONS
# ============================================================================

def cleanup_test_data():
    """Delete all test data created by this script"""
    print_section("CLEANUP - Removing Test Data")
    
    try:
        # Delete test characters
        deleted_chars = Character.objects.filter(source="Test").delete()
        print_success(f"Deleted {deleted_chars[0]} test character(s)")
        
        # Delete test users
        deleted_users = CustomUser.objects.filter(username__startswith="test_group_").delete()
        print_success(f"Deleted {deleted_users[0]} test user(s)")
        
        print_info("Cleanup complete!")
    except Exception as e:
        print_error(f"Cleanup failed: {str(e)}")


# ============================================================================
# 4. MAIN TEST SCENARIOS
# ============================================================================

def run_basic_test():
    """Run a basic group chat creation and messaging test"""
    print_section("SCENARIO 1: Basic Group Chat Test")
    
    # Create test data
    user = create_test_user("test_group_user")
    characters = create_test_characters()
    
    if not user or len(characters) < 2:
        print_error("Failed to create test data")
        return
    
    # Create group chat with first 2 characters
    group_chat = create_group_chat(user, characters[:2])
    
    if not group_chat:
        return
    
    # Send some messages
    send_user_message(group_chat, user, "Hello everyone! How are you today?")
    send_bot_message(group_chat, characters[0], "Hello! I'm doing great, ready to help with any coding questions!")
    send_bot_message(group_chat, characters[1], "Hi there! I'm excited to share some creative ideas with you!")
    send_user_message(group_chat, user, "That's wonderful! Let's work together.")
    
    # Display all messages
    get_all_messages(group_chat)
    
    # Show OpenRouter format
    get_messages_for_openrouter(group_chat)
    
    return user, characters, group_chat


def run_multi_chat_test():
    """Test multiple group chats for the same user"""
    print_section("SCENARIO 2: Multiple Group Chats")
    
    user = create_test_user("test_multi_chat_user")
    characters = create_test_characters()
    
    if not user or len(characters) < 3:
        print_error("Failed to create test data")
        return
    
    # Create multiple group chats
    chat1 = create_group_chat(user, characters[:2])
    chat2 = create_group_chat(user, characters[1:3])
    chat3 = create_group_chat(user, characters)  # All characters
    
    # Add messages to different chats
    if chat1:
        send_user_message(chat1, user, "Chat 1 message")
        send_bot_message(chat1, characters[0], "Reply in chat 1")
    
    if chat2:
        send_user_message(chat2, user, "Chat 2 message")
        send_bot_message(chat2, characters[1], "Reply in chat 2")
    
    if chat3:
        send_user_message(chat3, user, "Chat 3 with all bots!")
    
    # List all chats
    list_all_group_chats(user)
    
    return user, characters, [chat1, chat2, chat3]


def run_message_deletion_test():
    """Test message deletion and renumbering"""
    print_section("SCENARIO 3: Message Deletion Test")
    
    user = create_test_user("test_delete_user")
    characters = create_test_characters()
    
    if not user or len(characters) < 2:
        return
    
    group_chat = create_group_chat(user, characters[:2])
    
    # Create 5 messages
    msg1 = send_user_message(group_chat, user, "Message 1")
    msg2 = send_bot_message(group_chat, characters[0], "Message 2")
    msg3 = send_user_message(group_chat, user, "Message 3")
    msg4 = send_bot_message(group_chat, characters[1], "Message 4")
    msg5 = send_user_message(group_chat, user, "Message 5")
    
    print("\n--- BEFORE DELETION ---")
    get_all_messages(group_chat)
    
    # Delete message 3
    if msg3:
        delete_specific_message(msg3.id)
    
    print("\n--- AFTER DELETING MESSAGE 3 ---")
    get_all_messages(group_chat)
    
    return user, characters, group_chat


# ============================================================================
# 5. MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    print("\n")
    print("╔" + "═" * 78 + "╗")
    print("║" + " " * 20 + "GROUP CHAT DEBUGGER - MENU" + " " * 32 + "║")
    print("╚" + "═" * 78 + "╝")
    
    print("\nUncomment the test scenario you want to run:\n")
    
    # ========================================================================
    # UNCOMMENT THE TEST YOU WANT TO RUN
    # ========================================================================
    
    # Test 1: Basic group chat creation and messaging
    user, characters, group_chat = run_basic_test()
    
    # Test 2: Multiple group chats
    # user, characters, chats = run_multi_chat_test()
    
    # Test 3: Message deletion and renumbering
    # user, characters, group_chat = run_message_deletion_test()
    
    # ========================================================================
    # MANUAL OPERATIONS (uncomment as needed)
    # ========================================================================
    
    # List all group chats for a user
    # list_all_group_chats(user)
    
    # Clear all messages from a chat
    # clear_all_messages(group_chat)
    
    # Delete a specific group chat
    # delete_group_chat(group_chat)
    
    # Delete all group chats for a user
    # delete_all_group_chats(user)
    
    # ========================================================================
    # CLEANUP (uncomment to remove all test data)
    # ========================================================================
    
    # cleanup_test_data()
    
    print("\n" + "=" * 80)
    print("  DONE! Check output above for results.")
    print("=" * 80 + "\n")