import React, { useEffect, useState } from 'react';

interface Reaction {
  text: string;
  imageUrl?: string;
}

interface ChatReactionsPanelProps {
  characterName: string;
  lastUserMessage: string;
}

// This is a mock async function. Replace with real GPT API/web scraping as needed.
async function fetchReactions(characterName: string, userMessage: string): Promise<Reaction[]> {
  // Simulate a call to a free GPT API or web scraping for demo
  // In production, replace with a real API call
  return [
    {
      text: `"${characterName}" might react: Wow, that's interesting! 😲`,
      imageUrl: 'https://source.unsplash.com/featured/?surprised,anime',
    },
    {
      text: `"${characterName}" might react: Haha, that's funny! 😂`,
      imageUrl: 'https://source.unsplash.com/featured/?laugh,anime',
    },
    {
      text: `"${characterName}" might react: I'm here for you. 🤗`,
      imageUrl: 'https://source.unsplash.com/featured/?hug,anime',
    },
  ];
}

const ChatReactionsPanel: React.FC<ChatReactionsPanelProps> = ({ characterName, lastUserMessage }) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!characterName || !lastUserMessage) return;
    setLoading(true);
    fetchReactions(characterName, lastUserMessage).then((data) => {
      setReactions(data);
      setLoading(false);
    });
  }, [characterName, lastUserMessage]);

  return (
    <div className="w-full max-w-xs bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-lg border border-pink-100 p-4 mt-4">
      <h3 className="text-lg font-bold text-purple-700 mb-2">AI Reactions</h3>
      {loading ? (
        <p className="text-purple-400">Loading reactions...</p>
      ) : (
        <div className="space-y-3">
          {reactions.map((reaction, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {reaction.imageUrl && (
                <img src={reaction.imageUrl} alt="reaction" className="w-12 h-12 rounded-lg object-cover border border-purple-200" />
              )}
              <span className="text-sm text-purple-700">{reaction.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatReactionsPanel;
