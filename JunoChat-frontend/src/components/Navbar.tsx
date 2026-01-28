import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Plus, LogIn, Settings } from 'lucide-react';
import { Users } from 'lucide-react';
import defaultAvatar from '../../images/icon.png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname; // Get the current path

  const [authState, setAuthState] = React.useState({
    isLoggedIn: !!localStorage.getItem('token'),
    username: null as string | null,
    profilePicture: null as string | null
  });

  React.useEffect(() => {
    const fetchUsername = async () => {
      const userId = localStorage.getItem('user');
      if (userId) {
        try {
          const parsedUserId = JSON.parse(userId);
          const response = await fetch('http://localhost:8000/api/users/get_username/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: parsedUserId })
          });
          const data = await response.json();
          
          // Also fetch the full user data to get profile picture
          const userResponse = await fetch(`http://localhost:8000/api/users/${parsedUserId}/`);
          const userData = await userResponse.json();
          
          const profilePicUrl = userData.profile_picture
            ? (userData.profile_picture.startsWith('http') 
                ? userData.profile_picture 
                : `http://localhost:8000${userData.profile_picture}`)
            : defaultAvatar;
          
          setAuthState({
            isLoggedIn: true,
            username: data.username,
            profilePicture: profilePicUrl
          });
        } catch (error) {
          console.error('Error fetching username:', error);
          setAuthState({
            isLoggedIn: !!localStorage.getItem('token'),
            username: null,
            profilePicture: null
          });
        }
      } else {
        setAuthState({
          isLoggedIn: false,
          username: null,
          profilePicture: null
        });
      }
    };
    
    fetchUsername();
  }, []);

  React.useEffect(() => {
    const handleStorage = async () => {
      const userId = localStorage.getItem('user');
      if (userId) {
        try {
          const parsedUserId = JSON.parse(userId);
          const response = await fetch('http://localhost:8000/api/users/get_username/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: parsedUserId })
          });
          const data = await response.json();
          
          // Also fetch the full user data to get profile picture
          const userResponse = await fetch(`http://localhost:8000/api/users/${parsedUserId}/`);
          const userData = await userResponse.json();
          
          const profilePicUrl = userData.profile_picture
            ? (userData.profile_picture.startsWith('http') 
                ? userData.profile_picture 
                : `http://localhost:8000${userData.profile_picture}`)
            : defaultAvatar;
          
          setAuthState({
            isLoggedIn: true,
            username: data.username,
            profilePicture: profilePicUrl
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setAuthState({
            isLoggedIn: false,
            username: null,
            profilePicture: null
          });
        }
      } else {
        setAuthState({
          isLoggedIn: false,
          username: null,
          profilePicture: null
        });
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChange', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChange', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthState({ isLoggedIn: false, username: null, profilePicture: null });
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link 
            to="/home" 
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
          >
            Home
          </Link>
          {authState.isLoggedIn && (
            <Link 
              to="/chats" 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
            >
              Chats
            </Link>
          )}
          {authState.isLoggedIn && (
            <Link 
              to="/create-group-chat" 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Group Chat
            </Link>
          )}
          <Link 
            to="/characters" 
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
          >
            Characters
          </Link>
          {authState.isLoggedIn && (
            <Link 
              to="/api-config" 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              API Config
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {authState.isLoggedIn && (
            <Button
              onClick={() => navigate('/characters/add')}
              glassEffect
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Character</span>
            </Button>
          )}

          <Button
            onClick={() => navigate('/search-users')}
            glassEffect
          >
            Search Users
          </Button>

          {authState.isLoggedIn ? (
            currentPath === `/profile/${authState.username}` ? (
              <Button
                onClick={handleLogout}
                gradient
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/profile/${authState.username}`)}
                glassEffect
                className="flex items-center space-x-2"
              >
                <img 
                  src={authState.profilePicture || defaultAvatar} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                <span>{authState.username}</span>
              </Button>
            )
          ) : (
            <Button
              onClick={() => navigate('/login')}
              glassEffect
              className="flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;