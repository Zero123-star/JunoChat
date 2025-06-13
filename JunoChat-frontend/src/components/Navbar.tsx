import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Plus, LogIn, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname; // Get the current path

  const [authState, setAuthState] = React.useState({
    isLoggedIn: !!localStorage.getItem('token'),
    username: (() => {
      const user = localStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      return parsedUser && parsedUser.username ? parsedUser.username : null;
    })()
  });

  React.useEffect(() => {
    const handleStorage = () => {
      const user = localStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      setAuthState({
        isLoggedIn: !!localStorage.getItem('token'),
        username: parsedUser && parsedUser.username ? parsedUser.username : null
      });
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
      setAuthState({ isLoggedIn: false, username: null });
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
          <Link 
            to="/characters" 
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
          >
            Characters
          </Link>
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
                <User className="h-4 w-4" />
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