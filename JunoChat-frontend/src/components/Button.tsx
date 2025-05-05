import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton, ButtonProps } from '@/components/ui/uiButton';

interface CustomButtonProps extends ButtonProps {
  glassEffect?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, glassEffect = false, variant = "default", ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(
          "font-medium transition-all",
          glassEffect && "backdrop-blur-sm bg-white/60 border border-white/20 hover:bg-white/80",
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
