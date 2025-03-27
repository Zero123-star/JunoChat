from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from django.urls import path, include
from .views import CustomUserViewSet, FollowViewSet, TagViewSet, CharacterViewSet, ChatViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'follows', FollowViewSet)
router.register(r'tags', TagViewSet)
router.register(r'characters', CharacterViewSet)
router.register(r'chats', ChatViewSet, basename='chat')

users_router = NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'characters', CharacterViewSet, basename='user-characters')
users_router.register(r'chats', ChatViewSet, basename='user-chats')

characters_router = NestedDefaultRouter(router, r'characters', lookup='character')
characters_router.register(r'chats', ChatViewSet, basename='character-chats')

chats_router = NestedDefaultRouter(router, r'chats', lookup='chat')
chats_router.register(r'messages', MessageViewSet, basename='chat-messages')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/users/', include(users_router.urls)),
    path('api/characters/', include(characters_router.urls)),
    path('api/chats/', include(chats_router.urls)),
]
