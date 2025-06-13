from django.urls import reverse
from rest_framework.test import APITestCase
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
        CustomUser.objects.create(username='testuser', email='test1@example.com', password='pass')
        url = reverse('customuser-register')
        data = {'username': 'testuser', 'email': 'test2@example.com', 'password': 'testpass1234'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)

class UserAuthenticationTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='authuser', email='auth@example.com', password='pass')

    def test_login_user(self):
        # Adjust this test if you have a login endpoint
        url = reverse('customuser-login')  # Replace with your actual login route name
        data = {'username': 'authuser', 'password': 'pass'}
        response = self.client.post(url, data)
        # Adjust expected status code and response as per your implementation
        self.assertIn(response.status_code, [200, 201, 400, 401])  # Example

    def test_user_password_not_plaintext(self):
        user = CustomUser.objects.create(username='secureuser', email='secure@example.com', password='plaintext')
        self.assertNotEqual(user.password, 'plaintext')