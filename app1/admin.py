from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active', 'blocked')
    list_filter = ('is_staff', 'is_active', 'blocked')
    search_fields = ('username', 'email')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'blocked')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active', 'blocked')}
        ),
    )
admin.site.register(CustomUser, CustomUserAdmin)


from .models import Tag
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
admin.site.register(Tag, TagAdmin)
    
    
from .models import Character
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('name', 'creator', 'id')
    search_fields = ('name', 'description')
    list_filter = ('tags',)
    filter_horizontal = ('tags',)
admin.site.register(Character, CharacterAdmin)


from .models import Message
class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat', 'sender_user', 'sender_bot', 'message_number', 'description', 'timestamp')
    list_filter = ('chat', 'sender_user', 'sender_bot')
    search_fields = ('chat__user__username', 'chat__chatbot__name', 'sender_user__username', 'sender_bot__name', 'description')
admin.site.register(Message, MessageAdmin)


from .models import Chat
class ChatAdmin(admin.ModelAdmin):
    list_display = ('user', 'chatbot')
    list_filter = ('user', 'chatbot')
    search_fields = ('user__username', 'chatbot__name')
    raw_id_fields = ('user', 'chatbot')
admin.site.register(Chat, ChatAdmin)