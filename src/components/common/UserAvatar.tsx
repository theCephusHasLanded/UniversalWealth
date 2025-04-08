import React from 'react';
import { User } from 'lucide-react';
import { getUserAvatarSrc, AvatarStyle } from '../../utils/avatars';

interface UserAvatarProps {
  userId: string;
  displayName: string;
  photoURL?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: AvatarStyle;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  displayName,
  photoURL,
  size = 'md',
  style,
  className = ''
}) => {
  // Get the avatar source
  const avatarSrc = getUserAvatarSrc(userId, displayName, photoURL, style);
  
  // Determine size class
  const sizeClass = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-base',
    'lg': 'w-16 h-16 text-lg',
    'xl': 'w-24 h-24 text-xl'
  }[size];
  
  return (
    <div className={`rounded-full overflow-hidden flex-shrink-0 ${sizeClass} ${className}`}>
      {avatarSrc ? (
        <img 
          src={avatarSrc}
          alt={displayName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to User icon if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.classList.add('bg-gray-700', 'flex', 'items-center', 'justify-center');
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
          <User size={size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 32 : 48} />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;