import React from 'react';
import { Button } from '@/components/Button';
import GlassmorphicContainer from '@/components/GlassmorphicContainer';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
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
        
        <div className="mt-24 w-full overflow-hidden">

        </div>
      </div>
    </section>
  );
};

export default HeroSection;