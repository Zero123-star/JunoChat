import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/uiButton';
import { Plus, LogIn, SunMoon, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // <-- NEW
import { toggleDarkMode, loadTheme } from '@/theme';         // <-- NEW

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { token, user, logout, isModerator } = useAuth(); // <-- use global state, add user

  React.useEffect(() => {
    // Ensure light theme is default on first load
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    loadTheme();
  }, []);

  return (
    <nav className="relative bg-gradient-to-r from-purple-400 to-pink-500 p-3 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left: Navigation Links */}
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

        {/* Right: Auth Actions & Dark Mode Toggle */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleDarkMode}
            type="button"
            aria-label="Toggle dark mode"
            className="bg-background text-foreground border border-border hover:bg-muted hover:border-foreground p-2 rounded-lg"
          >
            <SunMoon className="h-5 w-5" />
          </Button>

          {/* New Character button: for logged-in users and guests */}
          {user && (
            <Button
              onClick={() => navigate('/characters/add')}
              type="button"
              className="bg-background text-foreground border border-border hover:bg-muted hover:border-foreground transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>New Character</span>
            </Button>
          )}

          {/* Login/Logout always visible, but app is accessible to guests */}
          {!token ? (
            <Button
              onClick={() => navigate('/login')}
              type="button"
              className="bg-background text-foreground border border-border hover:bg-muted hover:border-foreground transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          ) : (
            <Button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              type="button"
              className="bg-background text-foreground border border-border hover:bg-muted hover:border-foreground transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}

          {/* Show MOD badge only if logged in as moderator */}
          {token && isModerator && (
            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded ml-2">MOD</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
