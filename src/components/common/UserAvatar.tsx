import React from 'react';
import { User } from 'lucide-react';
import InteractiveAvatar from './InteractiveAvatar';
import { AvatarStyle } from '../../utils/avatars';

interface UserAvatarProps {
  userId: string;
  displayName: string;
  photoURL?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: AvatarStyle;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'gold' | 'light' | 'dark';
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  displayName,
  photoURL,
  size = 'md',
  style,
  className = '',
  interactive = true,
  variant
}) => {
  // Map string sizes to pixel values
  const sizeMap = {
    'xs': 24,
    'sm': 32,
    'md': 40,
    'lg': 64,
    'xl': 96
  };
  
  // Get numeric size
  const numericSize = sizeMap[size];
  
  // Determine size class for backwards compatibility
  const sizeClass = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-base',
    'lg': 'w-16 h-16 text-lg',
    'xl': 'w-24 h-24 text-xl'
  }[size];
  
  // Turn off interactivity for very small avatars
  const useInteractive = interactive && size !== 'xs' && size !== 'sm';
  
  // Determine variant based on userId if not provided
  // Use more sophisticated algorithm to ensure better distribution of variants
  const determineVariant = () => {
    if (variant) return variant;
    
    const hashCode = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const variants = ['default', 'gold', 'light', 'dark'];
    return variants[hashCode % variants.length] as 'default' | 'gold' | 'light' | 'dark';
  };
  
  return (
    <InteractiveAvatar
      userId={userId}
      displayName={displayName}
      photoURL={photoURL}
      size={numericSize}
      className={`flex-shrink-0 ${className}`}
      interactive={useInteractive}
      variant={determineVariant()}
    />
  );
};

export default UserAvatar;