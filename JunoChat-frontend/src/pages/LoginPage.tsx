import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getCurrentUser } from '@/api';
import { Button } from '@/components/ui/uiButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/characters');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      //Check if you can login
      const response = await login(formData);
      //response.status : either user_id or error message. response.worked: true if we have user_id or false.
      // Store the auth token
      if(response.worked==true)
      {
        localStorage.setItem('token', response.state); //CAREFULL. Right now it just stores the pk of user.
      // Get user id
      //const userData = await getCurrentUser();
        localStorage.setItem('user', JSON.stringify(response.status));
      }
      navigate('/characters');
    } catch (err) {
      {setError('Invalid username or password');
      console.log(err);
      }
      } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
              Welcome Back!
            </h1>
            <p className="text-purple-700 mt-2">
              Sign in to chat with your favorite characters
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-800 font-medium">Username</Label>
              <Input 
                id="email" 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your email" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-purple-800 font-medium">Password</Label>
                <a 
                  href="#" 
                  className="text-sm text-pink-500 hover:text-pink-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium h-11"
            >
              {loading ? 'Logging in...' : 'Start Your Adventure'}
              <Heart className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-700">
              Don't have an account?{" "}
              <Link to="/signup" className="text-pink-500 hover:text-pink-700 hover:underline font-medium">
                Create one now
              </Link>
            </p>
            
            <div className="mt-6 pt-6 border-t border-pink-100">
              <p className="text-xs text-purple-500">
                We hope you will have fun!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;