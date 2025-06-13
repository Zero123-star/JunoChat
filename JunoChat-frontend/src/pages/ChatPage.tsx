import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { openrouter_chat,getChatMessages, storeMessage} from '@/api';
import { Button } from '@/components/Button';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
interface Character {
  characterId: number;
  name: string;
  description: string;
  avatar?: string; // Optional avatar property
}

const ChatPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>(); 
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characterLoading, setCharacterLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const location = useLocation();
  const chatId = location.state?.chatId;
  
  // Add ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log('Last message:', messages[messages.length - 1]);
    }
  }, [messages]);
  
  // Fetch character data
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/api/characters/${characterId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch character data');
        }

        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Eroare la obținerea datelor personajului:', error);
        setError('Failed to load character data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [characterId]);

  // Load all messages from the chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getChatMessages(chatId);
        console.log("Chat messages response:", response);
        const data = response.messages;
        setMessages(data || []);
      } catch (error) {
        console.error('Eroare la obținerea mesajelor:', error);
        setError('Failed to load chat messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const userId = localStorage.getItem('user');
      await storeMessage(chatId, { role: 'user', content: input, id: userId });
      
      const response = await openrouter_chat([...messages, userMessage], characterId);
      const botReply = response.choices[0].message.content;
      const botMessage: Message = { role: 'assistant', content: botReply };
      
      await storeMessage(chatId, { role: 'assistant', content: botReply, id: characterId });
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send message. Please try again.");
    }
    
    setInput('');
  };

  const handleEditMessage = (index: number) => {
    alert(`Edit message at index ${index}`);
  };

  const handleDeleteMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRerollMessage = async (index: number) => {
    alert(`Reroll assistant message at index ${index}`);
  };

  // Check if user is logged in
  const loggedInUser = localStorage.getItem('user');

  if (loggedInUser == null) {
    return ( 
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">You must be logged in to chat.</h2>
          <p>Please log in to start or continue a chat.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading character...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Character not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 min-h-screen flex flex-col">
      {/* Header with bot's name */}
      <header className="bg-purple-500 text-white p-4 flex items-center space-x-4 fixed top-12 sm:top-16 left-0 right-0 z-40">
        <img
          src={character?.avatar || 'https://via.placeholder.com/150'}
          alt={character?.name || 'Bot Avatar'}
          className="w-12 h-12 rounded-full object-cover"
        />
        <h1 className="text-xl font-bold">{character?.name}</h1>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pt-28 sm:pt-32 pb-16">
        <div className="max-w-5xl mx-auto w-full px-4">
          <div className="space-y-4 py-12">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-center group`}
                >
                  <div
                    className={`${message.role === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                    } px-4 py-2 rounded-lg max-w-xs relative break-words overflow-wrap-anywhere`}
                  >
                    {message.content}
                    <div className={`flex gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => handleEditMessage(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDeleteMessage(index)}
                      >
                        Delete
                      </Button>
                      {message.role === 'assistant' && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleRerollMessage(index)}
                        >
                          Reroll
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages yet.</p>
            )}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input field at the bottom */}
      <footer className="bg-gray-100 p-4 fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            gradient
            className="px-4 py-2"
          >
            Send
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;