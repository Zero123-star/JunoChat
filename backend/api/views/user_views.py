import requests###pip install requests
import json
import uuid
import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.files.base import ContentFile
from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
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
    
    def update(self, request, *args, **kwargs):
        """Override update to handle profile picture uploads (base64 or multipart)"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        print(f"Updating user {instance.id} - {instance.username}")
        print(f"Request data: {request.data}")
        print(f"Request files: {request.FILES}")
        
        # Handle profile picture if provided
        profile_picture_data = request.data.get('profile_picture') or request.FILES.get('profile_picture')
        binary_payload = None
        mime_type = None
        if profile_picture_data:
            try:
                if isinstance(profile_picture_data, str) and profile_picture_data.startswith('data:image'):
                    # Handle base64 string
                    format_info, imgstr = profile_picture_data.split(';base64,')
                    mime_type = format_info.split(':')[1] if ':' in format_info else 'image/png'
                    ext = format_info.split('/')[-1]
                    binary_payload = base64.b64decode(imgstr)
                    data_bytes = ContentFile(binary_payload, name=f'profile_{instance.id}.{ext}')
                    instance.profile_picture.save(f'profile_{instance.id}.{ext}', data_bytes, save=True)
                    print(f"Profile picture saved as base64")
                else:
                    # Handle multipart file upload
                    mime_type = getattr(profile_picture_data, 'content_type', None)
                    binary_payload = profile_picture_data.read()
                    file_name = getattr(profile_picture_data, 'name', f'profile_{instance.id}')
                    instance.profile_picture.save(file_name, ContentFile(binary_payload), save=True)
                    print(f"Profile picture saved as file upload")
            except Exception as e:
                print(f"Error saving profile picture: {str(e)}")
            finally:
                if binary_payload:
                    instance.profile_picture_data = binary_payload
                    instance.profile_picture_mime = mime_type or 'application/octet-stream'
                    instance.save(update_fields=['profile_picture_data', 'profile_picture_mime'])
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        print(f"User updated successfully. Profile picture: {instance.profile_picture}")
        
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Handle PATCH requests"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        follower_id = request.headers.get('X-User-ID') or request.data.get('follower_id')
        
        if not follower_id:
            return Response({'error': 'Follower ID is required'}, status=400)
        
        try:
            follower = CustomUser.objects.get(id=follower_id)
            if follower.id == user_to_follow.id:
                return Response({'error': 'You cannot follow yourself'}, status=400)
            
            follower.follow(user_to_follow)
            return Response({
                'status': 'now following',
                'followers_count': user_to_follow.get_followers_count(),
                'following_count': follower.get_following_count()
            })
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    

    @action(detail=False,methods=['post'])
    def check_credentials(self,request):
        ###Checks the credentials given, returns the id of the user if found. request={username: string, password: string}
        from django.contrib.auth.hashers import check_password
        
        user=request.data.get('username')
        password=request.data.get('password')
        
        print(f"Login attempt - Username: {user}")
        print(f"All users in DB: {[u.username for u in CustomUser.objects.all()]}")
        
        for i in CustomUser.objects.all():
            print(f"Checking user: {i.username}")
            if i.username==user:
                print(f"Username match found! Checking password...")
                print(f"Stored password hash: {i.password}")
                print(f"Provided password: {password}")
                
                # Try both plain text and hashed password comparison
                # Plain text for old accounts, hashed for superusers
                plain_match = i.password==password
                hashed_match = check_password(password, i.password)
                
                print(f"Plain text match: {plain_match}")
                print(f"Hashed match: {hashed_match}")
                
                if plain_match or hashed_match:
                    # Create or get authentication token
                    token, created = Token.objects.get_or_create(user=i)
                    print(f"Login successful for {user}. Token: {token.key}")
                    return Response({
                        'status': i.pk, 
                        'worked': True,
                        'state': token.key  # Return the actual token
                    })
                print("Password mismatch!")
                return Response({'status' : 'Bad password!','worked' : False})
        print(f"User {user} not found in database")
        return Response({'status': 'Username not found!', 'worked' : False})


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
        
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)
        
        try:
            # Create user with proper datetime
            user = CustomUser.objects.create(
                username=username,
                email=email,
                password=password,  # Note: Password should be hashed in production
                is_superuser=False,
                first_name='',
                last_name='',
                is_staff=False,
                is_active=True,
                date_joined=timezone.now(),  # Use proper datetime
                confirmed_email=False,
                blocked=False
            )
            print("User created successfully:", user.id, user.username)
            return Response({'status': 'User created successfully', 'user_id': user.id})
        except Exception as e:
            print("Error creating user:", str(e))
            return Response({'error': f'Failed to create user: {str(e)}'}, status=500)

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        user_to_unfollow = self.get_object()
        follower_id = request.headers.get('X-User-ID') or request.data.get('follower_id')
        
        if not follower_id:
            return Response({'error': 'Follower ID is required'}, status=400)
        
        try:
            follower = CustomUser.objects.get(id=follower_id)
            follower.unfollow(user_to_unfollow)
            return Response({
                'status': 'unfollowed',
                'followers_count': user_to_unfollow.get_followers_count(),
                'following_count': follower.get_following_count()
            })
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    
    

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
    
    @action(detail=True, methods=['get'])
    def favorite_characters(self, request, pk=None):
        """Get all characters favorited by a specific user"""
        try:
            user = self.get_object()
            favorite_chars = user.favorite_characters.all()
            from api.serializers import CharacterSerializer
            serializer = CharacterSerializer(favorite_chars, many=True, context={'request': request})
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    
    @action(detail=False, methods=['get'])
    def top_users(self, request):
        """Get top 10 users with the most followers"""
        from django.db.models import Count
        
        top_users = CustomUser.objects.annotate(
            followers_count=Count('followers')
        ).order_by('-followers_count')[:10]
        
        serializer = CustomUserSerializer(top_users, many=True)
        return Response(serializer.data)


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
