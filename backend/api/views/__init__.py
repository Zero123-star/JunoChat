# Import from individual files
from .user_views import CustomUserViewSet, FollowViewSet
from .character_views import CharacterViewSet
from .chat_views import ChatViewSet, MessageViewSet
from .tag_views import TagViewSet
from .openrouter_chat import CustomOpenrouterViewset
from .group_chat_views import GroupChatViewSet, GroupChatMessageViewSet 
from .rpg_combat_view import RPGCombatViewSet
# Optional: make it explicit what's publicly available
__all__ = [
    'CustomUserViewSet',
    'FollowViewSet',
    'CharacterViewSet',
    'ChatViewSet',
    'MessageViewSet',
    'TagViewSet',
    'CustomOpenrouterViewset',
    'GroupChatViewSet',
    'GroupChatMessageViewSet',
    'RPGCombatViewSet',
]