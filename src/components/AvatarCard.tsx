import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassmorphicContainer } from './GlassmorphicContainer'; // Ensure this file exists in the same directory

interface AvatarCardProps {
  name: string;
  image: string;
  description: string;
  color?: string;
  className?: string;
}

export const AvatarCard = ({
  name,
  image,
  description,
  color = 'rgba(99, 102, 241, 0.8)',
  className,
}: AvatarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'group relative w-full max-w-sm h-[340px] overflow-hidden rounded-xl hover-scale',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--avatar-glow-color': color } as React.CSSProperties}
    >
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out overflow-hidden rounded-xl">
        <div 
          className={cn(
            "w-full h-full bg-cover bg-center transition-all duration-700 ease-out", 
            isHovered ? "scale-105 blur-[1px]" : "scale-100"
          )}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-5">
        <GlassmorphicContainer 
          className={cn(
            "p-5 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-95"
          )}
          variant="dark"
          intensity="low"
        >
          <h3 className="text-white font-medium text-xl mb-2">{name}</h3>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{description}</p>
          
          <div className={cn(
            "absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent transition-all duration-300",
            isHovered ? "opacity-0" : "opacity-100"
          )} />
        </GlassmorphicContainer>
      </div>
    </div>
  );
};

export default AvatarCard;