import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { fetchCharacter, syncCharacterToAIApp, fetchCharacters } from '@/api';
import { fetchBotReplyOpenRouter } from '@/api.bot';
import { Character } from '@/types/character';
import ChatReactionsPanel from '@/components/ChatReactionsPanel';
import axios from 'axios';
import { Input } from '@/components/ui/input';

interface Message {
  sender: 'user' | 'character';
  text: string;
}

const ChatPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>(); // Obține ID-ul personajului din URL
  const [character, setCharacter] = useState<Character | null>(null); // Starea pentru datele personajului
  const [messages, setMessages] = useState<Message[]>([]); // Starea pentru mesaje
  const [input, setInput] = useState(''); // Starea pentru input-ul utilizatorului
  const [loading, setLoading] = useState(true); // Starea pentru încărcare
  const [error, setError] = useState<string | null>(null); // Starea pentru erori
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  console.log('Character ID:', characterId);

  // Obține datele personajului din API
  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      setError(null);
      try {
        let characterData: Character | null = null;
        if (characterId) {
          characterData = await fetchCharacter(characterId);
        }
        if (!characterData) {
          setCharacter({
            id: characterId || 'unknown',
            name: 'Unknown Character',
            description: 'This is a fallback mock character.',
            tags: 'mock',
            color: '#cccccc',
            creator: 'guest',
            avatar: '',
            public: true,
          });
        } else {
          setCharacter(characterData);
        }
      } catch (error) {
        setCharacter({
          id: characterId || 'unknown',
          name: 'Unknown Character',
          description: 'This is a fallback mock character.',
          tags: 'mock',
          color: '#cccccc',
          creator: 'guest',
          avatar: '',
          public: true,
        });
      } finally {
        setLoading(false);
      }
    };
    loadCharacter();
  }, [characterId]);

  // On ChatPage mount, ensure character exists in backend
  useEffect(() => {
    const syncCharacter = async () => {
      if (characterId) {
        // Try to fetch persona from backend
        try {
          await axios.get(`http://localhost:8000/persona/${encodeURIComponent(characterId)}`);
        } catch (e: any) {
          // If not found (404), create it
          if (e?.response?.status === 404) {
            // Find local character data using fetchCharacter
            const localChar = await fetchCharacter(characterId);
            if (localChar) {
              await syncCharacterToAIApp(localChar);
            }
          }
        }
      }
    };
    syncCharacter();
  }, [characterId]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    const userMessage = input;
    setInput('');

    if (character) {
      // Always sync character to AI app before sending message
      await syncCharacterToAIApp(character);
      const history = [
        ...messages.map((m) => ({ sender: m.sender, text: m.text })),
        { sender: 'user', text: userMessage },
      ];
      try {
        const res = await fetchBotReplyOpenRouter({
          character: character.id,
          bot_description: character.description,
          history,
          user_prompt: userMessage,
          model_key: 'hermes', // Use the correct model key for your backend
        });
        setMessages((prev) => [
          ...prev,
          { sender: 'character', text: res.bot_reply || '...' },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { sender: 'character', text: 'Sorry, I could not get a response from the AI backend.' },
        ]);
      }
    }
  };

  // Edit message
  const handleEdit = (index: number, text: string) => {
    setEditingIndex(index);
    setEditValue(text);
  };
  const handleEditSave = (index: number) => {
    setMessages((prev) => prev.map((msg, i) => i === index ? { ...msg, text: editValue } : msg));
    setEditingIndex(null);
    setEditValue('');
  };
  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  // Delete message
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Reroll response (for character messages)
  const handleReroll = async (index: number) => {
    if (!character) return;
    // Always sync character to AI app before reroll
    await syncCharacterToAIApp(character);
    let userIdx = index;
    while (userIdx >= 0 && messages[userIdx].sender !== 'user') userIdx--;
    if (userIdx < 0) return;
    const userMessage = messages[userIdx].text;
    const history = messages.slice(0, userIdx + 1).map((m) => ({ sender: m.sender, text: m.text }));
    try {
      const res = await fetchBotReplyOpenRouter({
        character: character.id,
        bot_description: character.description,
        history,
        user_prompt: userMessage,
        model_key: 'hermes', // Use the correct model key for your backend
      });
      setMessages((prev) => [
        ...prev.slice(0, index + 1),
        { sender: 'character', text: res.bot_reply || '...' },
        ...prev.slice(index + 1)
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev.slice(0, index + 1),
        { sender: 'character', text: 'Sorry, I could not get a response from the AI backend.' },
        ...prev.slice(index + 1)
      ]);
    }
  };

  // Delete chat (all messages)
  const handleDeleteChat = () => {
    if (window.confirm('Are you sure you want to delete this entire chat?')) {
      setMessages([]);
    }
  };

  // Helper: get color class based on message emotion
  function getEmotionColorClass(text: string) {
    if (/happy|joy|excited|cheerful|optimist|yay|great|awesome|love/i.test(text)) return 'bg-yellow-100 text-yellow-700';
    if (/sad|cry|lonely|depressed|blue|melancholy|unhappy/i.test(text)) return 'bg-blue-100 text-blue-700';
    if (/angry|mad|furious|rage|irritat|annoyed/i.test(text)) return 'bg-red-100 text-red-700';
    if (/love|romantic|heart|affection|sweet/i.test(text)) return 'bg-pink-100 text-pink-700';
    if (/scared|afraid|fear|anxious|nervous|worried/i.test(text)) return 'bg-purple-100 text-purple-700';
    if (/surprise|shocked|amazed|wow|unexpected/i.test(text)) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-800';
  }

  // Find the last user message
  const lastUserMessage = messages.length > 0
    ? [...messages].reverse().find((msg) => msg.sender === 'user')?.text || ''
    : '';

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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-black dark:via-zinc-900 dark:to-gray-900 px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl border border-pink-100 flex flex-col items-center p-0">
        {/* Character Header Card */}
        <div className="w-full flex flex-col items-center p-8 border-b border-pink-100">
          {character.avatar && (
            <img
              src={character.avatar}
              alt={character.name}
              className="h-20 w-20 rounded-full object-cover mb-3 border-4 border-purple-200 shadow-md"
            />
          )}
          <h1 className="text-2xl font-bold text-purple-700 mb-1">{character.name}</h1>
          <p className="text-purple-500 text-sm mb-2 text-center">{character.description}</p>
          <button
            onClick={handleDeleteChat}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
          >
            Delete Chat
          </button>
        </div>
        {/* Chat Messages */}
        <main className="flex-1 w-full p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-center group`}
              >
                {editingIndex === index ? (
                  <div className="flex gap-2 w-full">
                    <input
                      className="flex-grow px-2 py-1 border rounded"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button onClick={() => handleEditSave(index)} className="text-green-600">Save</button>
                    <button onClick={handleEditCancel} className="text-gray-500">Cancel</button>
                  </div>
                ) : (
                  <>
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs shadow ${getEmotionColorClass(message.text)}`}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <>
                        <button onClick={() => handleEdit(index, message.text)} className="ml-2 text-blue-500 hover:text-blue-700"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(index)} className="ml-1 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </>
                    )}
                    {message.sender === 'character' && (
                      <button onClick={() => handleReroll(index)} className="ml-2 text-purple-500 hover:text-purple-700"><RefreshCw size={16} /></button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Chat Reactions Panel - show only if there is a last user message */}
          {character && lastUserMessage && (
            <div className="flex justify-center mt-6">
              <ChatReactionsPanel characterName={character.name} lastUserMessage={lastUserMessage} />
            </div>
          )}
        </main>
        {/* Chat Input */}
        <footer className="w-full bg-gray-100 dark:bg-zinc-800 p-4 rounded-b-2xl">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-700 placeholder:text-purple-300"
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
    </div>
  );
};

export default ChatPage;