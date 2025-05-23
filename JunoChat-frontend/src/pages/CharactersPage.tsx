import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Character } from '@/types/character';
import { fetchCharacters } from '../api';
import CharacterGrid from '../components/CharacterGrid';
import { Search, Sparkles, Heart } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/uiButton';

const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]); // Starea pentru personajele obținute
  const [loading, setLoading] = useState<boolean>(true); // Starea pentru afișarea loader-ului
  const [searchQuery, setSearchQuery] = useState(''); // Starea pentru căutare

  // Fetch personajele din API la montarea componentei
  useEffect(() => {
    const getCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data); // Setează personajele în state
        console.log('Personaje:', data); // Verifică datele în consolă
      } catch (error) {
        console.error('Eroare la obținerea personajelor:', error);
        toast.error('Nu am putut încărca personajele. Încearcă din nou!');
      } finally {
        setLoading(false); // Dezactivează loader-ul
      }
    };

    getCharacters();
  }, []);

  // Funcție pentru selectarea unui personaj
  const handleSelectCharacter = (character: Character) => {
    toast.success(`Starting chat with ${character.name}! 💬✨`, {
      icon: '💫',
    });
    console.log('Selected character:', character);
  };

  // Funcție pentru căutare
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setCharacters(characters); // Resetează lista dacă nu există căutare
    } else {
      const filtered = characters.filter((character) =>
        character.name.toLowerCase().includes(query.toLowerCase())
      );
      setCharacters(filtered);
    }
  };

  // Afișează un loader dacă datele sunt încărcate
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-purple-600">Loading characters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-4">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text text-5xl font-bold">
                <Sparkles className="inline-block mr-2 text-pink-500" size={32} />
                Characters
                <Heart className="inline-block ml-2 text-pink-500" size={28} />
              </span>
            </div>
            <p className="text-lg text-purple-700 max-w-3xl mx-auto font-medium">
              Choose your favorite character and start an exciting conversation full of adventures!
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                <Input
                  placeholder="Search for characters..."
                  className="pl-10 border-purple-200 focus:border-purple-500 bg-white/70 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-100/50 to-purple-100/50 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-purple-100">
            {characters.length > 0 ? (
              <CharacterGrid
                characters={characters}
                onSelectCharacter={handleSelectCharacter}
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl text-purple-700">No characters found 😢</h3>
                <Button
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => {
                    setSearchQuery('');
                    setCharacters([]); // Resetează lista
                  }}
                >
                  Show all characters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharactersPage;