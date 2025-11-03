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
# Example GET request
response = client.post('/api/characters/retrieve_character/', {'name': 'testing 101'})

print(response.status_code)
if response.status_code == 200:
    print(response.json())
#print(response.content.decode())
