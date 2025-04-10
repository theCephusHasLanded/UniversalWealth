import React from 'react';

interface ExclusiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const ExclusiveButton: React.FC<ExclusiveButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center text-center uppercase tracking-wider font-medium transition-all duration-300 focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-gold hover:bg-gold-600 text-navy-900 hover:text-navy-800',
    secondary: 'bg-navy-600 hover:bg-navy-500 text-white border border-gold/20 hover:border-gold/50',
    outline: 'bg-transparent hover:bg-navy-700/50 text-gold hover:text-gold-300 border border-gold/30 hover:border-gold/70',
    ghost: 'bg-transparent hover:bg-navy-700/30 text-neutral-200 hover:text-white',
  };
  
  const sizeStyles = {
    sm: 'text-xs py-2 px-4',
    md: 'text-xs py-3 px-6',
    lg: 'text-sm py-4 px-8',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Gold line at bottom for primary variant */}
      {variant === 'primary' && (
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-700 group-hover:w-full transition-all duration-500 ease-out" />
      )}
      
      {/* Icon on left position */}
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* Button text */}
      <span>{children}</span>
      
      {/* Icon on right position */}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default ExclusiveButton;