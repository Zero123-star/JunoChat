from django.urls import reverse
from rest_framework.test import APITestCase
from base.models import CustomUser, Character, Chat, Message

class MessageTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='testuser', email='test@example.com', password='testpass')
        self.bot = Character.objects.create(name='TestBot', description='A test bot', creator=self.user)
        self.chat = Chat.objects.create(user=self.user, chatbot=self.bot)

    def test_create_message_user(self):
        url = reverse('chat-messages-list', kwargs={'chat_pk': self.chat.id})
        data = {
            'description': 'Hello from user!',
            'chat': self.chat.id,
            'sender_user': self.user.id,
            'sender_bot': None
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [201, 200])
        self.assertTrue(Message.objects.filter(chat=self.chat, description='Hello from user!').exists())

    def test_create_message_bot(self):
        url = reverse('chat-messages-list', kwargs={'chat_pk': self.chat.id})
        data = {
            'description': 'Hello from bot!',
            'chat': self.chat.id,
            'sender_user': None,
            'sender_bot': self.bot.id
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [201, 200])
        self.assertTrue(Message.objects.filter(chat=self.chat, description='Hello from bot!').exists())

    def test_get_messages_for_chat(self):
        Message.objects.create(chat=self.chat, description='Test message', sender_user=self.user)
        url = reverse('chat-messages-list', kwargs={'chat_pk': self.chat.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_message_missing_description(self):
        url = reverse('chat-messages-list', kwargs={'chat_pk': self.chat.id})
        data = {
            'chat': self.chat.id,
            'sender_user': self.user.id
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 422])

    def test_create_message_invalid_chat(self):
        url = reverse('chat-messages-list', kwargs={'chat_pk': 9999})
        data = {
            'description': 'Invalid chat',
            'chat': 9999,
            'sender_user': self.user.id
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 404])

    def test_create_message_invalid_sender(self):
        url = reverse('chat-messages-list', kwargs={'chat_pk': self.chat.id})
        data = {
            'description': 'Invalid sender',
            'chat': self.chat.id,
            'sender_user': 9999  # Invalid user ID
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [400, 404])
        