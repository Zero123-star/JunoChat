import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import HeroSection from '@/components/HeroSection';
import CharacterGrid from '@/components/CharacterGrid';
import CharacterCarousel from '@/components/CharacterCarousel';
import GlassmorphicContainer from '@/components/GlassmorphicContainer';
import { Button } from '@/components/Button';
import { fetchCharacters } from '../api';
import { Character } from '@/types/character';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      const getCharacters = async () => {
        try {
          const data = await fetchCharacters();
          setCharacters(data);
          console.log('Personaje:', data);
        } catch (error) {
          console.error('Eroare la obținerea personajelor:', error);
          toast.error('Nu am putut încărca personajele. Încearcă din nou!');
        } finally {
          setLoading(false);
        }
      };
  
      getCharacters();
    }, []);





  const handleSelectCharacter = (character: Character) => {
    toast.success(`Starting chat with ${character.name}`);
    console.log("Selected character:", character);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading characters...</p>
        </div>
      ) : (
        <>
          <HeroSection />

          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 animate-on-scroll">
                <div className="subtitle-badge bg-purple-100 text-purple-600 mb-6">
                  FEATURED CHARACTERS
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight text-balance">
                  Meet Our Exceptional AI Companions
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                  Engage with our most popular AI personalities, each with unique knowledge and conversation styles.
                </p>
              </div>

              <div className="animate-on-scroll">
                <CharacterCarousel
                  characters={characters}
                  onSelect={handleSelectCharacter}
                />
              </div>
            </div>
          </section>

          <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 animate-on-scroll">
                <div className="subtitle-badge bg-indigo-100 text-indigo-600 mb-6">
                  DISCOVER AI CHARACTERS
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight text-balance">
                  Start Conversations That Feel Human
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                  Our AI characters combine personality with knowledge to deliver meaningful interactions.
                  Choose a character that resonates with you and start chatting now.
                </p>
              </div>

              <CharacterGrid
                characters={characters}
                onSelectCharacter={handleSelectCharacter}
              />

              <div className="mt-12 text-center animate-on-scroll">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8"
                  onClick={() => navigate('/characters')}
                >
                  Explore All Characters
                </Button>
              </div>
            </div>
          </section>

          <section className="py-24 px-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="max-w-5xl mx-auto">
              <GlassmorphicContainer className="p-12 text-center animate-on-scroll">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight text-balance">
                  Ready to Experience the Future of AI Conversation?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
                  Join thousands of users already engaging with our AI characters. Create an account and unlock the full experience.
                </p>
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-medium shadow-subtle hover:shadow-subtle-lg transition-all"
                  onClick={() => navigate('/login')}
                >
                  Get Started Free
                </Button>
              </GlassmorphicContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
