import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton, ButtonProps } from '@/components/ui/uiButton';

interface CustomButtonProps extends ButtonProps {
  glassEffect?: boolean;
  gradient?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, glassEffect = false, gradient = false, variant = "default", ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(
          "font-medium transition-all cursor-pointer",
          glassEffect && "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300",
          gradient && "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200",
          className
        )}
        variant={variant}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
