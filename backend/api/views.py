import requests###pip install requests
import json
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from base.models import CustomUser, Follow, Tag, Character, Message, Chat
from .serializers import CustomUserSerializer, FollowSerializer, TagSerializer, CharacterSerializer, MessageSerializer, ChatSerializer, ChatListSerializer
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
            

def return_character_description(bot_id):
    queryset = Character.objects.all()
    #print("here brah" + str(requested_id))
    for i in queryset:
        if str(i.id)==str(bot_id):
            return {'description': i.description, 'name': i.name} 
    return "error 101"
    print("Done")

def return_simple_jailbreak(description):
    messages=[{'role' : 'system', 'content' : 'You are going to engage in a simple rpchat. Play in character based on the <Character sheet> description'},
              {'role' : 'system', 'content' : description},{'role': 'system', 'content' : 'Beginning of the rpchat below:'}]
    return messages


@csrf_exempt
def openrouter_chat(request):
    if request.method == "POST":
            #print(123)
            request_data = json.loads(request.body)
            #print(request_data.get('id'))
            bot_id=request_data.get('id')
            aux=return_character_description(bot_id)
            description="<Character sheet: " + aux.get('name')+"> "+ aux.get('description')
            aux=return_simple_jailbreak(description)
            aux.extend(request_data.get('messages'))
            print(aux)
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer",#DO NOT COMMIT WITH THE KEY
                    "Content-Type": "application/json"
                },
                data=json.dumps({
                    "model": "deepseek/deepseek-chat-v3-0324:free",
                    "messages": aux,  # Send the entire request data as messages
                    "max_tokens": 500,
                    "streaming": False  # Changed to False for simpler implementation
                })
            )
            if response.status_code == 200:
                return JsonResponse(response.json())
            else:
                return JsonResponse({
                "error": f"OpenRouter API returned status code {response.status_code}",
                        "details": response.text
                }, status=404)