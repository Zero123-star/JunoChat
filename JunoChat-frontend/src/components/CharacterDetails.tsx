import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Character {
  id: string;
  name: string;
  avatar: string;
  source: string;
  description: string;
  creator?: string;
}

interface Chat {
  id: string;
  title: string;
  last_message: string;
}

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWide, setIsWide] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/characters/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch character details');
        }
        const data = await response.json();
        setCharacter(data);
      } catch {
        setError('Failed to load character details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/characters/${id}/chats/`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } catch {}
    };
    fetchChats();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/current_user/');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch {}
    };
    fetchUser();
  }, []);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setIsWide(img.naturalWidth > img.naturalHeight);
  };

  const handleStartChat = () => {
    navigate(`/chat/${id}`);
  };

  const handleEditCharacter = () => {
    navigate(`/characters/edit/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const isCreator = user && character && user.username === character.creator;

  return (
    <div className="p-6 bg-gray-100 flex items-center justify-center h-full">
      <div className={`w-full max-w-4xl bg-white shadow-xl rounded-xl flex flex-col md:flex-row overflow-hidden`}>
        <div className={`flex-shrink-0 flex items-center justify-center bg-gray-50 ${isWide ? 'md:w-1/2 w-full' : 'md:w-1/3 w-full'} p-6`}>
          <img
            src={character?.avatar}
            alt={character?.name}
            onLoad={handleImageLoad}
            className="w-full max-h-[400px] object-contain rounded-lg border"
          />
        </div>
        <div className={`flex-1 p-8 flex flex-col`}>
          <h1 className="text-3xl font-bold mb-2">{character?.name}</h1>
          <p className="text-gray-700 mb-3">{character?.description}</p>
          <p className="text-gray-500 mb-6">Source: {character?.source}</p>
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleStartChat}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-pink-500 transition"
            >
              Start Chat
            </button>
            {isCreator && (
              <button
                onClick={handleEditCharacter}
                className="bg-pink-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-purple-700 transition"
              >
                Edit Character
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Previous Chats</h2>
            <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50">
              {!user ? (
                <p className="text-gray-400">You must be logged in to view previous chats.</p>
              ) : chats.length === 0 ? (
                <p className="text-gray-400">No chats yet.</p>
              ) : (
                <>
                  {chats.slice(0, 5).map((chat) => (
                    <div
                      key={chat.id}
                      className="mb-2 p-2 bg-white rounded shadow cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    >
                      <div className="font-medium">{chat.title}</div>
                      <div className="text-sm text-gray-500 truncate">{chat.last_message}</div>
                    </div>
                  ))}
                  {chats.length > 5 && (
                    <div
                      className="text-center text-blue-600 font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/characters/${id}/chats`)}
                    >
                      View all chats...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;