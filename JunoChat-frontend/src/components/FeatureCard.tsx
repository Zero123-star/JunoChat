

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className,
  iconClassName,
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "group p-6 rounded-2xl transition-all duration-300 hover:shadow-subtle-lg bg-white border border-border",
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 bg-primary/10 text-primary",
        "group-hover:bg-primary group-hover:text-white",
        iconClassName
      )}>
        <Icon className="w-5 h-5" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;