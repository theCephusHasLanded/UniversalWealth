import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
}) => {
  const baseStyles = 'p-5 transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-navy-800 border border-navy-700',
    elevated: 'bg-navy-800 border border-navy-700 shadow-lg',
    bordered: 'bg-navy-800 border-2 border-gold/30',
    glass: 'bg-navy-800/80 backdrop-blur-sm border border-navy-700',
  };
  
  const hoverStyles = hover ? 'hover:border-gold/50 transform hover:-translate-y-1 hover:shadow-lg' : '';
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
