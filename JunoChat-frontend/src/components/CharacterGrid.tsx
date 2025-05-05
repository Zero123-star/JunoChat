import React from 'react';
import { Character } from '@/types/character';
import CharacterCard from '../components/CharacterCard';
import { motion } from 'framer-motion';

interface CharacterGridProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ 
  characters, 
  onSelectCharacter 
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {characters.map((character, index) => (
        <motion.div 
          key={character.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1 
          }}
        >
          <CharacterCard 
            character={character} 
            onSelect={onSelectCharacter} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CharacterGrid;
