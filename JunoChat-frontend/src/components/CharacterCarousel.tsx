import React, { useState } from 'react';
import { Character } from '@/types/character';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CharacterCard from './CharacterCard';
import { Button } from '@/components/Button';

interface CharacterCarouselProps {
  characters: Character[];
  onSelect?: (character: Character) => void;
}

const CharacterCarousel: React.FC<CharacterCarouselProps> = ({ characters, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1));
  };

  if (!characters.length) return null;

  // Calculăm indexurile pentru cele 3 personaje afișate
  const getCharacterIndex = (offset: number) => (activeIndex + offset + characters.length) % characters.length;
  const characterIndexes = [0, 1, 2].map((offset) => getCharacterIndex(offset));

  return (
    <div className="relative overflow-hidden  ">
      {/* Personaje afișate */}
      <div className="flex justify-center items-center gap-4">
        {characterIndexes.map((index) => (
          <div key={index} className="relative">
            <CharacterCard 
              character={characters[index]} 
              onSelect={onSelect} 
            />
          </div>
        ))}
      </div>

      {/* Săgeata pentru navigare spre stânga */}
      <Button
        size="icon"
        gradient
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      {/* Săgeata pentru navigare spre dreapta */}
      <Button
        size="icon"
        gradient
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default CharacterCarousel;
