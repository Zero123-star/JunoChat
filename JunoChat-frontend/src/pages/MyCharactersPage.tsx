import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { fetchMyCharacters, deleteCharacter } from '../api';
import { toast } from 'sonner';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  creator: string;
  creator_username: string;
}

const MyCharactersPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyCharacters = async () => {
      try {
        const userId = localStorage.getItem('user');
        if (!userId) {
          navigate('/login');
          return;
        }

        // Fetch characters created by current user
        const myCharacters = await fetchMyCharacters();
        setCharacters(myCharacters);
      } catch (error) {
        console.error('Error fetching characters:', error);
        toast.error('Failed to load your characters');
      } finally {
        setLoading(false);
      }
    };

    loadMyCharacters();
  }, [navigate]);

  const handleDelete = async (characterId: string) => {
    if (!window.confirm('Are you sure you want to delete this character?')) {
      return;
    }

    try {
      await deleteCharacter(characterId);
      setCharacters(characters.filter(char => char.id !== characterId));
      toast.success('Character deleted successfully!');
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('Failed to delete character');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <p className="text-purple-800 text-xl">Loading your characters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            My Characters
          </h1>
          <Button
            onClick={() => navigate('/characters/add')}
            gradient
            className="flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Character</span>
          </Button>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-700 text-lg mb-4">You haven't created any characters yet.</p>
            <Button
              onClick={() => navigate('/characters/add')}
              gradient
              className="flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Character</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={character.avatar || '/placeholder-avatar.png'}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">{character.name}</h3>
                  <p className="text-purple-600 text-sm mb-4 line-clamp-3">
                    {character.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => navigate(`/characters/edit/${character.id}`)}
                      gradient
                      className="flex-1 flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      onClick={() => handleDelete(character.id)}
                      className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCharactersPage;
