#!/usr/bin/env python
"""
Test that fallback works when disk file is deleted
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
django.setup()

from django.test import Client
from api.models import CustomUser
import base64
import json
from PIL import Image
from io import BytesIO

# Create a test image
img = Image.new('RGB', (100, 100), color='blue')
img_bytes = BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)
image_data = img_bytes.getvalue()
b64_image = base64.b64encode(image_data).decode()
data_url = f"data:image/png;base64,{b64_image}"

print("=" * 60)
print("SETUP: Create user with profile picture")
print("=" * 60)

CustomUser.objects.filter(username='fallback_test_user').delete()

client = Client()
response = client.post('/api/users/register/', {
    'username': 'fallback_test_user',
    'email': 'fallbacktest@example.com',
    'password': 'testpass123'
}, content_type='application/json')

user_id = json.loads(response.content)['user_id']
print(f"✓ Created user ID: {user_id}")

# Upload profile picture
response = client.patch(f'/api/users/{user_id}/', {
    'profile_picture': data_url
}, content_type='application/json')
print(f"✓ Uploaded profile picture")

user = CustomUser.objects.get(id=user_id)
print(f"✓ Binary data in DB: {bool(user.profile_picture_data)} ({len(user.profile_picture_data) if user.profile_picture_data else 0} bytes)")
print(f"✓ Disk file: {user.profile_picture.name}")

print("\n" + "=" * 60)
print("TEST 1: Verify disk URL before deletion")
print("=" * 60)

response = client.get(f'/api/users/{user_id}/')
user_data = json.loads(response.content)
profile_url = user_data.get('profile_picture')
print(f"URL: {profile_url[:80]}...")
if profile_url.startswith('http'):
    print("✓ Getting disk URL (file exists)")

print("\n" + "=" * 60)
print("TEST 2: Delete disk file, verify fallback to binary")
print("=" * 60)

# Delete the file from disk
if user.profile_picture:
    file_path = user.profile_picture.path
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"✓ Deleted disk file: {file_path}")
    else:
        print(f"- File not at expected path: {file_path}")

# Now fetch again - should get data URL
response = client.get(f'/api/users/{user_id}/')
user_data = json.loads(response.content)
profile_url = user_data.get('profile_picture')

if profile_url:
    if profile_url.startswith('data:image'):
        print("✓ FALLBACK WORKS! Got data URL when file missing")
        print(f"  Data URL length: {len(profile_url)} chars")
        print(f"  MIME type: {profile_url.split(';')[0]}")
    elif profile_url.startswith('http'):
        print("✗ Still returning disk URL even though file is deleted")
        print(f"  URL: {profile_url[:80]}...")
    else:
        print(f"? Got unexpected URL: {profile_url[:100]}...")
else:
    print("✗ profile_picture is null")

print("\n" + "=" * 60)
print("CLEANUP")
print("=" * 60)

user.delete()
print("✓ Test user deleted")

print("\n✅ Fallback test completed!")
