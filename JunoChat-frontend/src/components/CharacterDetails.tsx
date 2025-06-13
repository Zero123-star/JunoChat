import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { get_first_chat, getCurrentUser, getChatHistory} from '@/api';
import { get } from 'http';
import { Button } from '@/components/Button';

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
        
        const response = await fetch(`http://localhost:8080/api/characters/${id}/`);
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
          //userid from localstorage
        const userId = localStorage.getItem('user');
        const response = await getChatHistory(userId); //TODO: Some filtering
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
        const currentUserId = localStorage.getItem('user');
        const response = await getCurrentUser(currentUserId); 
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
          console.log("Response from getCurrentUser:", response);
          const data = await response.json();
          setUser(data.username);
          console.log("Current user:", data.username);
        
      } catch {}
    };
    fetchUser();
  }, []);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setIsWide(img.naturalWidth > img.naturalHeight);
  };

  const handleStartChat = () => {
          const navigate_to_firstChat = async (data2: { user_id: any; character_id: any }) => {
          const first_id = await get_first_chat(data2);
          console.log("First chat ID:", first_id.chat_id);
          navigate(`/chat/${id}`, {
          state: { chatId: first_id.chat_id }
        }); // Get to the first chat with the character
        }
        const character_id=id;
        const user_id=localStorage.getItem('user'); 
        const data2={ user_id, character_id };
        console.log("Data to send:", data2);
        navigate_to_firstChat(data2);
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
            <Button
              onClick={handleStartChat}
              gradient
            >
              Start Chat
            </Button>
            {isCreator && (
              <Button
                onClick={handleEditCharacter}
                glassEffect
              >
                Edit Character
              </Button>
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
                      onClick={() => navigate(`/chats/${chat.id}`)}
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