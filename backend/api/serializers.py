from rest_framework import serializers
from .models import CustomUser, Follow, Tag, Character, Message, Chat, GroupChatMessage, GroupChat


class CustomUserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile_picture', 'confirmed_email', 'blocked', 'followers_count', 'following_count', 'code']
        read_only_fields = ['followers_count', 'following_count', 'code']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_followers_count(self, obj):
        return obj.get_followers_count()
        
    def get_following_count(self, obj):
        return obj.get_following_count()
    
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture:
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            else:
                return obj.profile_picture.url
        return None

class FollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.ReadOnlyField(source='follower.username')
    followed_username = serializers.ReadOnlyField(source='followed.username')
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'follower_username', 'followed_username', 'created_at']
        read_only_fields = ['created_at']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
        read_only_fields = ['id']
        
class CharacterSerializer(serializers.ModelSerializer):
    creator_username = serializers.ReadOnlyField(source='creator.username')
    tags = TagSerializer(many=True, read_only=True)
    favorites_count = serializers.ReadOnlyField(source='get_favorites_count')
    is_favorited = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Character
        fields = ['id', 'name', 'avatar', 'source', 'description', 'tags', 'creator', 'creator_username', 'favorites_count', 'is_favorited']
        read_only_fields = ['id']
    
    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            else:
                return obj.avatar.url
        return None
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(id=request.user.id).exists()
        return False
    
    def create(self, validated_data):
        tags_data = self.context.get('request').data.get('tags', [])
        character = Character.objects.create(**validated_data)
        
        for tag_id in tags_data:
            try:
                tag = Tag.objects.get(id=tag_id)
                character.tags.add(tag)
            except Tag.DoesNotExist:
                pass
        
        return character

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'description', 'timestamp', 'chat', 'sender_user', 'sender_bot', 'number', 'sender_username']
        read_only_fields = ['timestamp', 'number', 'sender_username']
    
    def get_sender_username(self, obj):
        if obj.sender_user:
            return obj.sender_user.username
        elif obj.sender_bot:
            return obj.sender_bot.name
        return None

class ChatSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    chatbot_name = serializers.ReadOnlyField(source='chatbot.name')
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Chat
        fields = ['id', 'user', 'chatbot', 'user_username', 'chatbot_name', 'messages']

class ChatListSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    chatbot_name = serializers.ReadOnlyField(source='chatbot.name')
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Chat
        fields = ['id', 'user', 'chatbot', 'user_username', 'chatbot_name', 'last_message']
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-number').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None


class GroupChatMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    
    class Meta:
        model = GroupChatMessage
        fields = ['id', 'description', 'timestamp', 'group_chat', 'sender_user', 'sender_bot', 'number', 'sender_username']
        read_only_fields = ['timestamp', 'number', 'sender_username']
    
    def get_sender_username(self, obj):
        if obj.sender_user:
            return obj.sender_user.username
        elif obj.sender_bot:
            return obj.sender_bot.name
        return None

class GroupChatSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    chatbot_names = serializers.SerializerMethodField()
    messages = GroupChatMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = GroupChat
        fields = ['id', 'user', 'chatbots', 'user_username', 'chatbot_names', 'messages', 'created_at']
    
    def get_chatbot_names(self, obj):
        return [bot.name for bot in obj.chatbots.all()]
