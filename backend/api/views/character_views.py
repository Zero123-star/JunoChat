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





class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'tags__name','id']
    ordering_fields = ['name']
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=False, methods=['get'])
    def my_characters(self, request):
        characters = Character.objects.filter(creator=request.user)
        serializer = self.get_serializer(characters, many=True)
        return Response(serializer.data)
               
    @csrf_exempt
    @action(detail=False, methods=['post'])
    def create_character(self,request):
            print(123)
            try:
                # Parse the request body
                data = request.data
                print(123)
                # Extract formData and creator_id from the request
                form_data = data.get('formData')
                creator_id = data.get('creator_id')
                print(form_data)
                # Validate creator_id and check if user exists
                if not creator_id:
                    return JsonResponse({'error': 'Creator ID is required'}, status=400)
                print(creator_id)
                # Extract character fields from formData
                name = form_data.get('name')
                description = form_data.get('description')
                avatar = form_data.get('avatar', None)
                tags = form_data.get('tags', '')
                color = form_data.get('color', None)
                
                # Validate required fields
                if not name or not description:
                    return JsonResponse({'error': 'Name and description are required'}, status=400)
                mimi=CustomUser.objects.get(id=creator_id)
                print(name,description,avatar,creator_id,id)
                # Create new character
                character = Character.objects.create(
                          # Generate a unique ID
                    name=name,
                    source="Created",
                    description=description,
                    avatar=avatar,
                    #tags=tags,
                    #color=color,
                    creator=mimi  # Use the provided creator_id
                )
                print("HEY HEY HEY")
                # Return the created character as JSON
                return JsonResponse({'triumph': "Yes"}, status=201)
            
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
