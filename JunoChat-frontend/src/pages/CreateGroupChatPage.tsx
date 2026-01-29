
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCharacters, createGroupChat, getGroupChat } from '@/api';
import { Character } from '@/types/character';
import { Button } from '@/components/Button';
import { Search, Users, MessageCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const CreateGroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data);
      } catch (error) {
        console.error('Error loading characters:', error);
        toast.error('Failed to load characters');
      } finally {
        setLoading(false);
      }
    };
    loadCharacters();
  }, []);

  const toggleCharacterSelection = (character: Character) => {
    setSelectedCharacters(prev => {
      const isSelected = prev.some(c => c.id === character.id);
      if (isSelected) {
        return prev.filter(c => c.id !== character.id);
      } else {
        return [...prev, character];
      }
    });
  };

  const isCharacterSelected = (characterId: string) => {
    return selectedCharacters.some(c => c.id === characterId);
  };

  const handleCreateGroupChat = async () => {
    if (selectedCharacters.length < 2) {
      toast.error('Please select at least 2 characters');
      return;
    }

    const userId = localStorage.getItem('user');
    if (!userId) {
      toast.error('Please log in to create a group chat');
      navigate('/login');
      return;
    }

    setCreating(true);
    try {
      const characterIds = selectedCharacters.map(c => c.id);
      
      // Check if group chat already exists
      const existingChat = await getGroupChat(userId, characterIds);
      
      if (existingChat.group_chat_id) {
        toast.success('Navigating to existing group chat');
        navigate(`/group-chat/${existingChat.group_chat_id}`, {
          state: {
            characterIds,
            characters: selectedCharacters
          }
        });
      } else {
        // Create new group chat
        const response = await createGroupChat(userId, characterIds);
        toast.success('Group chat created successfully!');
        navigate(`/group-chat/${response.group_chat_id}`, {
          state: {
            characterIds,
            characters: selectedCharacters
          }
        });
      }
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast.error('Failed to create group chat');
    } finally {
      setCreating(false);
    }
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-purple-600">Loading characters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="text-purple-500 h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Create Group Chat
          </h1>
          <p className="text-purple-700 mt-2">
            Select 2 or more characters to start a group conversation
          </p>
        </div>

        {/* Selected Characters Bar */}
        <AnimatePresence>
          {selectedCharacters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/70 backdrop-blur-md rounded-xl p-4 mb-6 shadow-lg border border-purple-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-800">
                  Selected Characters ({selectedCharacters.length})
                </h3>
                <Button
                  onClick={handleCreateGroupChat}
                  disabled={selectedCharacters.length < 2 || creating}
                  gradient
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {creating ? 'Creating...' : 'Start Group Chat'}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCharacters.map(character => (
                  <motion.div
                    key={character.id}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1"
                  >
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-purple-800">
                      {character.name}
                    </span>
                    <button
                      onClick={() => toggleCharacterSelection(character)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            <Input
              placeholder="Search characters..."
              className="pl-10 border-purple-200 focus:border-purple-500 bg-white/70 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCharacters.map(character => (
            <motion.div
              key={character.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCharacterSelection(character)}
              className={`
                relative cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all
                ${isCharacterSelected(character.id)
                  ? 'ring-4 ring-purple-500 ring-offset-2'
                  : 'hover:shadow-xl'
                }
              `}
            >
              {/* Selection Checkbox */}
              {isCharacterSelected(character.id) && (
                <div className="absolute top-2 right-2 z-10 bg-purple-500 rounded-full p-1">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Character Image */}
              <div className="aspect-square relative">
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Character Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {character.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-600 text-lg">No characters found</p>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-purple-600">
          <p>💡 Tip: Click on characters to select them, then click "Start Group Chat"</p>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatPage;
