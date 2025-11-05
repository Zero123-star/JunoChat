import django 
import os
from django.test import Client

###Setup Django environment
print("!@#")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Django_MDS.settings")
django.setup()
client = Client()
###
print("123")
# Example GET/POST request
ids=["632b504c-2d0f-4156-adbb-2469a7f6af6e","73e19c8a-1dd7-4bc6-8584-7f8f53e73aa2"]
#response = client.post('/api/chat/test_endpoint/', {'ids': ids}, content_type='application/json')


openrouter_request={
    'id':"632b504c-2d0f-4156-adbb-2469a7f6af6e",
    'messages':[{'role':'user','content':'Hello bots!'},{'role':'assistant','content':'Hello user, I am scooby!'}, {'role':'assistant','content':'Hello user! I am johnny!'}],
    'is_group_chat':True,
    'other_bot_ids':ids
}
response = client.post('/api/chat/openrouter_chat/', openrouter_request, content_type='application/json')
if response.status_code == 200:
    print(response.json())
else:
    print("Error:", response.json())
#print(response.content.decode())
