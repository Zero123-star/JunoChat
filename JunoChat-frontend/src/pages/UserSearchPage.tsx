import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
}

const UserSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:8000/api/users/?search=${encodeURIComponent(query)}`);
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
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Search Users</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter username"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          disabled={loading}
        >
          Search
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-2">
        {results.length > 0 ? (
          results.map(user => (
            <li
              key={user.username}
              className="bg-white rounded shadow p-3 cursor-pointer hover:bg-purple-100 transition"
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              <span className="font-medium text-purple-700">{user.username}</span>
            </li>
          ))
        ) : (
          !loading && (
            hasSearched
              ? <div className="text-gray-500">No users found with that name.</div>
              : <div className="text-gray-500">Enter a username and click search to check.</div>
          )
        )}
      </ul>
    </div>
  );
};

export default UserSearchPage;