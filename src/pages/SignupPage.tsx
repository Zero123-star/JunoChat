import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, getCurrentUser } from '@/api';
import { Button } from '@/components/ui/uiButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    // On mount, if a user is already logged in, redirect
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/characters');
    }
  }, [navigate]);

  // Ensure persona is created in backend after signup
  useEffect(() => {
    if (formData.username) {
      // Call backend to create persona for the new user (if your logic requires this)
      // You can adjust the persona fields as needed
      fetch('/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.username,
          persona: `${formData.username} is a new user persona`,
          image_url: '',
          template: 'plain',
          generation_params: { max_new_tokens: 200, temperature: 0.7, top_p: 0.9 },
        })
      }).catch(() => {});
    }
  }, [formData.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = formData;
      const response = await signup(signupData);
      
      // Show success message
      toast.success('Account created successfully! Please log in.');
      
      // Redirect to login page
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-black dark:via-zinc-900 dark:to-gray-900 px-4 py-6 flex items-center justify-center">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-pink-100 dark:border-zinc-800">
          <div className="text-center mb-8">
            <motion.div 
              className="inline-block"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 20 
              }}
            >
              <Sparkles className="text-pink-500 h-8 w-8 mx-auto mb-2" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Create Your Account
            </h1>
            <p className="text-purple-700 dark:text-pink-300 mt-2">
              Join the adventure and start chatting with characters
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-800 font-medium">Username</Label>
              <Input 
                id="username" 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400 text-purple-700 placeholder:text-purple-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-800 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400 text-purple-700 placeholder:text-purple-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-800 font-medium">Password</Label>
              <Input 
                id="password" 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400 text-purple-700 placeholder:text-purple-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-purple-800 font-medium">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password" 
                required 
                className="bg-white/50 border-pink-200 focus:border-purple-400 text-purple-700 placeholder:text-purple-300"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium h-11"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <Heart className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-700">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-500 hover:text-pink-700 hover:underline font-medium">
                Log in here
              </Link>
            </p>
            
            <div className="mt-6 pt-6 border-t border-pink-100">
              <p className="text-xs text-purple-500">
                By creating an account, you agree to chat responsibly with anime characters
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;