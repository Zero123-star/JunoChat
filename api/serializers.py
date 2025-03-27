from rest_framework import serializers
from base.models import CustomUser, Follow, Tag, Character, Message, Chat


class CustomUserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_picture', 'confirmed_email', 'blocked', 'followers_count', 'following_count', 'code']
        read_only_fields = ['followers_count', 'following_count', 'code']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_followers_count(self, obj):
        return obj.get_followers_count()
        
    def get_following_count(self, obj):
        return obj.get_following_count()

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
    
    class Meta:
        model = Character
        fields = ['id', 'name', 'description', 'tags', 'creator', 'creator_username']
        read_only_fields = ['id']
    
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
