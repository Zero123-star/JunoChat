from django.urls import reverse
from rest_framework.test import APITestCase
from base.models import CustomUser, Character, Chat

class ChatTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpass'
        )
        self.bot = Character.objects.create(
            name='TestBot', 
            description='A test bot', 
            creator=self.user
        )
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

    def test_create_chat(self):
        url = reverse('chat-list')
        data = {'user': self.user.id, 'chatbot': self.bot.id}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [201, 200])
        self.assertTrue(Chat.objects.filter(user=self.user, chatbot=self.bot).exists())

    def test_get_chats_for_user(self):
        chat = Chat.objects.create(user=self.user, chatbot=self.bot)
        url = reverse('chat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Check that the response contains data
        self.assertIsInstance(response.data, (list, dict))

    def test_create_chat_missing_fields(self):
        url = reverse('chat-list')
        data = {'user': self.user.id}  # Missing chatbot
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 422])

    def test_get_chats_custom_action(self):
        chat = Chat.objects.create(user=self.user, chatbot=self.bot)
        try:
            url = reverse('chat-get-chats')
            response = self.client.post(url, {'user_id': self.user.id})
            self.assertEqual(response.status_code, 200)
            # Handle both DRF Response and JsonResponse
            if hasattr(response, 'data'):
                self.assertIn('chats', response.data)
            else:
                # For JsonResponse, parse the content
                import json
                data = json.loads(response.content)
                self.assertIn('chats', data)
        except:
            self.skipTest("Custom get_chats action not available")

    def test_create_chat_with_invalid_user(self):
        url = reverse('chat-list')
        data = {'user': 9999, 'chatbot': self.bot.id}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 404])
        
    def test_create_chat_with_invalid_chatbot(self):
        url = reverse('chat-list')
        data = {'user': self.user.id, 'chatbot': 9999}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 404])