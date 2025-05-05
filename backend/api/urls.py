from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from django.urls import path, include
from api.views import CustomUserViewSet, FollowViewSet, TagViewSet, CharacterViewSet, ChatViewSet, MessageViewSet
from django.conf import settings
from django.conf.urls.static import static
from . import views
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'follows', FollowViewSet)
router.register(r'tags', TagViewSet)
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'chats', ChatViewSet, basename='chat')

users_router = NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'characters', CharacterViewSet, basename='user-characters')
users_router.register(r'chats', ChatViewSet, basename='user-chats')

characters_router = NestedDefaultRouter(router, r'characters', lookup='character')
characters_router.register(r'chats', ChatViewSet, basename='character-chats')

chats_router = NestedDefaultRouter(router, r'chats', lookup='chat')
chats_router.register(r'messages', MessageViewSet, basename='chat-messages')

urlpatterns = [
    path('', include(router.urls)),
    path('users/', include(users_router.urls)),
    path('characters/', include(characters_router.urls)),
    path('chats/', include(chats_router.urls)),
    path('characters/<int:character_id>/', include(characters_router.urls)),
    path('api/chat/', views.openrouter_chat, name='openrouter_chat'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
