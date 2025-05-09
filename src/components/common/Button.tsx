import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  withArrow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  withArrow = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center text-center uppercase tracking-wider font-medium transition-all duration-300 focus:outline-none';

  const variantStyles = {
    primary: 'bg-gold hover:bg-gold-600 text-navy-900 hover:text-navy-800',
    secondary: 'bg-navy-600 hover:bg-navy-500 text-white border border-gold/20 hover:border-gold/50',
    outline: 'bg-transparent hover:bg-navy-700/50 text-gold hover:text-gold-300 border border-gold/30 hover:border-gold/70',
    ghost: 'bg-transparent hover:bg-navy-700/30 text-neutral-200 hover:text-white',
    text: 'text-gold text-xs uppercase tracking-wider flex items-center hover:text-gold-300',
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
      className={`${baseStyles} ${variantStyles[variant]} ${variant !== 'text' ? sizeStyles[size] : ''} ${disabledStyles} ${widthStyles} ${className}`}
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
      
      {/* Arrow or icon on right position */}
      {withArrow && <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5" />}
      {icon && iconPosition === 'right' && !withArrow && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;
