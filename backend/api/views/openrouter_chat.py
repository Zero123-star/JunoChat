import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Character
from api.serializers import CharacterSerializer  # Borrow this

class CustomOpenrouterViewset(viewsets.ViewSet):  # Changed to ViewSet instead of ModelViewSet
    permission_classes = [AllowAny]
    serializer_class = CharacterSerializer
    @staticmethod
    def return_character_description(bot_id):
        queryset = Character.objects.all()
        for i in queryset:
            if str(i.id) == str(bot_id):
                return {'description': i.description, 'name': i.name}
        return None  # Better than "error 101"
    
    @staticmethod
    def return_simple_jailbreak(description):
        print("Hello from simple jailbreak")
        messages = [
            {'role': 'system', 'content': 'You are going to engage in a simple rpchat. Play in character based on the <Character sheet> description'},
            {'role': 'system', 'content': description},
            {'role': 'system', 'content': 'Beginning of the rpchat below:'}
        ]
        return messages

    @action(detail=False, methods=['post'])
    def test_endpoint(self, request):
        return JsonResponse({'message': 'Test endpoint is working!'})

    @action(detail=False, methods=['post'])
    def openrouter_chat(self, request):
        """
        Custom endpoint for OpenRouter chat integration
        """
        print("Hello from OpenRouter Chat Endpoint")
        bot_id = request.data.get('id')
        messages = request.data.get('messages', [])
        
        # Get character description
        char_data = self.return_character_description(bot_id)
        if not char_data:
            return JsonResponse({'error': 'Character not found'}, status=404)
        
        # Build the prompt
        description = f"<Character sheet: {char_data['name']}> {char_data['description']}"
        system_messages = self.return_simple_jailbreak(description)
        system_messages.extend(messages)
        
        print(system_messages)
        # Call OpenRouter API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer",  # ADD YOUR KEY
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "deepseek/deepseek-chat-v3-0324:free",
                "messages": system_messages,
                "max_tokens": 500,
                "streaming": False
            })
        )
        
        if response.status_code == 200:
            return JsonResponse(response.json())
        else:
            return JsonResponse({
                "error": f"OpenRouter API returned status code {response.status_code}",
                "details": response.text
            }, status=response.status_code)