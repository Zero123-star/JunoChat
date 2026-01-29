import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Users } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface User {
  id: number;
  username: string;
  followers_count?: number;
  profile_picture?: string;
}

const UserSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch top users on component mount
    const fetchTopUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/top_users/`);
        if (!response.ok) throw new Error('Failed to fetch top users');
        const data = await response.json();
        setTopUsers(data);
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };
    fetchTopUsers();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setResults(data);
    } catch {
      setError('Failed to search users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">Search Users</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter username"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            gradient
            disabled={loading}
          >
            Search
          </Button>
        </form>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-purple-800">Search Results</h2>
            <ul className="space-y-2">
              {results.length > 0 ? (
                results.map(user => (
                  <li
                    key={user.username}
                    className="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-4 cursor-pointer hover:bg-purple-100 transition flex justify-between items-center border border-pink-100"
                  >
                    <span className="font-medium text-purple-700">{user.username}</span>
                    <Button
                      gradient
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      View Profile
                    </Button>
                  </li>
                ))
              ) : (
                !loading && <div className="text-gray-500">No users found with that name.</div>
              )}
            </ul>
          </div>
        )}
        
        {/* Top 10 Users */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-800 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Top 10 Users by Followers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topUsers.map((user, index) => (
              <div
                key={user.id}
                className="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-4 hover:shadow-lg transition border border-pink-100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold flex-shrink-0">
                      #{index + 1}
                    </div>
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture.startsWith('http') ? user.profile_picture : `${API_BASE_URL}${user.profile_picture}`}
                        alt={user.username}
                        className="h-12 w-12 rounded-full object-cover border-2 border-purple-300"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-purple-700">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.followers_count || 0} followers</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchPage;