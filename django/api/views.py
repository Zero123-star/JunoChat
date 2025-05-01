from django.core.exceptions import PermissionDenied
from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from base.models import CustomUser, Follow, Tag, Character, Message, Chat
from .serializers import CustomUserSerializer, FollowSerializer, TagSerializer, CharacterSerializer, MessageSerializer, ChatSerializer, ChatListSerializer
import requests

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']
    
    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        request.user.follow(user_to_follow)
        return Response({'status': 'now following'})
    
    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        user_to_unfollow = self.get_object()
        request.user.unfollow(user_to_unfollow)
        return Response({'status': 'unfollowed'})
    
    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        user = self.get_object()
        followers = user.followers.all()
        serializer = CustomUserSerializer(followers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        user = self.get_object()
        following = user.following.all()
        serializer = CustomUserSerializer(following, many=True)
        return Response(serializer.data)


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'tags__name']
    ordering_fields = ['name']
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_characters(self, request):
        characters = Character.objects.filter(creator=request.user)
        serializer = self.get_serializer(characters, many=True)
        return Response(serializer.data)


class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatListSerializer
        return ChatSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
# func to call my flask API
# i ll insert the proper url to call
def call_flask_bot_api(chat, user_prompt):
    messages = chat.messages.order_by('number')
    history = [
        {"sender": "user" if m.sender_user else "bot", "text": m.description}
        for m in messages
    ]

    payload = {
        "chat_id": str(chat.id),
        "bot_description": chat.chatbot.description,
        "history": history,
        "user_prompt": user_prompt,
    }

    try:
        response = requests.post("http://localhost:5000/generate", json=payload)
        response.raise_for_status()
        return response.json().get("bot_reply")
    except Exception as e:
        print(f"Flask bot API error: {e}")
        return "Sorry, I couldn’t respond right now."

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(chat__user=self.request.user)
    
   # def perform_create(self, serializer):
   #     chat = serializer.validated_data.get('chat')
   #     if chat.user == self.request.user:
   #         serializer.save(sender_user=self.request.user)

    def perform_create(self, serializer):
        chat = serializer.validated_data.get('chat')

        if chat.user != self.request.user:
            raise PermissionDenied("This chat does not belong to you.")

        # Save user message
        user_message = serializer.save(sender_user=self.request.user)

        # Get bot reply via Flask
        bot_reply = call_flask_bot_api(chat, user_message.description)

        # Save bot message
        Message.objects.create(
            chat=chat,
            sender_bot=chat.chatbot,
            description=bot_reply
        )
