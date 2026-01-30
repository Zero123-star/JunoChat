from django.db import models
from django.contrib.auth.models import AbstractUser
import random, string

class CustomUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='pfp/', blank=True, null=True)
    profile_picture_data = models.BinaryField(blank=True, null=True)
    profile_picture_mime = models.CharField(max_length=100, blank=True, null=True)
    code = models.CharField(max_length=100, unique=True, null=True)
    confirmed_email = models.BooleanField(default=False, null=False)
    blocked = models.BooleanField(default=False, null=False)
    followers = models.ManyToManyField('self', through='Follow', symmetrical=False, related_name='following')

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions_set',
        blank=True
    )    
    class Meta:
        permissions = (
            ('block_user', 'Can block users'),
        )
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = ''.join(random.choices(string.ascii_letters + string.digits, k=100))
        super().save(*args, **kwargs)

    def follow(self, user):
        self.following.add(user)

    def unfollow(self, user):
        self.following.remove(user)

    def is_following(self, user):
        return self.following.filter(id=user.id).exists()

    def get_followers_count(self):
        return self.followers.count()

    def get_following_count(self):
        return self.following.count()

    def __str__(self):
        return self.username 


class Follow(models.Model):
    follower = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="following_relations")
    followed = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="follower_relations")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.follower} follows {self.followed}"
    
    
class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

import uuid
class Character(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)  # Câmp pentru imagine
    avatar_data = models.BinaryField(blank=True, null=True)
    avatar_mime = models.CharField(max_length=100, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)  # Câmp pentru sursa (serial/film)
    description = models.TextField(null=True)
    tags = models.ManyToManyField(Tag, related_name='characters', blank=True)
    creator = models.ForeignKey('CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='card_characters')
    favorited_by = models.ManyToManyField('CustomUser', related_name='favorite_characters', blank=True)

    class Meta:
        ordering = ['name']
    
    def get_favorites_count(self):
        return self.favorited_by.count()
        
    def __str__(self):
        return f"{self.name} ({self.id})"  


class Message(models.Model):
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey('Chat', on_delete=models.CASCADE, related_name='messages')
    sender_user = models.ForeignKey('CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_messages')
    sender_bot = models.ForeignKey('Character', on_delete=models.SET_NULL, null=True, blank=True, related_name='bot_messages')
    number = models.PositiveIntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.number is None:
            self.number = Message.objects.filter(chat=self.chat).count() + 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        number = self.number
        super().delete(*args, **kwargs)
        Message.objects.filter(chat=self.chat, number__gt=number).update(number=models.F('number') - 1)
    
    class Meta:
        ordering = ['chat', 'number']
            
    def __str__(self):
        return f"Message from {self.sender_user or self.sender_bot} in {self.chat}"


class Chat(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='chats')
    chatbot = models.ForeignKey('Character', on_delete=models.CASCADE, related_name='chats')

    def __str__(self):
        return f"Chat between {self.user} and {self.chatbot}."


class GroupChat(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='group_chats')
    chatbots = models.ManyToManyField('Character', related_name='group_chats')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        bot_names = ", ".join([bot.name for bot in self.chatbots.all()])
        return f"Group chat between {self.user} and [{bot_names}]"


class GroupChatMessage(models.Model):
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    group_chat = models.ForeignKey('GroupChat', on_delete=models.CASCADE, related_name='messages')
    sender_user = models.ForeignKey('CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='group_chat_messages')
    sender_bot = models.ForeignKey('Character', on_delete=models.SET_NULL, null=True, blank=True, related_name='group_chat_bot_messages')
    number = models.PositiveIntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.number is None:
            self.number = GroupChatMessage.objects.filter(group_chat=self.group_chat).count() + 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        number = self.number
        super().delete(*args, **kwargs)
        GroupChatMessage.objects.filter(group_chat=self.group_chat, number__gt=number).update(number=models.F('number') - 1)
    
    class Meta:
        ordering = ['group_chat', 'number']
            
    def __str__(self):
        return f"Group message from {self.sender_user or self.sender_bot} in {self.group_chat}"