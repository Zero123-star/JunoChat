import React from 'react';
import { Button } from '@/components/Button';
import GlassmorphicContainer from '@/components/GlassmorphicContainer';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white" />
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-br from-blue-50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[70vw] h-[40vh] bg-gradient-to-tl from-indigo-50/50 to-transparent rounded-full filter blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto pt-20 pb-10 flex flex-col items-center">
        <div className="subtitle-badge bg-blue-100 text-blue-600 mb-6 animate-fade-in">
          WELCOME TO JUNO
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6 tracking-tight animate-fade-in text-balance">
          Talk to AI Characters <br className="hidden sm:block" />
          <span className="text-primary">That Feel Human</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mb-10 animate-fade-in animate-delay-100 text-balance">
          Start chatting with your favorite characters today! Engage with AI that has personality, knowledge, and can hold meaningful conversations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-200">
          <Button size="lg" className="px-8 py-6 text-base font-medium shadow-subtle hover:shadow-subtle-lg transition-all">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-base font-medium">
            Explore Characters
          </Button>
        </div>
        
        <div className="mt-24 w-full overflow-hidden">
          <GlassmorphicContainer className="p-3 sm:p-6 max-w-5xl mx-auto animate-scale-in animate-delay-300">
            <div className="relative w-full bg-zinc-900 rounded-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-7 bg-zinc-800 flex items-center px-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
                <div className="pt-7">
                <img 
                  src="\images\anime.jpeg" 
                  alt="AI Conversation Interface" 
                  className="w-full h-auto object-cover" 
                />
                <img 
                  src="\images\cartoons.jpg" 
                  alt="AI Conversation Interface" 
                  className="w-full h-auto object-cover" 
                />
                </div>
            </div>
          </GlassmorphicContainer>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;