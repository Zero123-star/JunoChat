import requests###pip install requests
import json
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
    
    


class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [AllowAny]
    

    #@action(detail=False, methods=['get'])
    #def get_chatid(self,request):
        ####Getter, request: userid, botid. To remove/modify, since there can exist multiple chats between same user and bot
        #uv=self.Chat.objects.all 
        
    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatListSerializer
        return ChatSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]
    

    @action(detail=False, methods=['post'])
    def get_messages(self, request):
        #Returns an array of openrouter format 
        chatid=request.data.get('chat_id')
        mn=Message.objects.filter(chat_id=chatid)

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
                    "Authorization": f"Bearer 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",
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
                }, status=response.status_code)
    