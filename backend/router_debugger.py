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
response = client.post('/api/users/get_username/', {'id': 1})

print(response.status_code)
#print(response.content.decode())
