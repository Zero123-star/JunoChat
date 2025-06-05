import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getChatHistory} from '@/api'; 
import { Button } from '@/components/ui/uiButton';
import { MessageCircle } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  last_message: string;
  character_name?: string;
  character_id?: string;
}

const ChatsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const user = localStorage.getItem('user');
        const response = await getChatHistory(user); // Returns json containing list of all chats
        console.log("Chats history response:", response.chats);
        setChats(response.chats || []);
      } catch {
        setError('Failed to load chat history.');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const handleContinueChat = (chat: Chat) => {
    if (chat.character_id) {
      navigate(`/chat/${chat.character_id}`, {
        state: { chatId: chat.id }
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Your Chats History</h1>
      {chats.length === 0 ? (
        <p className="text-gray-500">No chats found.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map(chat => (
            <li key={chat.id} className="bg-white rounded-lg shadow p-4">
              <div className="font-semibold">{chat.title}</div>
              {chat.character_name && (
                <div className="text-sm text-gray-500 mb-1">Character: {chat.character_name}</div>
              )}
              <div className="text-gray-700 truncate mb-3">{chat.last_message}</div>
              <Button
                onClick={() => handleContinueChat(chat)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Continue Chat
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsHistoryPage;