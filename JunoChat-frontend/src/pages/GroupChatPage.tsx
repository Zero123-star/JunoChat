
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getGroupChatMessages, storeGroupChatMessage, sendGroupChatMessage } from '@/api';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Users, ArrowLeft } from 'lucide-react';
import { Character } from '@/types/character';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sender_name?: string;
  sender_id?: string;
}

const GroupChatPage: React.FC = () => {
  const { groupChatId } = useParams<{ groupChatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get character data from navigation state
  const characterIds: string[] = location.state?.characterIds || [];
  const characters: Character[] = location.state?.characters || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!groupChatId) return;
      
      try {
        setLoading(true);
        const response = await getGroupChatMessages(groupChatId);
        setMessages(response.messages || []);
      } catch (error) {
        console.error('Error loading group chat messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [groupChatId]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || !groupChatId) return;

    const userId = localStorage.getItem('user');
    if (!userId) {
      navigate('/login');
      return;
    }

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      sender_name: 'You'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      // Store user message
      try {
        await storeGroupChatMessage(groupChatId, {
          role: 'user',
          content: input,
          id: userId
        });
      } catch (storeError) {
        console.error('Failed to store user message:', storeError);
        toast.error('Failed to save your message');
      }
      console.log("hey")
      // Get responses from each bot
      const updatedMessages = [...messages, userMessage];
      let successCount = 0;
      let failCount = 0;
      
      for (const character of characters) {
        try {
          const response = await sendGroupChatMessage(
            character.id,
            updatedMessages,
            characterIds
          );
          console.log("response", response);
          
          // Check if response has the expected structure
          if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
            console.error(`Invalid response format from ${character.name}:`, response);
            toast.error(`${character.name} returned an invalid response`);
            failCount++;
            continue;
          }
          
          const botReply = response.choices[0].message.content;
          if (!botReply || botReply.trim() === '') {
            console.warn(`Empty reply from ${character.name}`);
            toast.warning(`${character.name} returned an empty message`);
            failCount++;
            continue;
          }
          
          const botMessage: Message = {
            role: 'assistant',
            content: botReply,
            sender_name: character.name,
            sender_id: character.id
          };

          // Store bot message
          await storeGroupChatMessage(groupChatId, {
            role: 'assistant',
            content: botReply,
            id: character.id
          });

          setMessages(prev => [...prev, botMessage]);
          updatedMessages.push(botMessage);
          successCount++;
        } catch (error) {
          console.error(`Error getting response from ${character.name}:`, error);
          let errorMsg = 'Unknown error';
          
          if (error instanceof Error) {
            errorMsg = error.message;
          } else if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as any;
            if (axiosError.response?.data?.error) {
              errorMsg = axiosError.response.data.error;
            } else if (axiosError.response?.status === 400) {
              errorMsg = 'Bad request - Check your OpenRouter API key in API Config';
            } else if (axiosError.response?.status === 401) {
              errorMsg = 'Unauthorized - Invalid OpenRouter API key';
            }
          }
          
          toast.error(`Failed to get reply from ${character.name}: ${errorMsg}`);
          failCount++;
        }
      }
      
      if (successCount === 0 && failCount > 0) {
        toast.error('No characters could respond. Check your OpenRouter API key in API Config.');
      } else if (failCount > 0) {
        toast.info(`${successCount} character(s) responded, ${failCount} failed`);
      }
    } catch (error) {
      console.error('Error in group chat:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading group chat...</p>
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No characters found for this group chat</p>
          <Button onClick={() => navigate('/create-group-chat')} gradient>
            Create New Group Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-purple-500 text-white p-4 flex items-center space-x-4 fixed top-12 sm:top-16 left-0 right-0 z-40">
        <button
          onClick={() => navigate('/chats')}
          className="hover:bg-purple-600 rounded-full p-2 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-3 flex-1">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Group Chat</h1>
            <p className="text-sm text-purple-200">
              {characters.map(c => c.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Character Avatars */}
        <div className="flex -space-x-2">
          {characters.slice(0, 3).map((character, idx) => (
            <img
              key={character.id}
              src={character.avatar}
              alt={character.name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              style={{ zIndex: characters.length - idx }}
              title={character.name}
            />
          ))}
          {characters.length > 3 && (
            <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-sm font-bold">
              +{characters.length - 3}
            </div>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-28 sm:pt-32 pb-16">
        <div className="max-w-5xl mx-auto w-full px-4">
          <div className="space-y-4 py-12">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start group`}
                >
                  {/* Bot Avatar */}
                  {message.role === 'assistant' && (
                    <div className="mr-2 flex-shrink-0">
                      {(() => {
                        const character = characters.find(c => c.id === message.sender_id);
                        return character ? (
                          <img
                            src={character.avatar}
                            alt={character.name}
                            className="h-8 w-8 rounded-full object-cover"
                            title={character.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-300" />
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex flex-col max-w-xs">
                    {/* Sender Name */}
                    {message.sender_name && (
                      <span className={`text-xs mb-1 ${message.role === 'user' ? 'text-right text-purple-600' : 'text-left text-gray-600'}`}>
                        {message.sender_name}
                      </span>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`${
                        message.role === 'user'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      } px-4 py-2 rounded-lg break-words overflow-wrap-anywhere`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                Start the conversation! Say hello to everyone 👋
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Field */}
      <footer className="bg-gray-100 p-4 fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !sending) {
                handleSendMessage();
              }
            }}
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sending || !input.trim()}
            gradient
            className="px-4 py-2"
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default GroupChatPage;
