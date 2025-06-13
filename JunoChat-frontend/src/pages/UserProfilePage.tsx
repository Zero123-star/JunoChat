import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import axios from 'axios';
import defaultAvatar from '../../images/icon.png'; 
import CharacterCarousel from '@/components/CharacterCarousel';

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const user = localStorage.getItem('user');
  const loggedInUsername = user ? JSON.parse(user).username : null;
  const isOwnProfile = username === loggedInUsername;

  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(defaultAvatar);
  const [name, setName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [createdCharacters, setCreatedCharacters] = useState([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [followsCount, setFollowsCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile/${username}/`);
        const { name, email, profile_image, created_characters, favorite_characters, follows_count, following_count } = response.data;
        setName(name);
        setEmail(email);
        setProfileImage(profile_image || defaultAvatar);
        setCreatedCharacters(created_characters);
        setFavoriteCharacters(favorite_characters);
        setFollowsCount(follows_count);
        setFollowingCount(following_count);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/profile/${username}/follow/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(`Followed ${username}:`, response.data);
      setFollowsCount((prev) => prev + 1); 
    } catch (error) {
      console.error('Error following user:', error);
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
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-32 w-32 object-cover rounded-full mx-auto cursor-pointer border-4 border-white shadow-md"
                onClick={() => document.getElementById('profileImageInput')?.click()}
              />
            ) : (
              <motion.div 
                className="inline-block"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 260, 
                  damping: 20 
                }}
                onClick={() => document.getElementById('profileImageInput')?.click()}
              >
                <Sparkles className="text-pink-500 h-8 w-8 mx-auto mb-2" />
              </motion.div>
            )}
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              <p className="text-purple-800 font-medium">
                {name}
              </p>
            </h1>
            <p className="text-purple-800 font-medium">{email}</p>
            <p className="text-purple-700 mt-2">
              Click on your profile picture to change it.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center text-purple-800 font-medium">
              <p>Follows: {followsCount}</p>
              {!isOwnProfile && (
                <Button
                  type="button"
                  onClick={handleFollow}
                  gradient
                >
                  Follow
                </Button>
              )}
              <p>Following: {followingCount}</p>
            </div>

            <div className="space-y-5">
              <h2 className="text-xl font-bold text-purple-800">Created Characters</h2>
              <CharacterCarousel characters={createdCharacters} onSelect={() => {}} />
            </div>

            <div className="space-y-5">
              <h2 className="text-xl font-bold text-purple-800">Favorite Characters</h2>
              <CharacterCarousel characters={favoriteCharacters} onSelect={() => {}} />
            </div>

            <div className="space-y-5">
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              {isOwnProfile && (
                <Button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to log out?')) {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/login');
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
          {!isOwnProfile && (
            <>
              <p className="text-gray-500 text-center mt-4">You are viewing {username}'s profile.</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
