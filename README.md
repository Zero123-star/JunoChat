Project created by:
1. Luparu Ioan-Teodor
2. Moise Irina
3. Corobana Ingrid-Adriana @dirgnic
4. Prizlopan Iustin-George
5. Sescu Matei

Prezentarea:
https://docs.google.com/presentation/d/1qzRUgrHuKpphR5YxCUE4La8j73GP5ahMA_CF7nhCJzc/edit#slide=id.g354cb1e781f_0_437

Rec API AI: https://drive.google.com/file/d/1XlF04LryojUbVU0notUkpyfi0siDVWfz/view?usp=sharing

Backlog (User Stories): 
https://junochat.atlassian.net/jira/software/projects/SCRUM/boards/1/timeline

Diagrame: uml.svg, uml2.png
![uml2](https://github.com/user-attachments/assets/8e61f2d3-af93-45d0-a947-32f225f8a721)
Source Control: Git

Teste Automate: 

-> Backend: backend/api

Three .py files that contain testing methods for creating, handling or retrieving Chats (tests_chats.py), Messages (tests_messages.py) and Users (tests_users.py).
-> Fronted: JunoChat-frontend/src/test, JunoChat-frontend/src/pages/__tests__, JunoChat-frontend/src/components/__tests__

React component testing - Vitest + React Testing Library testing UI interactions, navigation, form handling, API calls, authentication states, and error scenarios with comprehensive mocking.

Raportare bug si rezolvare cu pull request:

<img width="892" alt="Screenshot 2025-06-13 at 12 32 26" src="https://github.com/user-attachments/assets/5b509902-aa13-47c1-87f4-7e37f5877c92" />

Comentarii Cod: 

frontend/src/pages/CharacterCard

```
import React, { useState } from 'react';
import { Character } from '@/types/character';
import { Button } from '@/components/Button';
import { MessageCircle, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { get_first_chat } from '@/api';

interface CharacterCardProps {
  character: Character;
  onSelect?: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    // navigate to character detail page
    navigate(`/character/${character.id}`);
  };

  const handleNavigateToChat = (event: React.MouseEvent) => {
    event.stopPropagation();

    const userId = localStorage.getItem('user');
    if (!userId) {
      // fallback if user is not logged in
      navigate(`/chat/${character.id}`);
      return;
    }

    const data = {
      user_id: userId,
      character_id: character.id
    };

    const navigate_to_firstChat = async (data2: { user_id: any; character_id: any }) => {
      const first_id = await get_first_chat(data2);
      navigate(`/chat/${character.id}`, {
        state: { chatId: first_id.chat_id }
      });
    };

    navigate_to_firstChat(data);
  };
  
  return (
    <motion.div
      className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />

      {/* top-right icon bubble */}
      <div
        className="absolute top-3 right-3 z-20 bg-white/20 backdrop-blur-md p-1.5 rounded-full"
        style={{
          backgroundColor: `${character.color || 'rgba(99, 102, 241, 0.2)'}`
        }}
      >
        <Star className="h-4 w-4 text-white" fill="white" />
      </div>

      {/* avatar image with hover zoom */}
      <div className="h-72 overflow-hidden">
        <img
          src={character.avatar}
          alt={character.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 blur-[1px]' : 'scale-100'}`}
        />
      </div>

      {/* bottom content with name, description, and button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white mb-1 flex items-center">
          {character.name}
          {isHovered && (
            <Sparkles className="ml-2 h-4 w-4 text-yellow-300" data-testid="sparkles-icon" />
          )}
        </h3>

        <p className={`text-white/80 text-sm mb-4 line-clamp-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
          {character.description}
        </p>

        <Button
          onClick={handleNavigateToChat}
          gradient
          className="w-full flex items-center justify-center"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          start chatting
        </Button>
      </div>
    </motion.div>
  );
};

export default CharacterCard;

```


Documentare folosire AI + prompt engineering: 
https://docs.google.com/document/d/1JgHTK_ybPZP2erUVWUId70tVgmbGioUs8RNFP7gHFc0/edit?usp=sharing
