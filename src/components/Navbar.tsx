import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/uiButton';
import { Plus, LogIn, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const currentPath = window.location.pathname; // Get the current path

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
          <Link 
            to="/characters" 
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
          >
            Characters
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {isLoggedIn && (
            <Button
              onClick={() => navigate('/characters/add')}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>New Character</span>
            </Button>
          )}
          
          {isLoggedIn && currentPath !== `/profile/${localStorage.getItem('username')}` ? (
            <Button
              onClick={() => navigate(`/profile/${localStorage.getItem('username')}`)}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
            >
              <User className="h-4 w-4" />
              <span>{localStorage.getItem('username')}</span>
            </Button>
          ) : isLoggedIn ? (
            <Button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                navigate('/login');
              }}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
            >
              <span>Log out</span>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
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