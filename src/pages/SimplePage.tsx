import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Character } from '@/types/character';
import { fetchCharacters } from '../api';
import { Search } from 'lucide-react';
import { CharacterCard } from '@/components/CharacterCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SimplePage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]); // for search reset
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data);
        setAllCharacters(data);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setCharacters(allCharacters);
    } else {
      const filtered = allCharacters.filter(character =>
        character.name.toLowerCase().includes(query.toLowerCase())
      );
      setCharacters(filtered);
    }
  };

  // Helper function to get color class based on emotion
  function getEmotionColorClass(description: string) {
    if (/happy|joy|excited|cheerful|optimist/i.test(description)) return 'text-yellow-500';
    if (/sad|cry|lonely|depressed|blue|melancholy/i.test(description)) return 'text-blue-500';
    if (/angry|mad|furious|rage|irritat/i.test(description)) return 'text-red-500';
    if (/love|romantic|heart|affection/i.test(description)) return 'text-pink-500';
    if (/scared|afraid|fear|anxious|nervous/i.test(description)) return 'text-purple-500';
    if (/surprise|shocked|amazed|wow/i.test(description)) return 'text-green-500';
    return 'text-purple-700'; // default
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-black dark:via-zinc-900 dark:to-gray-900 px-4 py-6 flex items-center justify-center">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent mb-2">
          <span className="inline-block animate-bounce mr-2">✨</span>
          Anime Chat
          <span className="inline-block animate-bounce ml-2">✨</span>
        </h1>
        <p className="text-lg bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
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
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64">
              <Skeleton height={256} borderRadius={16} />
            </div>
          ))
        ) : characters.length > 0 ? (
          characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              textClassName={getEmotionColorClass(character.description)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-purple-600">Nu am găsit personaje... 😢</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCharacters(allCharacters);
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
