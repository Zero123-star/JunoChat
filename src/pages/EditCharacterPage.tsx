import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCharacter, fetchCharacter } from '@/api';
import { Character } from '@/types/character';
import { Button } from '@/components/ui/uiButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const EditCharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState<Partial<Character>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check authentication on component mount
  // (Incognito mode: allow guests, do not redirect)
  useEffect(() => {
    if (!id) return;
    const loadCharacter = async () => {
      try {
        const characterData = await fetchCharacter(id);
        // Defensive: if null, fallback to a mock character
        if (!characterData) {
          setCharacter({
            id: id,
            name: 'Demo Character',
            description: 'This is a preview character for demo purposes. You can edit all fields and see how the platform works!',
            tags: 'demo,preview',
            color: '#a78bfa', // Soft purple
            creator: 'guest',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo', // Fun SVG avatar
            public: true,
          });
          setFormData({
            id: id,
            name: 'Demo Character',
            description: 'This is a preview character for demo purposes. You can edit all fields and see how the platform works!',
            tags: 'demo,preview',
            color: '#a78bfa',
            creator: 'guest',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo',
            public: true,
          });
          setError(null); // Clear error if fallback is used
        } else {
          setCharacter(characterData);
          setFormData({
            ...characterData,
            tags: characterData.tags || ''
          });
          if (characterData.avatar) {
            setPreviewImage(characterData.avatar);
          }
          setError(null); // Clear error if loaded
        }
      } catch (err) {
        setCharacter({
          id: id,
          name: 'Unknown Character',
          description: 'This is a fallback mock character.',
          tags: 'mock',
          color: '#cccccc',
          creator: 'guest',
          avatar: '',
          public: true,
        });
        setFormData({
          id: id,
          name: 'Unknown Character',
          description: 'This is a fallback mock character.',
          tags: 'mock',
          color: '#cccccc',
          creator: 'guest',
          avatar: '',
          public: true,
        });
        setError(null); // Clear error if fallback is used
      }
    };
    loadCharacter();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Save to localStorage for session persistence
      const localCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
      const updatedChar = { ...formData, id };
      let updatedList;
      const existingIndex = localCharacters.findIndex((c: any) => c.id === id);
      if (existingIndex !== -1) {
        updatedList = localCharacters.map((c: any) => c.id === id ? updatedChar : c);
      } else {
        updatedList = [...localCharacters, updatedChar];
      }
      localStorage.setItem('characters', JSON.stringify(updatedList));

      // Also upload to Django backend (real API call)
      await updateCharacter(id, formData);
      toast.success('Character updated successfully!');
      navigate('/characters');
    } catch (err) {
      setError('Failed to update character. Please try again.');
      toast.error('Failed to update character');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags: tags.join(',') }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!character) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-700">Loading character...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-black dark:via-zinc-900 dark:to-gray-900 px-4 py-6 flex items-center justify-center">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-pink-100 flex flex-col items-center">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-full mb-4 border-4 border-purple-200 shadow-md"
            />
          )}
          <div className="text-center mb-8 w-full">
            {character?.tags?.includes('demo') && (
              <span className="inline-block mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-semibold shadow-md">
                Preview Character
              </span>
            )}
            <motion.div 
              className="inline-block"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
            >
              <Sparkles className="text-pink-500 h-8 w-8 mx-auto mb-2" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Edit Character
            </h1>
            <p className="text-purple-700 mt-2">
              Update your character's details
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-xs mx-auto">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-800 font-medium">Name</Label>
              <Input 
                id="name" 
                type="text" 
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter character name" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-purple-800 font-medium">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Describe your character"
                required
                rows={4}
                className="w-full px-3 py-2 bg-white/50 border border-pink-200 rounded-lg focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-purple-800 font-medium">Character Image</Label>
              <div className="flex items-center space-x-4">
                <label className="flex-1">
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto text-pink-500" />
                      <p className="mt-2 text-sm text-purple-700">Click to upload image</p>
                    </div>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-purple-800 font-medium">Tags</Label>
              <Input 
                id="tags" 
                type="text" 
                value={formData.tags || ''}
                onChange={handleTagsChange}
                placeholder="Enter tags (comma-separated)" 
                className="bg-white/50 border-pink-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-purple-800 font-medium">Color</Label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color || '#000000'}
                  onChange={handleChange}
                  className="h-10 w-20 rounded-lg cursor-pointer"
                />
                <span className="text-purple-700">{formData.color || '#000000'}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                onClick={() => navigate('/characters')}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCharacterPage;