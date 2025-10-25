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

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']
    

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        request.user.follow(user_to_follow)
        return Response({'status': 'now following'})
    

    @action(detail=False,methods=['post'])
    def check_credentials(self,request):
        ###Checks the credentials given, returns the id of the user if found. request={username: string, password: string}
        user=request.data.get('username') ###not working crashes
        password=request.data.get('password')
        for i in CustomUser.objects.all():
            if i.username==user:
                if i.password==password:
                    return Response({'status' : i.pk, 'worked' : True})
                return Response({'status' : 'Bad password!','worked' : False})
        return Response({'status': 'Username not found!', 'worked' : False}) ###returns "<rest_framework.request.Request: POST '/api/users/check_credentials/'>"
        #user=self.get_object(name=request.data.get(username))


    #Registers a users. The post request has the following format: { username: string, email: string, password: string;}
    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        print("REGISTER", username, email, password)
        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required'}, status=400)
        
        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        
        #Example of a plsql insert statement into user(Yes, TOO MANY FIELDS)
        #insert into django.base_customuser
        # (username,password,is_superuser,first_name,last_name,email,is_staff,is_active,date_joined,confirmed_email,blocked) 
        # Values ('ASD','123',true,'first','last','email',true,true,'2006-10-25',false,false);
        #
        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=password,  # Note: Password should be hashed in production
            is_superuser=False,
            first_name='',
            last_name='',
            is_staff=False,
            is_active=True,
            date_joined='2006-10-25',  # Automatically set by Django
            confirmed_email=False,  # Assuming you have a field for email confirmation
            blocked=False  # Assuming you have a field for blocking users
        )
        print("User created:", user)
        user.save()


        return Response({'status': 'User created successfully', 'user_id': user.id})

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
    
    ###Returns the users that a user is following
    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        user = self.get_object()
        following = user.following.all()
        serializer = CustomUserSerializer(following, many=True)
        return Response(serializer.data)
    

    ###Returns the user name of a given id, request is a json object with a single key 'id'
    @action(detail=False, methods=['post'])
    def get_username(self, request):    
        print("GET USERNAME")
        user_id = request.data.get('id')
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
        try:
            user = CustomUser.objects.get(id=user_id)
            return JsonResponse({'username': user.username})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [AllowAny]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
