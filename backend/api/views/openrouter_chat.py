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

# Global storage for API key (in production, use database or environment variables)
OPENROUTER_API_KEY = None


class CustomOpenrouterViewset(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = CharacterSerializer

    @action(detail=False, methods=['get'], url_path='models')
    def get_models(self, request):
        """Get available models from OpenRouter"""
        global OPENROUTER_API_KEY
        
        # Return popular models (could fetch from OpenRouter API if key is set)
        models = [
            "google/gemini-2.0-flash-001",
            "anthropic/claude-3.5-sonnet",
            "openai/gpt-4o-mini",
            "meta-llama/llama-3.1-70b-instruct",
            "mistralai/mistral-7b-instruct",
            "google/gemma-2-9b-it"
        ]
        return JsonResponse({'models': models})

    @action(detail=False, methods=['post'], url_path='test-connection')
    def test_connection(self, request):
        """Test if the API key is valid"""
        api_key = request.data.get('api_key', '')
        
        if not api_key:
            return JsonResponse({'success': False, 'message': 'API key is required'})
        
        try:
            # Test the API key with a simple request
            response = requests.get(
                url="https://openrouter.ai/api/v1/models",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return JsonResponse({'success': True, 'message': 'API key is valid'})
            else:
                return JsonResponse({'success': False, 'message': f'Invalid API key (status: {response.status_code})'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Connection error: {str(e)}'})

    @action(detail=False, methods=['post'], url_path='connect')
    def connect(self, request):
        """Save the API key and selected model"""
        global OPENROUTER_API_KEY
        
        api_key = request.data.get('api_key', '')
        model = request.data.get('model', '')
        
        if not api_key:
            return JsonResponse({'success': False, 'message': 'API key is required'})
        
        # Store the API key globally
        OPENROUTER_API_KEY = api_key
        
        # Store in session as well
        request.session['openrouter_api_key'] = api_key
        request.session['openrouter_model'] = model
        
        return JsonResponse({'success': True, 'message': 'Configuration saved'})

    @staticmethod
    def return_character_description(bot_id):
        queryset = Character.objects.all()
        for i in queryset:
            if str(i.id) == str(bot_id):
                return {'description': i.description, 'name': i.name}
        return None

    @staticmethod
    def return_simple_jailbreak(description):
        print("Hello from simple jailbreak")
        messages = [
            {'role': 'system', 'content': 'You are going to engage in a simple rpchat. Play in character based on the <Character sheet> description'},
            {'role': 'system', 'content': description},
            {'role': 'system', 'content': 'Beginning of the rpchat below:'}
        ]
        return messages

    def return_group_chat_jailbreak(self, other_bots):
        print("Other bots:", other_bots)
        bot_descriptions = []
        try:
            for bot_id in other_bots:
                char_data = self.return_character_description(bot_id)
                if char_data:
                    bot_descriptions.append(f"<Character sheet: {char_data['name']}> {char_data['description']}")
        except Exception as e:
            print("Error occurred while retrieving character descriptions:", e)
            return []
        print("Hello from group chat jailbreak")
        messages = [
            {'role': 'system', 'content': 'You are going to engage in a group rpchat. Play in character based on the <Character sheet> descriptions of all participants.'},
        ]
        for desc in bot_descriptions:
            messages.append({'role': 'system', 'content': desc})
        messages.append({'role': 'system', 'content': 'Beginning of the group rpchat below:'})
        return messages

    @action(detail=False, methods=['post', 'get'])
    def test_endpoint(self, request):
        bot_ids = request.data.get('ids', [])
        print("TEST ENDPOINT REACHED")
        try:
            messages = self.return_group_chat_jailbreak(bot_ids)
        except Exception as e:
            print("Error occurred while retrieving group chat messages:", e)
            messages = []
        return JsonResponse({'message': 'Test endpoint is working!', 'messages': messages})

    def openrouter_group_chat(self, request):
        return self.openrouter_chat(request, is_group_chat=True)

    @action(detail=False, methods=['post'])
    def openrouter_chat(self, request, is_group_chat=False):
        print("Hello from OpenRouter Chat Endpoint")
        bot_id = request.data.get('id')
        messages = request.data.get('messages', [])
        is_group_chat = request.data.get('is_group_chat', False)

        char_data = self.return_character_description(bot_id)
        if not char_data:
            return JsonResponse({'error': 'Character not found'}, status=404)

        description = f"<Character sheet: {char_data['name']}> {char_data['description']}"

        if is_group_chat:
            try:
                bot_ids = request.data.get('other_bot_ids', [])
                system_messages = self.return_group_chat_jailbreak(bot_ids)

                # >>> CHANGED: Add sender info to each group chat message
                formatted_messages = []
                for msg in messages:
                    sender_id = msg.get('sender_bot') or msg.get('sender_user')
                    sender_name = "Unknown"
                    if sender_id:
                        sender_char = self.return_character_description(sender_id)
                        if sender_char:
                            sender_name = sender_char['name']
                    formatted_messages.append({
                        'role': msg.get('role', 'user'),
                        # >>> CHANGED: prepend message content with sender name
                        'content': f"<Message sent by: {sender_name}> {msg.get('content', '')}"
                    })
                # >>> CHANGED: replace raw messages with formatted ones
                system_messages.extend(formatted_messages)

                what_bot_responds = f"The character that will respond in the next message is {char_data['name']}."
                system_messages.append({'role': 'system', 'content': what_bot_responds})

            except Exception as e:
                print("Error occurred while retrieving group chat messages:", e)
        else:
            system_messages = self.return_simple_jailbreak(description)
            system_messages.extend(messages)

        print(system_messages)

        # Get API key from request body, session, or global storage
        global OPENROUTER_API_KEY
        api_key = request.data.get('api_key') or request.session.get('openrouter_api_key') or OPENROUTER_API_KEY
        model = request.data.get('model') or request.session.get('openrouter_model') or 'google/gemini-2.0-flash-001'
        
        if not api_key:
            return JsonResponse({
                "error": "OpenRouter API key is not configured. Please go to API Config page to set it up."
            }, status=400)

        # Call OpenRouter API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": model,
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
