import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCharacter } from '@/api';
import { Character } from '@/types/character';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AddCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<Character, 'id' | 'creator'>>({
    name: '',
    description: '',
    avatar: '',
    tags: '',
    color: '#000000'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to create a character');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      //console.log(formData);
      console.log("User",localStorage.getItem('user'));
      const creator_id = localStorage.getItem('user');
      const final_data={formData,creator_id};
      const response=await createCharacter(final_data);
      console.log(response)
      toast.success('Character created successfully!');
      navigate('/characters');
    } catch (err) {
      setError('Failed to create character. Please try again.');
      toast.error('Failed to create character');
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

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center px-4 py-12">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-pink-100">
          <div className="text-center mb-8">
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
              Create New Character
            </h1>
            <p className="text-purple-700 mt-2">
              Bring your character to life
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-800 font-medium">Name</Label>
              <Input 
                id="name" 
                type="text" 
                name="name"
                value={formData.name}
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
                value={formData.description}
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
                value={formData.tags}
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
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10 w-20 rounded-lg cursor-pointer"
                />
                <span className="text-purple-700">{formData.color}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/characters')}
                glassEffect
              >
                Cancel
              </Button>
              <Button
                type="submit"
                gradient
                disabled={loading}
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCharacterPage; 