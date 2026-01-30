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
                # Handle both JSON (nested formData) and multipart/form-data
                data = request.data
                print(123)
                
                # Check if data is nested (formData object) or flat (multipart)
                form_data = data.get('formData') if 'formData' in data else data
                creator_id = data.get('creator_id')
                print(form_data)
                
                # Validate creator_id and check if user exists
                if not creator_id:
                    return JsonResponse({'error': 'Creator ID is required'}, status=400)
                print(creator_id)
                
                # Extract character fields
                name = form_data.get('name')
                description = form_data.get('description')
                avatar_file = form_data.get('avatar', None)
                tags = form_data.get('tags', '')
                source = form_data.get('source', 'Created')
                color = form_data.get('color', None)
                
                # Validate required fields
                if not name or not description:
                    return JsonResponse({'error': 'Name and description are required'}, status=400)
                given_creator_id=CustomUser.objects.get(id=creator_id)
                
                # Create new character
                character = Character.objects.create(
                    name=name,
                    source=source,
                    description=description,
                    creator=given_creator_id
                )
                
                # Handle avatar - could be File upload or base64 string
                if avatar_file:
                    if isinstance(avatar_file, str):
                        # Handle base64 string
                        if avatar_file.startswith('data:image'):
                            try:
                                format, imgstr = avatar_file.split(';base64,')
                                mime_type = format.split(':')[1] if ':' in format else 'image/png'
                                ext = format.split('/')[-1]
                                decoded_bytes = base64.b64decode(imgstr)
                                data_bytes = ContentFile(decoded_bytes, name=f'{character.id}.{ext}')
                                character.avatar_data = decoded_bytes
                                character.avatar_mime = mime_type
                                character.avatar.save(f'{character.id}.{ext}', data_bytes, save=True)
                            except Exception as e:
                                print(f"Error saving base64 avatar: {str(e)}")
                    else:
                        # Handle file upload (multipart/form-data)
                        try:
                            file_mime = getattr(avatar_file, 'content_type', None)
                            file_content = avatar_file.read()
                            character.avatar_data = file_content
                            character.avatar_mime = file_mime or 'application/octet-stream'
                            character.avatar.save(avatar_file.name, ContentFile(file_content), save=True)
                        except Exception as e:
                            print(f"Error saving uploaded avatar: {str(e)}")
                
                print("Character created successfully")
                # Return the created character as JSON
                return JsonResponse({
                    'success': True,
                    'character_id': character.id,
                    'message': 'Character created successfully'
                }, status=201)
            
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
                        mime_type = format.split(':')[1] if ':' in format else 'image/png'
                        
                        # Decode base64 and create ContentFile
                        decoded_bytes = base64.b64decode(imgstr)
                        file_data = ContentFile(decoded_bytes, name=f'{instance.id}_updated.{ext}')
                        instance.avatar_data = decoded_bytes
                        instance.avatar_mime = mime_type
                        instance.avatar.save(f'{instance.id}_updated.{ext}', file_data, save=False)
                        
                        # Remove avatar from data so serializer doesn't try to process it
                        data.pop('avatar', None)
                    except Exception as e:
                        print(f"Error saving avatar during update: {str(e)}")
                        data.pop('avatar', None)
                elif avatar_data.startswith('http'):
                    # Existing URL - don't try to update it, just remove from data
                    data.pop('avatar', None)
            elif 'avatar' in request.FILES:
                file_obj = request.FILES['avatar']
                try:
                    file_content = file_obj.read()
                    mime_type = getattr(file_obj, 'content_type', None)
                    instance.avatar_data = file_content
                    instance.avatar_mime = mime_type or 'application/octet-stream'
                    instance.avatar.save(file_obj.name, ContentFile(file_content), save=False)
                except Exception as e:
                    print(f"Error saving uploaded avatar: {str(e)}")
                finally:
                    data.pop('avatar', None)
            
            # Use serializer for other fields
            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response(serializer.data)
        except Exception as e:
            print(f"Error updating character: {str(e)}")
            return Response({'error': str(e)}, status=500)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        """Add character to user's favorites"""
        character = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        if character.favorited_by.filter(id=user.id).exists():
            return Response({'message': 'Already in favorites'}, status=200)
        
        character.favorited_by.add(user)
        return Response({
            'message': 'Added to favorites',
            'favorites_count': character.get_favorites_count()
        })

    @action(detail=True, methods=['post'])
    def unfavorite(self, request, pk=None):
        """Remove character from user's favorites"""
        character = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        if not character.favorited_by.filter(id=user.id).exists():
            return Response({'message': 'Not in favorites'}, status=200)
        
        character.favorited_by.remove(user)
        return Response({
            'message': 'Removed from favorites',
            'favorites_count': character.get_favorites_count()
        })
