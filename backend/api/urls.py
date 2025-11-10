from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from django.urls import path, include
from api.views import (
    CustomUserViewSet, 
    FollowViewSet, 
    TagViewSet, 
    CharacterViewSet, 
    ChatViewSet, 
    MessageViewSet,
    CustomOpenrouterViewset,
    GroupChatViewSet, 
    GroupChatMessageViewSet
)
from django.conf import settings
from django.conf.urls.static import static

# Main router
router = DefaultRouter()
router.register(r'chat', CustomOpenrouterViewset, basename='openrouter-chat')
router.register(r'users', CustomUserViewSet)
router.register(r'follows', FollowViewSet)
router.register(r'tags', TagViewSet)
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'group_chats', GroupChatViewSet, basename='group-chat')
router.register(r'messages', MessageViewSet, basename='messages')

# Nested routers
group_chats_router = NestedDefaultRouter(router, r'group_chats', lookup='group_chat')
group_chats_router.register(r'messages', GroupChatMessageViewSet, basename='group-chat-messages')

users_router = NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'characters', CharacterViewSet, basename='user-characters')
users_router.register(r'chats', ChatViewSet, basename='user-chats')

characters_router = NestedDefaultRouter(router, r'characters', lookup='character')
characters_router.register(r'chats', ChatViewSet, basename='character-chats')

chats_router = NestedDefaultRouter(router, r'chats', lookup='chat')
chats_router.register(r'messages', MessageViewSet, basename='chat-messages')

urlpatterns = [
    # Main router URLs (no 'api/' prefix here - it's added in Django_MDS/urls.py)
    path('', include(router.urls)),
    
    # Nested router URLs
    path('', include(users_router.urls)),
    path('', include(characters_router.urls)),
    path('', include(chats_router.urls)),
    path('', include(group_chats_router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)