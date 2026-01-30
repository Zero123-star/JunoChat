#!/usr/bin/env python
"""
Test avatar fallback for characters
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
django.setup()

from django.test import Client
from api.models import CustomUser, Character
import base64
import json
from PIL import Image
from io import BytesIO

# Create test image
img = Image.new('RGB', (100, 100), color='green')
img_bytes = BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)
image_data = img_bytes.getvalue()
b64_image = base64.b64encode(image_data).decode()
data_url = f"data:image/png;base64,{b64_image}"

print("=" * 60)
print("SETUP: Create user and character")
print("=" * 60)

CustomUser.objects.filter(username='char_test_user').delete()
Character.objects.filter(name='TestChar').delete()

# Create user
user = CustomUser.objects.create(username='char_test_user', email='chartest@example.com', password='testpass')
print(f"✓ Created user: {user.username}")

# Create character with avatar via API
client = Client()

# We'll create directly since character creation is more complex
char = Character.objects.create(
    name='TestChar',
    description='Test character',
    creator=user
)
print(f"✓ Created character: {char.name}")

print("\n" + "=" * 60)
print("TEST 1: Upload avatar via API")
print("=" * 60)

response = client.patch(f'/api/characters/{char.id}/', {
    'avatar': data_url
}, content_type='application/json')

print(f"Update response: {response.status_code}")
if response.status_code == 200:
    print("✓ Avatar uploaded")
    char.refresh_from_db()
    print(f"✓ Binary data in DB: {bool(char.avatar_data)} ({len(char.avatar_data) if char.avatar_data else 0} bytes)")
    print(f"✓ Disk file: {char.avatar.name if char.avatar else 'None'}")
else:
    print(f"✗ Update failed: {response.content}")

print("\n" + "=" * 60)
print("TEST 2: Delete disk file, verify fallback")
print("=" * 60)

# Delete file from disk
if char.avatar:
    file_path = char.avatar.path
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"✓ Deleted disk file")
    else:
        print(f"- File not found at: {file_path}")

# Fetch character
response = client.get(f'/api/characters/{char.id}/')
if response.status_code == 200:
    char_data = json.loads(response.content)
    avatar_url = char_data.get('avatar')
    
    if avatar_url:
        if avatar_url.startswith('data:image'):
            print("✓ FALLBACK WORKS! Got data URL when file missing")
            print(f"  URL length: {len(avatar_url)} chars")
        elif avatar_url.startswith('http'):
            print("✗ Still returning disk URL")
        else:
            print(f"? Got: {avatar_url[:100]}...")
    else:
        print("- avatar is null")

print("\n" + "=" * 60)
print("CLEANUP")
print("=" * 60)

char.delete()
user.delete()
print("✓ Cleaned up")

print("\n✅ Character avatar fallback test completed!")
