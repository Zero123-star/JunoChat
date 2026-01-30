import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_BASE_URL } from '@/api/config';
import { API } from '@/api';
import defaultAvatar from '../../images/icon.png'; 
import CharacterCarousel from '@/components/CharacterCarousel';
import CharacterCard from '@/components/CharacterCard';

interface User {
  id: number;
  username: string;
  email?: string;
  profile_picture?: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  tags: string;
  color?: string;
  creator: string;
  creator_username?: string;
  favorites_count?: number;
  is_favorited?: boolean;
  created_at?: string;
  updated_at?: string;
}

const UserProfilePage: React.FC = () => {
  const { username: urlUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(defaultAvatar);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [createdCharacters, setCreatedCharacters] = useState<Character[]>([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [followsCount, setFollowsCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');
  
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
          const response = await API.post('users/get_username/', {
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
        const usersResponse = await API.get(`users/?search=${username}`);
        
        if (usersResponse.data && usersResponse.data.length > 0) {
          const userData = usersResponse.data[0];
          setName(userData.username);
          setEmail(userData.email || 'No email available');
          
          // Handle profile picture URL - check if it's already a full URL
          const profilePicUrl = userData.profile_picture
            ? (userData.profile_picture.startsWith('http') 
                ? userData.profile_picture 
                : `${API_BASE_URL}${userData.profile_picture}`)
            : defaultAvatar;
          setProfileImage(profilePicUrl);
          
          setFollowsCount(userData.followers_count || 0);
          setFollowingCount(userData.following_count || 0);
          setProfileUserId(userData.id);

          // Check if logged-in user is already following this user
          if (userId) {
            try {
              const followingResponse = await API.get(`users/${userId}/following/`);
              const isAlreadyFollowing = followingResponse.data.some((user: { username: string }) => user.username === username);
              setIsFollowing(isAlreadyFollowing);
            } catch (error) {
              console.error('Error checking follow status:', error);
            }
          }

          // Get characters created by this user
          const charactersResponse = await API.get('characters/');
          console.log('All characters:', charactersResponse.data);
          const userCharacters = charactersResponse.data.filter((char: { creator_username: string }) => char.creator_username === username);
          console.log('Filtered user characters:', userCharacters);
          setCreatedCharacters(userCharacters);
          
          // Get favorite characters for this user
          if (userData.id) {
            try {
              const favResponse = await API.get(`users/${userData.id}/favorite_characters/`);
              console.log('Favorite characters:', favResponse.data);
              setFavoriteCharacters(favResponse.data);
            } catch (error) {
              console.error('Error fetching favorites:', error);
            }
          }
          
          // Get followers and following lists
          if (userData.id) {
            try {
              const followersResponse = await API.get(`users/${userData.id}/followers/`);
              setFollowers(followersResponse.data);
              
              const followingResponse = await API.get(`users/${userData.id}/following/`);
              setFollowing(followingResponse.data);
            } catch (error) {
              console.error('Error fetching followers/following:', error);
            }
          }
        } else {
          setName(username || 'Unknown User');
          setEmail('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to load profile';
        toast.error(`Error loading profile: ${errorMsg}`);
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

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedName(name);
    setEditedEmail(email);
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      alert('User ID not found. Please try logging out and back in.');
      return;
    }

    try {
      const updateData: Record<string, string> = {};
      if (editedName !== name) updateData.username = editedName;
      if (editedEmail !== email) updateData.email = editedEmail;

      if (Object.keys(updateData).length > 0) {
        await API.patch(`users/${userId}/`, updateData);
        setName(editedName);
        setEmail(editedEmail);
        
        // Update localStorage if username changed
        if (editedName !== name) {
          const userData = localStorage.getItem('user');
          if (userData) {
            localStorage.setItem('user', editedName);
          }
          // Update loggedInUsername in state
          setLoggedInUsername(editedName);
        }
      }

      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(`Error updating profile: ${errorMsg}`);
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

    const url = `users/${userId}/`;
    console.log('Request URL:', url);

    try {
      console.log('Sending PATCH request...');
      const response = await API.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('SUCCESS! Response:', response);
      console.log('Response data:', response.data);
      
      // Update local state with server response
      if (response.data.profile_picture) {
        const imageUrl = response.data.profile_picture.startsWith('http') 
          ? response.data.profile_picture 
          : `${API_BASE_URL}${response.data.profile_picture}`;
        console.log('Setting new profile image:', imageUrl);
        setProfileImage(imageUrl);
      }
      
      setHasUnsavedChanges(false);
      setSelectedFile(null);
      toast.success('Profile picture updated successfully!');
      
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
      
      toast.error(`Failed to update profile picture: ${errorMsg}`);
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
        ? `${API_BASE_URL}/api/users/${profileUserId}/unfollow/`
        : `${API_BASE_URL}/api/users/${profileUserId}/follow/`;
      
      console.log('Request URL:', url);
      console.log('Request headers:', {
        Authorization: `Token ${localStorage.getItem('token')}`,
        'X-User-ID': userId,
      });

      const response = await API.post(url, {});
      
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
        className="w-full max-w-4xl"
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
            {isOwnProfile && isEditingProfile ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-center text-2xl font-bold text-purple-800 bg-white/50 rounded-lg px-4 py-2 border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Username"
                />
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="text-center text-purple-800 font-medium bg-white/50 rounded-lg px-4 py-2 border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Email"
                />
                <div className="flex gap-3 mt-3">
                  <Button
                    type="button"
                    onClick={handleSaveProfile}
                    gradient
                  >
                    Save Profile
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                    <div className="flex gap-3 mt-3 justify-center">
                      {hasUnsavedChanges && (
                        <Button
                          type="button"
                          onClick={handleSaveChanges}
                          gradient
                        >
                          Save Picture
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={handleEditProfile}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to log out?')) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            navigate('/login');
                          }
                        }}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                      >
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center text-purple-800 font-medium">

              {!isOwnProfile && (
                <div className="flex flex-col items-center gap-2">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <button
                  onClick={() => setShowFollowers(!showFollowers)}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <h2 className="text-xl font-bold text-purple-800">
                    Followers ({followsCount})
                  </h2>
                  {showFollowers ? (
                    <ChevronUp className="h-5 w-5 text-purple-800" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-800" />
                  )}
                </button>
                {showFollowers && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {followers.length > 0 ? (
                      followers.map((follower: User) => (
                        <div 
                          key={follower.id}
                          onClick={() => navigate(`/profile/${follower.username}`)}
                          className="p-3 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200 transition"
                        >
                          <p className="font-medium text-purple-800">{follower.username}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm p-3">No followers yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowFollowing(!showFollowing)}
                  className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition"
                >
                  <h2 className="text-xl font-bold text-pink-800">
                    Following ({followingCount})
                  </h2>
                  {showFollowing ? (
                    <ChevronUp className="h-5 w-5 text-pink-800" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-pink-800" />
                  )}
                </button>
                {showFollowing && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {following.length > 0 ? (
                      following.map((user: User) => (
                        <div 
                          key={user.id}
                          onClick={() => navigate(`/profile/${user.username}`)}
                          className="p-3 bg-pink-100 rounded-lg cursor-pointer hover:bg-pink-200 transition"
                        >
                          <p className="font-medium text-pink-800">{user.username}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm p-3">Not following anyone yet.</p>
                    )}
                  </div>
                )}
              </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteCharacters.map((character: Character) => (
                    <CharacterCard key={character.id} character={character} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No favorite characters yet.</p>
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
