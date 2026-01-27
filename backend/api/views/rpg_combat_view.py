from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
import random

try:
    from backend_game.rpg_game_manager import GAME
    GAME_AVAILABLE = True
except ImportError as e:
    GAME_AVAILABLE = False
    print(f"Warning: RPG game modules not found - {e}")

class RPGCombatViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def initialize(self, request):
        """Initialize a new combat game"""
        if not GAME_AVAILABLE:
            return JsonResponse({"error": "Game modules not available"}, status=500)
        
        try:
            game_state = GAME.initialize_game()
            return JsonResponse(game_state)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def state(self, request):
        """Get current game state"""
        if not GAME_AVAILABLE:
            return JsonResponse({"error": "Game modules not available"}, status=500)
        
        try:
            game_state = GAME.get_game_state()
            return JsonResponse(game_state)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'])
    def set_api_key(self, request):
        """Set OpenRouter API key"""
        if not GAME_AVAILABLE:
            return JsonResponse({"error": "Game modules not available"}, status=500)
        
        try:
            api_key = request.data.get('api_key', '')
            GAME.OPENROUTER_API_KEY = api_key
            return JsonResponse({"success": True, "message": "API key set successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'])
    def player_action(self, request):
        """Execute player action"""
        if not GAME_AVAILABLE:
            return JsonResponse({"error": "Game modules not available"}, status=500)
        
        try:
            action_type = request.data.get('action_type')
            ability_name = request.data.get('ability_name')
            message = request.data.get('message')
            
            result = GAME.player_action(action_type, ability_name, message)
            game_state = GAME.get_game_state()
            
            return JsonResponse({
                "result": result,
                "game_state": game_state
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'])
    def ai_action(self, request):
        """Execute AI action with LLM decision making"""
        if not GAME_AVAILABLE:
            return JsonResponse({"error": "Game modules not available"}, status=500)
        
        try:
            # Use LLM-based decision making
            result = GAME.ai_action_with_llm()
            game_state = GAME.get_game_state()
            
            return JsonResponse({
                "result": result,
                "game_state": game_state
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'])
    def end_turn(self, request):
        """End current turn"""
        if not GAME_AVAILABLE:
            return JsonResponse({"error": "Game modules not available"}, status=500)
        
        try:
            GAME.end_turn()
            game_state = GAME.get_game_state()
            return JsonResponse(game_state)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)