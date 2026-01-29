import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import axios from 'axios';
import defaultAvatar from '../../images/icon.png'; 
import CharacterCarousel from '@/components/CharacterCarousel';

const UserProfilePage: React.FC = () => {
  const { username: urlUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(defaultAvatar);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [createdCharacters, setCreatedCharacters] = useState([]);
  const [favoriteCharacters] = useState([]);
  const [followsCount, setFollowsCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Use logged-in username if URL username is missing (e.g., /profile)
  const username = urlUsername || loggedInUsername;
  const isOwnProfile = username === loggedInUsername;

  // Get logged in user's username and ID
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const userIdFromStorage = localStorage.getItem('user');
      if (userIdFromStorage) {
        try {
          const parsedUserId = JSON.parse(userIdFromStorage);
          setUserId(parsedUserId);
          
          // Get the username of logged-in user
          const response = await axios.post('http://localhost:8000/api/users/get_username/', {
            id: parsedUserId
          });
          setLoggedInUsername(response.data.username);
        } catch (error) {
          console.error('Error fetching logged in user:', error);
        }
      }
    };
    
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Get user data by username
        const usersResponse = await axios.get(`http://localhost:8000/api/users/?search=${username}`);
        
        if (usersResponse.data && usersResponse.data.length > 0) {
          const userData = usersResponse.data[0];
          setName(userData.username);
          setEmail(userData.email || 'No email available');
          
          // Handle profile picture URL - check if it's already a full URL
          const profilePicUrl = userData.profile_picture
            ? (userData.profile_picture.startsWith('http') 
                ? userData.profile_picture 
                : `http://localhost:8000${userData.profile_picture}`)
            : defaultAvatar;
          setProfileImage(profilePicUrl);
          
          setFollowsCount(userData.followers_count || 0);
          setFollowingCount(userData.following_count || 0);
          setProfileUserId(userData.id);

          // Check if logged-in user is already following this user
          if (userId) {
            try {
              const followingResponse = await axios.get(`http://localhost:8000/api/users/${userId}/following/`);
              const isAlreadyFollowing = followingResponse.data.some((user: { username: string }) => user.username === username);
              setIsFollowing(isAlreadyFollowing);
            } catch (error) {
              console.error('Error checking follow status:', error);
            }
          }

          // Get characters created by this user
          const charactersResponse = await axios.get(`http://localhost:8000/api/characters/`);
          console.log('All characters:', charactersResponse.data);
          const userCharacters = charactersResponse.data.filter((char: { creator_username: string }) => char.creator_username === username);
          console.log('Filtered user characters:', userCharacters);
          setCreatedCharacters(userCharacters);
        } else {
          setName(username || 'Unknown User');
          setEmail('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setName(username || 'Unknown User');
        setEmail('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, userId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return; // Prevent non-owners from changing image
    
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setHasUnsavedChanges(true);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedFile) {
      alert('No file selected');
      return;
    }
    
    if (!userId) {
      alert('User ID not found. Please try logging out and back in.');
      return;
    }

    console.log('=== PROFILE PICTURE SAVE DEBUG ===');
    console.log('User ID:', userId);
    console.log('File:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type
    });

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);
    
    // Log FormData contents
    console.log('FormData entries:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const url = `http://localhost:8000/api/users/${userId}/`;
    console.log('Request URL:', url);

    try {
      console.log('Sending PATCH request...');
      const response = await axios.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      
      console.log('SUCCESS! Response:', response);
      console.log('Response data:', response.data);
      
      // Update local state with server response
      if (response.data.profile_picture) {
        const imageUrl = response.data.profile_picture.startsWith('http') 
          ? response.data.profile_picture 
          : `http://localhost:8000${response.data.profile_picture}`;
        console.log('Setting new profile image:', imageUrl);
        setProfileImage(imageUrl);
      }
      
      setHasUnsavedChanges(false);
      setSelectedFile(null);
      alert('Profile picture updated successfully!');
      
      // Reload the page to fetch fresh data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('=== ERROR SAVING PROFILE PICTURE ===');
      console.error('Error object:', error);
      
      let errorMsg = 'Unknown error';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number; headers?: unknown }; message?: string };
        console.error('Error response:', axiosError.response);
        console.error('Error data:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        console.error('Error headers:', axiosError.response?.headers);
        
        const responseData = axiosError.response?.data as Record<string, unknown> | undefined;
        errorMsg = (responseData?.detail as string) || 
                   (responseData?.error as string) || 
                   JSON.stringify(axiosError.response?.data) || 
                   axiosError.message ||
                   'Unknown error';
      }
      
      alert(`Failed to update profile picture:\n${JSON.stringify(errorMsg, null, 2)}`);
    }
  };

  const handleFollow = async () => {
    if (!profileUserId || !userId) {
      console.error('Missing user IDs - profileUserId:', profileUserId, 'userId:', userId);
      alert('Unable to follow: Missing user information');
      return;
    }

    console.log('=== FOLLOW/UNFOLLOW DEBUG ===');
    console.log('Profile User ID:', profileUserId);
    console.log('Logged-in User ID:', userId);
    console.log('Is Following:', isFollowing);

    try {
      const url = isFollowing 
        ? `http://localhost:8000/api/users/${profileUserId}/unfollow/`
        : `http://localhost:8000/api/users/${profileUserId}/follow/`;
      
      console.log('Request URL:', url);
      console.log('Request headers:', {
        Authorization: `Token ${localStorage.getItem('token')}`,
        'X-User-ID': userId,
      });

      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'X-User-ID': userId,
        },
      });
      
      console.log('SUCCESS! Response:', response.data);
      
      if (isFollowing) {
        setIsFollowing(false);
        setFollowsCount((prev) => prev - 1);
      } else {
        setIsFollowing(true);
        setFollowsCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('=== FOLLOW ERROR ===');
      console.error('Error object:', error);
      
      let errorMsg = 'Unknown error';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string }; status?: number }; message?: string };
        console.error('Error response:', axiosError.response);
        console.error('Error data:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        console.error('Error message:', axiosError.message);
        
        errorMsg = axiosError.response?.data?.error || axiosError.message || 'Unknown error';
      }
      
      alert(`Failed to update follow status: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <p className="text-purple-800 text-xl">Loading profile...</p>
      </div>
    );
  }

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
                className={`h-32 w-32 object-cover rounded-full mx-auto border-4 border-white shadow-md ${isOwnProfile ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
                onClick={() => isOwnProfile && document.getElementById('profileImageInput')?.click()}
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
                onClick={() => isOwnProfile && document.getElementById('profileImageInput')?.click()}
              >
                <Sparkles className="text-pink-500 h-8 w-8 mx-auto mb-2" />
              </motion.div>
            )}
            {isOwnProfile && (
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              <p className="text-purple-800 font-medium">
                {name}
              </p>
            </h1>
            <p className="text-purple-800 font-medium">{email}</p>
            {isOwnProfile && (
              <>
                <p className="text-purple-700 mt-2 text-sm">
                  Click on your profile picture to change it.
                </p>
                {hasUnsavedChanges && (
                  <Button
                    type="button"
                    onClick={handleSaveChanges}
                    gradient
                    className="mt-3"
                  >
                    Save Changes
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center text-purple-800 font-medium">
              <p>Follows: {followsCount}</p>
              {!isOwnProfile && (
                <div className="flex flex-col items-center gap-2">
                  {isFollowing && (
                    <span className="text-xs text-green-600 font-semibold">
                      Following
                    </span>
                  )}
                  <Button
                    type="button"
                    onClick={handleFollow}
                    gradient={!isFollowing}
                    className={isFollowing 
                      ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200" 
                      : ""
                    }
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              )}
              <p>Following: {followingCount}</p>
            </div>

            <div className="space-y-5">
              <h2 className="text-xl font-bold text-purple-800">
                Created Characters ({createdCharacters.length})
              </h2>
              {createdCharacters.length > 0 ? (
                <CharacterCarousel characters={createdCharacters} onSelect={() => {}} />
              ) : (
                <p className="text-gray-500 text-sm">No characters created yet.</p>
              )}
            </div>

            <div className="space-y-5">
              <h2 className="text-xl font-bold text-purple-800">
                Favorite Characters ({favoriteCharacters.length})
              </h2>
              {favoriteCharacters.length > 0 ? (
                <CharacterCarousel characters={favoriteCharacters} onSelect={() => {}} />
              ) : (
                <p className="text-gray-500 text-sm">No favorite characters yet.</p>
              )}
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
