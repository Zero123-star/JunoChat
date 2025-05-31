import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'light';
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassmorphicContainer = ({
  children,
  className,
  variant = 'default',
  intensity = 'medium',
}: GlassmorphicContainerProps) => {
  const intensityClasses = {
    low: 'bg-white/30 border-white/10 backdrop-blur-xs',
    medium: 'bg-white/50 border-white/20 backdrop-blur-md',
    high: 'bg-white/70 border-white/30 backdrop-blur-lg',
  };

  const variantClasses = {
    default: 'shadow-glass',
    dark: 'bg-black/10 border-white/10',
    light: 'bg-white/80 border-white/40',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all',
        intensityClasses[intensity],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GlassmorphicContainer;