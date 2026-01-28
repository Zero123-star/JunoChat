import requests###pip install requests
import json
import uuid
import base64
from io import BytesIO
from django.core.files.base import ContentFile
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



    @action(detail=False, methods=['get'])
    def list_characters(self, request):
        characters = Character.objects.all()
        serializer = self.get_serializer(characters, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def retrieve_character(self, request):
        print("Hello from retrieve_character")
        data = request.data
        print(data.get('name')) 
        try:
            name1=data.get('name')
            char=Character.objects.get(name=name1)
            serializer=CharacterSerializer(char)
            return Response(serializer.data)
        except Exception as e:
            print("Error in retrieve_character:", str(e))
            return Response({'error': 'Something went wrong(retrieve_character)'}, status=404)

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
                avatar_data = form_data.get('avatar', None)
                tags = form_data.get('tags', '')
                color = form_data.get('color', None)
                
                # Validate required fields
                if not name or not description:
                    return JsonResponse({'error': 'Name and description are required'}, status=400)
                given_creator_id=CustomUser.objects.get(id=creator_id)
                
                # Create new character
                character = Character.objects.create(
                    name=name,
                    source="Created",
                    description=description,
                    creator=given_creator_id
                )
                
                # Handle avatar if provided (base64 string)
                if avatar_data and avatar_data.startswith('data:image'):
                    try:
                        # Extract base64 data
                        format, imgstr = avatar_data.split(';base64,')
                        ext = format.split('/')[-1]  # Get file extension
                        
                        # Decode base64 and create ContentFile
                        data = ContentFile(base64.b64decode(imgstr), name=f'{character.id}.{ext}')
                        character.avatar.save(f'{character.id}.{ext}', data, save=True)
                    except Exception as e:
                        print(f"Error saving avatar: {str(e)}")
                        # Continue without avatar if there's an error
                
                print("Character created successfully")
                # Return the created character as JSON
                return JsonResponse({
                    'success': True,
                    'character_id': character.id,
                    'message': 'Character created successfully'
                }, status=201)
            
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

    def update(self, request, *args, **kwargs):
        """Override update to handle base64 avatar images"""
        try:
            instance = self.get_object()
            data = request.data.copy()
            
            # Handle avatar if it's a base64 string
            avatar_data = data.get('avatar')
            if avatar_data and isinstance(avatar_data, str):
                if avatar_data.startswith('data:image'):
                    # New base64 image uploaded
                    try:
                        # Extract base64 data
                        format, imgstr = avatar_data.split(';base64,')
                        ext = format.split('/')[-1]  # Get file extension
                        
                        # Decode base64 and create ContentFile
                        file_data = ContentFile(base64.b64decode(imgstr), name=f'{instance.id}_updated.{ext}')
                        instance.avatar.save(f'{instance.id}_updated.{ext}', file_data, save=False)
                        
                        # Remove avatar from data so serializer doesn't try to process it
                        data.pop('avatar', None)
                    except Exception as e:
                        print(f"Error saving avatar during update: {str(e)}")
                        data.pop('avatar', None)
                elif avatar_data.startswith('http'):
                    # Existing URL - don't try to update it, just remove from data
                    data.pop('avatar', None)
            
            # Use serializer for other fields
            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response(serializer.data)
        except Exception as e:
            print(f"Error updating character: {str(e)}")
            return Response({'error': str(e)}, status=500)
