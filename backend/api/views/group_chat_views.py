from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from django.http import JsonResponse
from api.models import CustomUser, Character, GroupChat, GroupChatMessage
from api.serializers import GroupChatSerializer, GroupChatMessageSerializer

class GroupChatViewSet(viewsets.ModelViewSet):
    serializer_class = GroupChatSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def test_endpoint(self, request, *args, **kwargs):
        group_chat_pk = kwargs.get('group_chat_pk')
        print("TEST GROUP CHAT ENDPOINT REACHED")
        return JsonResponse({'message': 'Group Chat endpoint is working!'})

    @action(detail=False, methods=['post'])
    def create_group_chat(self, request):
        """Create a new group chat with multiple bots"""
        print("CREATE GROUP CHAT", request.data)
        user_id = request.data.get('user_id')
        bot_ids = request.data.get('character_ids', [])  # List of character IDs
        
        try:
            user = CustomUser.objects.get(id=user_id)
            group_chat = GroupChat.objects.create(user=user)
            
            # Add all bots to the group chat
            for bot_id in bot_ids:
                bot = Character.objects.get(id=bot_id)
                group_chat.chatbots.add(bot)
            
            return JsonResponse({'group_chat_id': group_chat.id})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Character.DoesNotExist:
            return JsonResponse({'error': 'One or more bots not found'}, status=404)
    
    @action(detail=False, methods=['post'])
    def get_group_chat(self, request):
        print("GET GROUP CHAT", request.data)
        """Get existing group chat or return None"""
        user_id = request.data.get('user_id')
        bot_ids = request.data.get('character_ids', [])
        
        try:
            user = CustomUser.objects.get(id=user_id)
            # Find group chat with exact same bots
            group_chats = GroupChat.objects.filter(user=user)
            
            for gc in group_chats:
                gc_bot_ids = set(str(bot.id) for bot in gc.chatbots.all())
                if gc_bot_ids == set(bot_ids):
                    return JsonResponse({'group_chat_id': gc.id})
            
            return JsonResponse({'group_chat_id': None})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    
    @action(detail=False, methods=['post'])
    def get_group_chats(self, request):
        """Get all group chats for a user"""
        user_id = request.data.get('user_id')
        
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
        
        try:
            user = CustomUser.objects.get(id=user_id)
            group_chats = GroupChat.objects.filter(user=user)
            chat_list = []
            
            for gc in group_chats:
                bot_names = [bot.name for bot in gc.chatbots.all()]
                bot_ids = [str(bot.id) for bot in gc.chatbots.all()]
                
                last_message = GroupChatMessage.objects.filter(group_chat_id=gc.id).order_by('-number').first()
                last_message_content = last_message.description if last_message else "NO MESSAGE"
                
                chat_list.append({
                    'id': str(gc.id),
                    'title': f"Group chat with {', '.join(bot_names)}",
                    'last_message': last_message_content,
                    'character_names': bot_names,
                    'character_ids': bot_ids
                })
            
            return JsonResponse({'group_chats': chat_list})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


class GroupChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = GroupChatMessageSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def get_messages_list(self, request,*args, **kwargs):
        print("GET GROUP CHAT MESSAGES", request.data)
        group_chat_id = request.data.get('group_chat_id')
        messages = GroupChatMessage.objects.filter(group_chat_id=group_chat_id).order_by('number')
        messages_list = []
        
        for message in messages:
            role = 'user' if message.sender_bot_id is None else 'assistant'
            messages_list.append({
                'role': role,
                'content': message.description
            })
        
        return JsonResponse({'messages': messages_list})
    
    @action(detail=False, methods=['post'])
    def test_endpoint(self, request, *args, **kwargs):
        print("TEST GROUP CHAT MESSAGE ENDPOINT REACHED")
        return JsonResponse({'message': 'Group Chat Message endpoint is working!'})


    @action(detail=False, methods=['post'])
    def store_message(self, request, *args, **kwargs):
        print("STORE GROUP CHAT MESSAGE", request.data)
        
        group_chat_id = request.data.get('group_chat_id')
        content = request.data.get('message')
        role = content.get('role')
        id = content.get('id')
        
        messages = GroupChatMessage.objects.filter(group_chat_id=group_chat_id).order_by('number')
        last_message_number = messages.last().number if messages.exists() else 0
        
        if role == 'user':
            sender_user = id
            sender_bot = None
        elif role == 'assistant':
            sender_user = None
            sender_bot = id
        else:
            return JsonResponse({'error': 'Invalid role'}, status=400)
        
        message = GroupChatMessage.objects.create(
            group_chat_id=group_chat_id,
            description=content.get('content'),
            number=last_message_number + 1,
            sender_user_id=sender_user,
            sender_bot_id=sender_bot
        )
        
        return JsonResponse({'response': 'Created'})