/* import React, { useEffect, useState } from 'react';
import { fetchCharacters } from '../api';

interface Character {
  id: number;
  name: string;
  description: string;
}

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const response = await fetchCharacters();
        setCharacters(response.data); // Setează personajele în state
      } catch (error) {
        console.error('Eroare la obținerea personajelor:', error);
      }
    };

    getCharacters();
  }, []);

  return (
    <div>
      <h1>Lista personajelor</h1>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <strong>{character.name}</strong>: {character.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;*/