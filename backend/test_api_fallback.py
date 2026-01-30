#!/usr/bin/env python
"""
Test image fallback with actual API simulation
"""

import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
django.setup()

from django.test import Client
from api.models import CustomUser
import base64
from PIL import Image
from io import BytesIO

# Create a test image
img = Image.new('RGB', (100, 100), color='red')
img_bytes = BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)
image_data = img_bytes.getvalue()
b64_image = base64.b64encode(image_data).decode()
data_url = f"data:image/png;base64,{b64_image}"

print("=" * 60)
print("TEST 1: Create user via register API")
print("=" * 60)

# Clean up from previous test
CustomUser.objects.filter(username='api_test_user').delete()

client = Client()

# Register
response = client.post('/api/users/register/', {
    'username': 'api_test_user',
    'email': 'apitest@example.com',
    'password': 'testpass123'
}, content_type='application/json')

print(f"Register response: {response.status_code}")
if response.status_code == 200:
    data = json.loads(response.content)
    user_id = data.get('user_id')
    print(f"✓ Created user ID: {user_id}")
else:
    print(f"✗ Register failed: {response.content}")
    user = CustomUser.objects.create(username='api_test_user', email='apitest@example.com', password='testpass123')
    user_id = user.id
    print(f"✓ Created user manually ID: {user_id}")

print("\n" + "=" * 60)
print("TEST 2: Upload profile picture via API")
print("=" * 60)

# Update with profile picture
response = client.patch(f'/api/users/{user_id}/', {
    'profile_picture': data_url
}, content_type='application/json')

print(f"Update response: {response.status_code}")
if response.status_code == 200:
    print("✓ Profile picture uploaded")
    user = CustomUser.objects.get(id=user_id)
    print(f"✓ Binary data in DB: {bool(user.profile_picture_data)}")
    print(f"✓ MIME type: {user.profile_picture_mime}")
    print(f"✓ ImageField path: {user.profile_picture.name if user.profile_picture else 'None'}")
else:
    print(f"✗ Update failed: {response.content}")

print("\n" + "=" * 60)
print("TEST 3: Verify serializer returns correct URL")
print("=" * 60)

# GET the user
response = client.get(f'/api/users/{user_id}/')
if response.status_code == 200:
    user_data = json.loads(response.content)
    profile_url = user_data.get('profile_picture')
    if profile_url:
        if profile_url.startswith('data:image'):
            print(f"✓ Got data URL from serializer!")
            print(f"  URL length: {len(profile_url)}")
        elif profile_url.startswith('http'):
            print(f"✓ Got disk URL: {profile_url[:80]}...")
        else:
            print(f"✓ Got URL: {profile_url[:100]}")
    else:
        print(f"- profile_picture is null")

print("\n" + "=" * 60)
print("CLEANUP")
print("=" * 60)

user = CustomUser.objects.get(id=user_id)
user.delete()
print("✓ Test user deleted")

print("\n✅ API test completed!")
