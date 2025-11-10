import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getChatHistory} from '@/api'; 
import { Button } from '@/components/Button';
import { MessageCircle } from 'lucide-react';
import { getGroupChats } from '@/api';
import { Users } from 'lucide-react';
interface Chat {
  id: string;
  title: string;
  last_message: string;
  character_name?: string;
  character_id?: string;
}
interface GroupChat {
  id: string;
  title: string;
  last_message: string;
  character_names: string[];
  character_ids: string[];
}

const ChatsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch group chats:
useEffect(() => {
  const fetchGroupChats = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return; // Ensure user is logged in
      const response = await getGroupChats(user);
      console.log("Group chats response:", response.group_chats);
      setGroupChats(response.group_chats || []);
    } catch (error) {
      console.error('Error fetching group chats:', error);
    }
  };
  fetchGroupChats();
}, []);

//  handle group chat navigation:
const handleContinueGroupChat = (groupChat: GroupChat) => {
  navigate(`/group-chat/${groupChat.id}`, {
    state: {
      characterIds: groupChat.character_ids,
      characters: groupChat.character_ids.map((id, idx) => ({
        id,
        name: groupChat.character_names[idx],
      }))
    }
  });
};
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


{groupChats.length > 0 && (
  console.log("Rendering group chats:", groupChats),
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Users className="h-6 w-6 text-purple-600" />
      Group Chats
    </h2>
    <ul className="space-y-4">
      {groupChats.map(groupChat => (
        <li key={groupChat.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-600" />
            <div className="font-semibold text-purple-800">{groupChat.title}</div>
          </div>
          <div className="text-sm text-purple-600 mb-1">
            Participants: {groupChat.character_names.join(', ')}
          </div>
          <div className="text-gray-700 truncate mb-3">{groupChat.last_message}</div>
          <Button
            onClick={() => handleContinueGroupChat(groupChat)}
            gradient
            className="w-full flex items-center justify-center"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Continue Group Chat
          </Button>
        </li>
      ))}
    </ul>
  </div>
)}

{/* Regular Chats Section */}
<h2 className="text-xl font-bold mb-4">Individual Chats</h2>
  return (<div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Your Chats History</h1>

      {/* Group Chats Section */}
      {groupChats.length > 0 && (
        <div className="mb-8">
          {/* Optional: console.log("Rendering group chats:", groupChats); */}
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Group Chats
          </h2>
          <ul className="space-y-4">
            {groupChats.map(groupChat => (
              <li key={groupChat.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div className="font-semibold text-purple-800">{groupChat.title}</div>
                </div>
                <div className="text-sm text-purple-600 mb-1">
                  Participants: {groupChat.character_names.join(', ')}
                </div>
                <div className="text-gray-700 truncate mb-3">{groupChat.last_message}</div>
                <Button
                  onClick={() => handleContinueGroupChat(groupChat)}
                  gradient
                  className="w-full flex items-center justify-center"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Continue Group Chat
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Individual Chats Section */}
      <h2 className="text-xl font-bold mb-4">Individual Chats</h2>
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
                gradient
                className="w-full flex items-center justify-center"
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