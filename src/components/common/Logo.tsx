import React from 'react';
import { Link } from 'react-router-dom';
import EyeLogo from './EyeLogo';
import { useTranslation } from '../../contexts/TranslationContext';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gold' | 'light' | 'dark';
  showText?: boolean;
  animated?: boolean;
  className?: string;
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  animated = true,
  className = '',
  linkTo = '/',
}) => {
  const { t } = useTranslation();
  
  // Map size to dimensions
  const sizesMap = {
    xs: {
      container: 'h-7 w-7',
      logo: 24,
      text: 'text-xs',
    },
    sm: {
      container: 'h-9 w-9',
      logo: 32,
      text: 'text-sm',
    },
    md: {
      container: 'h-12 w-12',
      logo: 40,
      text: 'text-base',
    },
    lg: {
      container: 'h-16 w-16',
      logo: 56,
      text: 'text-lg',
    },
  };
  
  const currentSize = sizesMap[size];
  
  const LogoContent = (
    <div className={`flex items-center ${className}`}>
      <div className={`${currentSize.container} mr-3 bg-navy-800 border border-gold/30 rounded-full flex items-center justify-center overflow-hidden shadow-sm`}>
        <EyeLogo size={currentSize.logo} variant={variant} animated={animated} />
      </div>
      {showText && (
        <h1 className={`${currentSize.text} font-normal tracking-widest uppercase text-white`}>
          {t('app.name')}
        </h1>
      )}
    </div>
  );
  
  // If linkTo is null, don't wrap in Link
  if (linkTo === null) {
    return LogoContent;
  }
  
  return (
    <Link to={linkTo} className="flex items-center hover:opacity-80 transition-opacity">
      {LogoContent}
    </Link>
  );
};

export default Logo;