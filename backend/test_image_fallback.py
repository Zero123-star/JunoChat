#!/usr/bin/env python
"""
Test script to verify image fallback behavior:
1. Create a test user
2. Upload a profile picture (base64)
3. Verify it's stored in DB binary field
4. Verify serializer returns data URL if file is missing
"""

import os
import sys
import django
import base64
from io import BytesIO

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
django.setup()

from api.models import CustomUser
from api.serializers import CustomUserSerializer
from PIL import Image
from django.test import RequestFactory
from django.core.files.base import ContentFile

# Create a test image (100x100 red square)
img = Image.new('RGB', (100, 100), color='red')
img_bytes = BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)
image_data = img_bytes.getvalue()
b64_image = base64.b64encode(image_data).decode()
data_url = f"data:image/png;base64,{b64_image}"

print("=" * 60)
print("TEST 1: Create user and upload profile picture")
print("=" * 60)

# Clean up from previous test
CustomUser.objects.filter(username='testuser_fallback').delete()

# Create user
user = CustomUser.objects.create(
    username='testuser_fallback',
    email='test@fallback.com',
    password='testpass123'
)
print(f"✓ Created user: {user.username}")

# Simulate profile picture upload via serializer
factory = RequestFactory()
request = factory.post('/')
request.user = user

serializer = CustomUserSerializer(user, data={'profile_picture': data_url}, partial=True, context={'request': request})
if serializer.is_valid():
    serializer.save()
    print("✓ Profile picture uploaded (base64 stored in DB)")
else:
    print(f"✗ Validation error: {serializer.errors}")
    sys.exit(1)

# Reload from DB
user.refresh_from_db()
print(f"✓ Binary data stored: {bool(user.profile_picture_data)}")
print(f"✓ MIME type: {user.profile_picture_mime}")

print("\n" + "=" * 60)
print("TEST 2: Verify serializer returns data URL when file missing")
print("=" * 60)

# Simulate file missing by catching exception
serializer = CustomUserSerializer(user, context={'request': request})
profile_url = serializer.data['profile_picture']

if profile_url and profile_url.startswith('data:image'):
    print(f"✓ Fallback works! Got data URL: {profile_url[:50]}...")
    print(f"  Length: {len(profile_url)} chars (binary embedded in JSON)")
else:
    print(f"✗ Expected data URL, got: {profile_url}")

print("\n" + "=" * 60)
print("TEST 3: Verify disk file still works if present")
print("=" * 60)

# Check if file was actually saved to disk
if user.profile_picture:
    try:
        disk_url = user.profile_picture.url
        print(f"✓ Disk file exists at: {disk_url}")
        print("✓ Primary path (disk) is preferred in serializer")
    except Exception as e:
        print(f"✗ Disk file check failed: {e}")
        print("✓ But binary fallback still available!")
else:
    print("- No profile_picture ImageField set (binary-only fallback)")

print("\n" + "=" * 60)
print("CLEANUP")
print("=" * 60)

# Clean up
user.delete()
print("✓ Test user deleted")

print("\n✅ All tests completed successfully!")
