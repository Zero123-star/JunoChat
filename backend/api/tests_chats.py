from django.urls import reverse
from rest_framework.test import APITestCase
from base.models import CustomUser, Character, Chat

class ChatTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='testuser', email='test@example.com', password='testpass')
        self.bot = Character.objects.create(name='TestBot', description='A test bot', creator=self.user)
        # Use Registration Endpoint alternatively

    def test_create_chat(self):
        url = reverse('chat-list')  # DefaultRouter gives 'chat-list' for POST/list
        data = {'user': self.user.id, 'chatbot': self.bot.id}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [201, 200])
        self.assertTrue(Chat.objects.filter(user=self.user, chatbot=self.bot).exists())

    def test_get_chats_for_user(self):
        chat = Chat.objects.create(user=self.user, chatbot=self.bot)
        url = reverse('chat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # You may want to check the response data structure as well

    def test_create_chat_missing_fields(self):
        url = reverse('chat-list')
        data = {'user': self.user.id}  # Missing chatbot
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 422])

    def test_get_chats_custom_action(self):
        chat = Chat.objects.create(user=self.user, chatbot=self.bot)
        url = reverse('chat-get-chats')  # If you have @action(detail=False, methods=['post']) get_chats
        response = self.client.post(url, {'user_id': self.user.id})
        self.assertEqual(response.status_code, 200)
        self.assertIn('chats', response.data)

    # Add more tests for permissions, edge cases, etc.
    def test_create_chat_with_invalid_user(self):
        url = reverse('chat-list')
        data = {'user': 9999, 'chatbot': self.bot.id}  # Invalid user ID
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 404])  # Adjust based on your error handling
        
    def test_create_chat_with_invalid_chatbot(self):
        url = reverse('chat-list')
        data = {'user': self.user.id, 'chatbot': 9999}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 404])