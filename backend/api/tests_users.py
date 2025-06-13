from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.hashers import make_password
from base.models import CustomUser

class UserRegistrationTest(APITestCase):
    def test_register_user_success(self):
        url = reverse('customuser-register')
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'testpass1234'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(CustomUser.objects.filter(username='testuser').exists())

    def test_register_user_missing_fields(self):
        url = reverse('customuser-register')
        data = {'username': '', 'email': '', 'password': ''}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)

    def test_register_user_duplicate_username(self):
        # Use create_user to properly hash the password
        CustomUser.objects.create_user(username='testuser', email='test1@example.com', password='pass')
        url = reverse('customuser-register')
        data = {'username': 'testuser', 'email': 'test2@example.com', 'password': 'testpass1234'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)

class UserAuthenticationTest(APITestCase):
    def setUp(self):
        # Use create_user to properly hash the password
        self.user = CustomUser.objects.create_user(
            username='authuser', 
            email='auth@example.com', 
            password='pass'
        )

    def test_user_password_not_plaintext(self):
        # Use create_user which automatically hashes the password
        user = CustomUser.objects.create_user(
            username='secureuser', 
            email='secure@example.com', 
            password='plaintext'
        )
        self.assertNotEqual(user.password, 'plaintext')
        # Verify the password is hashed
        self.assertTrue(user.password.startswith('pbkdf2_sha256$'))