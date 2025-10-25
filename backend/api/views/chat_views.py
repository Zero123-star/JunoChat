import requests###pip install requests
import json
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import CustomUser, Follow, Tag, Character, Message, Chat
from api.serializers import CustomUserSerializer, FollowSerializer, TagSerializer, CharacterSerializer, MessageSerializer, ChatSerializer, ChatListSerializer
import logging

logger = logging.getLogger(__name__)

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def create_first_chat(self,request):
        print("CREATE FIRST CHAT",request.data)
        #Creates a new chat with the given user and bot id
        user_id = request.data.get('user_id')
        bot_id = request.data.get('character_id')
        try:
            user = CustomUser.objects.get(id=user_id)
            bot = Character.objects.get(id=bot_id)
            chat = Chat.objects.create(user=user, chatbot=bot)
            return JsonResponse({'chat_id': chat.id})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Character.DoesNotExist:
            return JsonResponse({'error': 'Bot not found'}, status=404)
    #Returns null if no chat exists
    @action(detail=False, methods=['post'])
    def get_first_chat(self,request):
        print("GET FIRST CHAT",request.data)
        #Returns the first chat id of a user with a bot
        user_id = request.data.get('user_id')
        bot_id = request.data.get('character_id')
        print(user_id,bot_id)
        chat = Chat.objects.filter(user=user_id, chatbot=bot_id).first()#NOTE: hopefully id increments correctly, chat could probably use a timestamp column
        print("Still here")
        if chat is None:
            return JsonResponse({'chat_id': None})
        return JsonResponse({'chat_id': chat.id})

        
    @action(detail=False, methods=['post'])


    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatListSerializer
        return ChatSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def get_chats(self, request):
        user_id = request.data.get('user_id') ###Add .data, for now this is a test
        print("GET CHATS",user_id)
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
        try:
            user = CustomUser.objects.get(id=user_id)
            chats = Chat.objects.filter(user=user)
            chat_list = []
            for chat in chats:
                bot_id=chat.chatbot_id
                bot=Character.objects.get(id=bot_id)
                #Get the last message from the chat id. Message model has chat_id, description, and number(bigger number, last message sent)
                last_message = Message.objects.filter(chat_id=chat.id).order_by('-number').first()
                if last_message:
                    last_message_content = last_message.description
                else:
                    last_message_content = "NO MESSAGE"
                chat_list.append({
                    'id': str(chat.id),
                    'title': f"Chat with {chat.chatbot.name}",
                    'last_message': last_message_content,
                    'character_name': bot.name if bot else "Unknown Bot",
                    'character_id': str(bot.id)
                })
                print("Did")
            print(chat_list)

            return JsonResponse({'chats' : chat_list})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def get_messages(self, request):
        #Returns an array of openrouter format 
        chatid=request.data.get('chat_id')
        mn=Message.objects.filter(chat_id=chatid)

    @action(detail=False, methods=['post'])
    def get_messages_list(self, json):
        print("!@#")
        chatid= json.data.get('chat_id')
        print("GET MESSAGES LIST",chatid)
        messages = Message.objects.filter(chat_id=chatid).order_by('number')
        messages_list = []
        for message in messages:
            role = 'user' if message.sender_bot_id is None else 'assistant'
            messages_list.append({
                'role': role,
                'content': message.description
            })
        print(messages_list)
        return JsonResponse({'messages':messages_list})
    
    ## Receives a chat id and a message content, save the message to the db
    @action(detail=False, methods=['post'])
    def store_message(self, request):
        ###request={'chat_id', message:{content: any, role: any, id: any(only one id, either bot or user, depends on role. Yes database was designed poorly)}}
        ###
        ###
        print("CREATE MESSAGE",request.data)
        chatid = request.data.get('chat_id')
        content = request.data.get('message')
        role=content.get('role')
        id=content.get('id')
        print(chatid,content,role,id)
        messages = Message.objects.filter(chat_id=chatid).order_by('number')
        #Get the last message number
        last_message_number = messages.last().number if messages.exists() else 0
        # Create a new message
        if role == 'user':
            sender_user = id
            sender_bot = None
        elif role == 'assistant':
            sender_user = None
            sender_bot = id
        else:
            return JsonResponse({'error': 'Invalid role'}, status=400)
        print(chatid, content.get('content'), last_message_number + 1, sender_user, sender_bot)
        message = Message.objects.create(
            chat_id=chatid,
            description=content.get('content'),
            timestamp=None,
            number=last_message_number + 1,
            sender_user_id=sender_user,
            sender_bot_id=sender_bot
        )
        print("Succes")
        # Return the created message as JSON
        return JsonResponse({'response': 'Created'})

    def get_queryset(self):
        return Message.objects.filter(chat__user=self.request.user)
    
    def perform_create(self, serializer):
        chat = serializer.validated_data.get('chat')
        if chat.user == self.request.user:
            serializer.save(sender_user=self.request.user)

