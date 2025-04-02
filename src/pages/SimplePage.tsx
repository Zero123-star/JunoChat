import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Character } from '@/types/character';
import { fetchCharacters } from '../api';
import { Search } from 'lucide-react';
import { CharacterCard } from '@/components/CharacterCard';

const SimplePage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data);
        console.log('Personaje:', data);
      } catch (error) {
        console.error('Eroare la obținerea personajelor:', error);
        toast.error('Nu am putut încărca personajele. Încearcă din nou!');
      } finally {
        setLoading(false);
      }
    };

    getCharacters();
  }, []);

  if (loading) {
    return <p>Loading characters...</p>;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setCharacters(characters);
    } else {
      const filtered = characters.filter(character =>
        character.name.toLowerCase().includes(query.toLowerCase())
      );
      setCharacters(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">
          <span className="inline-block animate-bounce mr-2">✨</span>
          Anime Chat
          <span className="inline-block animate-bounce ml-2">✨</span>
        </h1>
        <p className="text-lg text-purple-500">
          Vorbește cu personajele tale preferate din anime și desene animate!
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
          <input
            type="text"
            placeholder="Caută personaje..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 pl-10 rounded-full border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}

        {characters.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-purple-600">Nu am găsit personaje... 😢</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCharacters(characters);
              }}
              className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-lg"
            >
              Arată toate personajele
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-purple-500 pb-4">
        <p>© 2023 Anime Chat App - Creat pentru învățare React</p>
      </footer>
    </div>
  );
};

export default SimplePage;
