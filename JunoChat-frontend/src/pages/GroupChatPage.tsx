
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getGroupChatMessages, storeGroupChatMessage, sendGroupChatMessage } from '@/api';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Users, ArrowLeft } from 'lucide-react';
import { Character } from '@/types/character';

interface Message {
  id?: number | string; // Unique message ID from API or generated locally
  role: 'user' | 'assistant';
  content: string;
  sender_name?: string;
  sender_username?: string;
  sender_id?: string;
  sender_user?: number | string;
  sender_bot?: number | string;
  sender_type?: 'user' | 'bot';
  sender_user_profile?: { id: number | string; username: string; profile_picture?: string };
  sender_bot_avatar?: { id: number | string; name: string; avatar?: string };
  timestamp?: string;
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
  const errorShownRef = useRef<Set<string>>(new Set()); // Track shown errors to avoid duplicates

  // Get character data from navigation state
  const characterIds: string[] = location.state?.characterIds || [];
  const characters: Character[] = location.state?.characters || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to show error only once
  const showErrorOnce = (errorKey: string, errorMsg: string) => {
    if (!errorShownRef.current.has(errorKey)) {
      errorShownRef.current.add(errorKey);
      toast.error(errorMsg);
      // Clear the error from tracking after 5 seconds to allow showing again
      setTimeout(() => {
        errorShownRef.current.delete(errorKey);
      }, 5000);
    }
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
        const msgs = response.messages || [];
        
        // Map API response to Message interface with proper typing
        const mappedMessages: Message[] = msgs.map((msg: any) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content || msg.description || '',
          sender_name: msg.sender_username,
          sender_username: msg.sender_username,
          sender_user: msg.sender_user,
          sender_bot: msg.sender_bot,
          sender_type: msg.sender_type,
          sender_user_profile: msg.sender_user_profile,
          sender_bot_avatar: msg.sender_bot_avatar,
          timestamp: msg.timestamp
        }));
        
        setMessages(mappedMessages);
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
      id: `user-${Date.now()}`, // Unique ID for local messages
      role: 'user', 
      content: input,
      sender_name: 'You',
      sender_type: 'user',
      sender_user: parseInt(userId),
      sender_user_profile: {
        id: parseInt(userId),
        username: localStorage.getItem('username') || 'You',
        profile_picture: localStorage.getItem('profile_picture') || undefined
      }
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
        showErrorOnce('store-user-msg', 'Failed to save your message');
      }
      
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
            showErrorOnce(`invalid-response-${character.id}`, `${character.name} returned an invalid response`);
            failCount++;
            continue;
          }
          
          let botReply = response.choices[0].message.content;
          
          // Check if backend parsed multiple messages
          let parsedMessages: Array<{sender: string; content: string}> = [];
          if (response.parsed_messages && response.parsed_messages.length > 0) {
            parsedMessages = response.parsed_messages;
            console.log(`Backend detected ${parsedMessages.length} messages:`, parsedMessages);
          }
          
          // If we have parsed messages, create separate Message objects for each
          if (parsedMessages.length > 0) {
            for (const parsedMsg of parsedMessages) {
              const senderName = parsedMsg.sender.trim();
              const msgContent = parsedMsg.content.trim();
              
              if (!msgContent) continue; // Skip empty messages
              
              // Find the character that matches this sender name
              const senderChar = characters.find(c => c.name.toLowerCase() === senderName.toLowerCase());
              
              if (senderChar) {
                const botMessage: Message = {
                  id: `bot-${senderChar.id}-${Date.now()}-${Math.random()}`,
                  role: 'assistant',
                  content: msgContent,
                  sender_name: senderChar.name,
                  sender_id: senderChar.id,
                  sender_bot: senderChar.id,
                  sender_type: 'bot',
                  sender_bot_avatar: {
                    id: senderChar.id,
                    name: senderChar.name,
                    avatar: senderChar.avatar
                  }
                };
                
                await storeGroupChatMessage(groupChatId, {
                  role: 'assistant',
                  content: msgContent,
                  id: senderChar.id
                });
                
                setMessages(prev => [...prev, botMessage]);
                updatedMessages.push(botMessage);
              }
            }
            successCount++;
            continue;
          }
          
          // Fallback: if no parsed messages, treat entire response as single message from current character
          
          // Log raw response for debugging concatenation issues
          console.log(`Raw response from ${character.name}:`, {
            length: botReply?.length,
            preview: botReply?.substring(0, 200),
            hasMultipleNewlines: botReply?.split('\n\n').length > 1,
            fullContent: botReply
          });
          
          if (!botReply || botReply.trim() === '') {
            console.warn(`Empty reply from ${character.name}`);
            showErrorOnce(`empty-reply-${character.id}`, `${character.name} returned an empty message`);
            failCount++;
            continue;
          }
          
          // Clean up the reply - trim and normalize whitespace
          botReply = botReply.trim();
          
          const botMessage: Message = {
            id: `bot-${character.id}-${Date.now()}`, // Unique ID for bot messages
            role: 'assistant',
            content: botReply,
            sender_name: character.name,
            sender_id: character.id,
            sender_bot: character.id,
            sender_type: 'bot',
            sender_bot_avatar: {
              id: character.id,
              name: character.name,
              avatar: character.avatar
            }
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
          
          showErrorOnce(`response-error-${character.id}`, `Failed to get reply from ${character.name}: ${errorMsg}`);
          failCount++;
        }
      }
      
      if (successCount === 0 && failCount > 0) {
        showErrorOnce('no-responses', 'No characters could respond. Check your OpenRouter API key in API Config.');
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
                  messages.map((message, index) => {
                    // Use message ID if available, otherwise use index
                    const messageKey = (message.id !== undefined && message.id !== null) ? String(message.id) : `local-${index}`;
                    
                    // Determine sender_type with fallback inference
                    let senderType = message.sender_type;
                    if (!senderType) {
                      senderType = message.sender_bot !== undefined ? 'bot' : (message.sender_user !== undefined ? 'user' : undefined);
                    }
                    const isBot = senderType === 'bot';
                    
                    return (
                    <div
                      key={messageKey}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start group`}
                    >
                      {/* Bot Avatar - Only show if sender_type is 'bot' */}
                      {isBot && message.sender_bot && (
                        <div className="mr-2 flex-shrink-0">
                          {(() => {
                            // Use the full bot avatar data from the message
                            const avatarUrl = message.sender_bot_avatar?.avatar;
                        const name = message.sender_bot_avatar?.name || message.sender_name || 'Bot';
                        
                        return avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={name}
                            className="h-8 w-8 rounded-full object-cover"
                            title={name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-300" />
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex flex-col max-w-xs">
                    {/* Sender Name - Use explicit sender data with fallback inference */}
                    {(() => {
                      // Determine sender_type: use explicit field, or infer from available data
                      let senderType = message.sender_type;
                      if (!senderType) {
                        // Infer from available data - if sender_bot exists, it's a bot message
                        senderType = message.sender_bot ? 'bot' : (message.sender_user ? 'user' : undefined);
                      }
                      
                      // Get the correct name based on sender_type
                      let senderName: string | undefined;
                      if (senderType === 'bot') {
                        senderName = message.sender_bot_avatar?.name;
                      } else if (senderType === 'user') {
                        senderName = message.sender_user_profile?.username;
                      }
                      
                      return senderName ? (
                        <span className={`text-xs mb-1 ${message.role === 'user' ? 'text-right text-purple-600' : 'text-left text-gray-600'}`}>
                          {senderName}
                        </span>
                      ) : null;
                    })()}

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

                  {/* User Avatar - Only show if sender_type is 'user' */}
                  {!isBot && message.sender_user && message.sender_user_profile?.profile_picture && (
                    <div className="ml-2 flex-shrink-0">
                      <img
                        src={message.sender_user_profile.profile_picture}
                        alt={message.sender_user_profile.username}
                        className="h-8 w-8 rounded-full object-cover"
                        title={message.sender_user_profile.username}
                      />
                    </div>
                  )}
                </div>
                  );
                  })
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
