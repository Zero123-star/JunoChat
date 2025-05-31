import React, { useState } from 'react';
import { Character } from '@/types/character';
import { Button } from '@/components/ui/uiButton';
import { MessageCircle, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


interface CharacterCardProps {
  character: Character;
  onSelect?: (character: Character) => void; // Funcție pentru a selecta un personaj
  textClassName?: string; // Optional class for text color
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, textClassName }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // Hook pentru navigare

  const handleCardClick = () => {
    navigate(`/character/${character.id}`); // Navighează la pagina de detalii
  };

  const handleNavigateToChat = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    navigate(`/chat/${character.id}`); // Navighează către pagina de chat cu ID-ul personajului
  };

  console.log(character.avatar);
  
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
      
      <div 
        className="absolute top-3 right-3 z-20 bg-white/20 backdrop-blur-md p-1.5 rounded-full"
        style={{ 
          backgroundColor: `${character.color || 'rgba(99, 102, 241, 0.2)'}` 
        }}
      >
        <Star className="h-4 w-4 text-white" fill="white" />
      </div>
      
      <div className="h-72 overflow-hidden">
        <img 
          src={character.avatar} 
          alt={character.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 blur-[1px]' : 'scale-100'}`}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className={`text-xl font-bold mb-1 flex items-center ${textClassName || 'text-white'}`}>
          {character.name}
          {isHovered && (
            <Sparkles className="ml-2 h-4 w-4 text-yellow-300" />
          )}
        </h3>
        
        <p className={`text-sm mb-4 line-clamp-2 transition-all duration-300 ${textClassName || 'text-white/80'} ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
          {character.description}
        </p>
        
        <Button 
    
          onClick={handleNavigateToChat}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Start Chatting
        </Button>
      </div>
      
    </motion.div>
  );
};

export default CharacterCard;