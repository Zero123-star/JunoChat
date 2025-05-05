import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { openrouter_chat } from '@/api';
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Character {
  characterId: number;
  name: string;
  description: string;

}

const ChatPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>(); // Obține ID-ul personajului din URL
  const [character, setCharacter] = useState<Character | null>(null); // Starea pentru datele personajului
  const [messages, setMessages] = useState<Message[]>([]); // Starea pentru mesaje
  const [input, setInput] = useState(''); // Starea pentru input-ul utilizatorului
  const [loading, setLoading] = useState(true); // Starea pentru încărcare
  const [error, setError] = useState<string | null>(null); // Starea pentru erori
  useEffect(() => {
    if (messages.length > 0) {
      console.log('Last message:', messages[messages.length - 1]);
    }
  }, [messages]);
  
  
  // Obține datele personajului din API
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/api/characters/${characterId}/`); // API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch character data');
        }

        const data = await response.json();
        setCharacter(data); // Setează datele personajului
      } catch (error) {
        console.error('Eroare la obținerea datelor personajului:', error);
        setError('Failed to load character data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [characterId]);



  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message
    const auxiliary=messages;
    auxiliary.push({role: 'user', content: input });//We are using auxiliary, using a setter then sending messages leads to sync bugs
    //setMessages((prev) => [...prev, { role: 'user', content: input }]);
    console.log("Messages array is now:",auxiliary)
    //Get response
    try {
      console.log("Messages array before frontend api is now:",auxiliary)
      const response = await openrouter_chat(auxiliary,characterId);
      console.log("Messages after openrouter",auxiliary)
      const bot_reply = response.choices[0].message.content;
      auxiliary.push({ role: 'assistant', content: bot_reply });
      setMessages(auxiliary);
      } catch (error) {
        console.error("Error fetching response:", error);
        // Handle the error appropriately
      }
    setInput(''); // Reset input
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex flex-col">
      {/* Header cu informațiile personajului */}
      <header className="bg-purple-500 text-white p-4 flex items-center space-x-4">
        <img
          alt={character.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <h1 className="text-xl font-bold">{character.name}</h1>
      </header>

      {/* Zona de mesaje */}
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`${message.role === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                  } px-4 py-2 rounded-lg max-w-xs`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input pentru mesaje */}
      <footer className="bg-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;