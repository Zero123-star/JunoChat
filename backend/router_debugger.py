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

# URL for nested router action
response2 = client.post(
    '/api/rpg/initialize/',
    data=json.dumps({"some_key": "some_value"}),
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