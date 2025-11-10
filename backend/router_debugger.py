import django 
import os
from django.test import Client
import json

### Setup Django environment
print("Setting up Django environment...")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Django_MDS.settings")
django.setup()
client = Client()

print("Django setup complete!\n")
print("=" * 80)
print("TESTING GROUP CHAT ENDPOINTS")
print("=" * 80)

# Test data
ids = ["632b504c-2d0f-4156-adbb-2469a7f6af6e", "73e19c8a-1dd7-4bc6-8584-7f8f53e73aa2"]

# Test 1: Test endpoint for GroupChatViewSet
print("\n--- Test 1: GroupChatViewSet test_endpoint ---")
test_data = {
    'group_chat_id': "some-group-chat-id",
    'message': {
        'role': 'assistant',
        'content': 'This is a test message from the group chat bot.',
        'id': '73e19c8a-1dd7-4bc6-8584-7f8f53e73aa2'
    }
}

# Correct URL for custom action on viewset
response = client.post(
    '/api/group_chats/test_endpoint/',  # Note: starts with /api/ because it's added in main urls.py
    data=json.dumps(test_data),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    print(f"Response: {response.json()}")
else:
    print(f"Error: {response.content.decode()}")

# Test 2: Test endpoint for GroupChatMessageViewSet
print("\n--- Test 2: GroupChatMessageViewSet store_message ---")
store_message_request = {
  "description": "string",
  "group_chat": 0,
  "sender_user": 0,
  "sender_bot": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

# URL for nested router action
response2 = client.post(
    '/api/group_chats/0/messages/test_endpoint/',
    data=json.dumps(store_message_request),
    content_type='application/json'
)
print(f"Status Code: {response2.status_code}")
if response2.status_code == 200:
    print(f"Response: {response2.json()}")
else:
    print(f"Error: {response2.status_code}")
'''
# Test 3: Create a group chat
print("\n--- Test 3: Create Group Chat ---")
create_chat_data = {
    'user_id': 1,  # Use a real user ID
    'character_ids': ids
}

response3 = client.post(
    '/api/group_chats/create_group_chat/',
    data=json.dumps(create_chat_data),
    content_type='application/json'
)
print(f"Status Code: {response3.status_code}")
if response3.status_code == 200:
    print(f"Response: {response3.json()}")
    created_chat_id = response3.json().get('group_chat_id')
    
    # Test 4: Get messages list using the created chat
    if created_chat_id:
        print("\n--- Test 4: Get Messages List ---")
        response4 = client.post(
            '/api/group_chats/messages/get_messages_list/',
            data=json.dumps({'group_chat_id': created_chat_id}),
            content_type='application/json'
        )
        print(f"Status Code: {response4.status_code}")
        if response4.status_code == 200:
            print(f"Response: {response4.json()}")
        else:
            print(f"Error: {response4.content.decode()}")
else:
    print(f"Error: {response3.content.decode()}")

# Test 5: List all available endpoints
print("\n--- Test 5: Available Endpoints ---")
print("Group Chat endpoints:")
print("  POST /api/group_chats/create_group_chat/")
print("  POST /api/group_chats/get_group_chat/")
print("  POST /api/group_chats/get_group_chats/")
print("  POST /api/group_chats/test_endpoint/")
print("\nGroup Chat Message endpoints:")
print("  POST /api/group_chats/messages/get_messages_list/")
print("  POST /api/group_chats/messages/store_message/")
print("  POST /api/group_chats/messages/test_endpoint/")

print("\n" + "=" * 80)
print("TESTING COMPLETE")
print("=" * 80)
'''