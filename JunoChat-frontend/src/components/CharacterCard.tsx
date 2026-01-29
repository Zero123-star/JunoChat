import React, { useState } from 'react';
import { Character } from '@/types/character';
import { Button } from '@/components/Button';
import { MessageCircle, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { get_first_chat, favoriteCharacter, unfavoriteCharacter } from '@/api';

interface CharacterCardProps {
  character: Character;
  onSelect?: (character: Character) => void;
  onFavoriteChange?: () => void; // Callback to refresh data after favorite change
}



export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onFavoriteChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(character.is_favorited || false);
  const [favoritesCount, setFavoritesCount] = useState(character.favorites_count || 0);
  const navigate = useNavigate();


  const handleCardClick = () => {
    navigate(`/character/${character.id}`);
  };

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to favorite characters');
      return;
    }
    
    try {
      if (isFavorited) {
        const response = await unfavoriteCharacter(character.id);
        setIsFavorited(false);
        setFavoritesCount(response.favorites_count);
      } else {
        const response = await favoriteCharacter(character.id);
        setIsFavorited(true);
        setFavoritesCount(response.favorites_count);
      }
      onFavoriteChange?.();
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        // Don't redirect here, let the interceptor handle it
      } else {
        alert('Failed to update favorite. Please try again.');
      }
    }
  };


  const handleNavigateToChat = (event: React.MouseEvent) => {
    const navigate_to_firstChat = async (data2: { user_id: any; character_id: any }) => {

      const first_id = await get_first_chat(data2);
      console.log("First chat ID:", first_id.chat_id);
      navigate(`/chat/${character.id}`, {
      state: { chatId: first_id.chat_id }
    });
    }



    event.stopPropagation();
    const userId = localStorage.getItem('user');
    if (!userId) {
      console.error("User ID not found in local storage");
      navigate(`/chat/${character.id}`);
      return;
    }

    console.log("User ID:", userId);
    const data = {
      user_id: userId,
      character_id: character.id
    };
    navigate_to_firstChat(data)
  };
  return (
    <motion.div
      className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />

      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-20 bg-white/20 backdrop-blur-md p-1.5 rounded-full hover:bg-white/30 transition cursor-pointer"
        style={{
          backgroundColor: isFavorited ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <Star 
          className={`h-4 w-4 ${isFavorited ? 'text-yellow-400' : 'text-white'}`} 
          fill={isFavorited ? 'currentColor' : 'none'} 
        />
      </button>
      {favoritesCount > 0 && (
        <div className="absolute top-3 right-14 z-20 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-white text-xs">
          {favoritesCount}
        </div>
      )}

      <div className="h-72 overflow-hidden">
        <img
          src={character.avatar}
          alt={character.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 blur-[1px]' : 'scale-100'}`}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white mb-1 flex items-center">
          {character.name}
          {isHovered && (
            <Sparkles className="ml-2 h-4 w-4 text-yellow-300" data-testid="sparkles-icon" />
          )}
        </h3>

        <p className={`text-white/80 text-sm mb-4 line-clamp-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
          {character.description}
        </p>

        <Button
          onClick={handleNavigateToChat}
          gradient
          className="w-full flex items-center justify-center"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Start Chatting
        </Button>
      </div>

    </motion.div>
  );
};

export default CharacterCard;