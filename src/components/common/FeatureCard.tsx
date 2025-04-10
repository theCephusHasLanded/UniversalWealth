import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color = '#C9A861',
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`group bg-navy-600 hover:bg-navy-500 border border-navy-400 p-6 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {icon && (
        <div 
          className="w-10 h-10 flex items-center justify-center mb-4 border"
          style={{ borderColor: color }}
        >
          {icon}
        </div>
      )}
      
      {!icon && (
        <div 
          className="h-1 w-10 mb-6 transition-all duration-300 group-hover:w-16"
          style={{ backgroundColor: color }}
        />
      )}
      
      <h3 className="text-base uppercase tracking-widest mb-3 font-medium text-neutral-100">{title}</h3>
      <p className="text-sm text-neutral-300 mb-4 leading-relaxed">{description}</p>
      
      {onClick && (
        <div className="mt-auto pt-2">
          <span className="text-xs uppercase tracking-widest flex items-center group-hover:text-gold transition-colors">
            Learn More <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;