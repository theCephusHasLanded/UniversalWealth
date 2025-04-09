import React from 'react';
import { Edit, User, Shield } from 'lucide-react';
import { UserRole } from '../../types/user';
import { useTranslation } from '../../contexts/TranslationContext';
import UserAvatar from '../common/UserAvatar';

interface ProfileHeaderProps {
  name: string;
  photoURL?: string;
  coverPhotoURL?: string;
  roles: UserRole[];
  isCurrentUser: boolean;
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  photoURL,
  coverPhotoURL,
  roles,
  isCurrentUser,
  onEdit
}) => {
  const { t } = useTranslation();
  
  // Function to get the role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-600';
      case UserRole.COMMUNITY_LEADER:
        return 'bg-purple-600';
      case UserRole.BUSINESS_OWNER:
        return 'bg-blue-600';
      default:
        return 'bg-green-600';
    }
  };
  
  // Function to get the role display name
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return t('profile.adminRole');
      case UserRole.COMMUNITY_LEADER:
        return t('profile.leaderRole');
      case UserRole.BUSINESS_OWNER:
        return t('profile.businessRole');
      default:
        return t('profile.memberRole');
    }
  };
  
  return (
    <div className="mb-6 sm:mb-8">
      {/* Cover Photo */}
      <div className="h-32 sm:h-40 md:h-48 rounded-sm overflow-hidden relative bg-gradient-to-r from-gray-900 to-gray-800">
        {coverPhotoURL && (
          <img 
            src={coverPhotoURL} 
            alt={t('profile.coverPhoto')} 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Edit button (visible only to the profile owner) */}
        {isCurrentUser && (
          <button 
            className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
            onClick={onEdit}
          >
            <Edit size={16} />
          </button>
        )}
      </div>
      
      {/* Profile info section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end px-4 sm:px-6 md:px-8 -mt-10 sm:-mt-12 md:-mt-16 relative z-10">
        {/* Profile photo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-black">
          <UserAvatar 
            userId={isCurrentUser ? 'currentUser' : 'otherUser'} // This should be the actual userId in a real app
            displayName={name}
            photoURL={photoURL}
            size="xl"
            className="w-full h-full"
          />
        </div>
        
        {/* Profile details */}
        <div className="mt-3 sm:mt-0 sm:ml-4 md:ml-6 mb-2 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold">{name}</h1>
          
          {/* Roles badges */}
          <div className="flex flex-wrap gap-2 mt-1 sm:mt-2">
            {roles?.map((role, index) => (
              <div 
                key={index} 
                className={`${getRoleBadgeColor(role)} px-2 py-1 rounded-sm text-xs flex items-center`}
              >
                <Shield size={12} className="mr-1" />
                {getRoleDisplayName(role)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Edit profile button (visible only to the profile owner) - desktop version */}
        {isCurrentUser && (
          <div className="hidden sm:block ml-auto">
            <button 
              className="bg-gray-800 hover:bg-gray-700 px-3 sm:px-4 py-2 rounded-sm text-sm flex items-center"
              onClick={onEdit}
            >
              <Edit size={14} className="mr-2" />
              {t('profile.editProfile')}
            </button>
          </div>
        )}
      </div>
      
      {/* Edit profile button (visible only to the profile owner) - mobile version */}
      {isCurrentUser && (
        <div className="mt-3 sm:hidden px-4">
          <button 
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-sm text-sm flex items-center w-full justify-center"
            onClick={onEdit}
          >
            <Edit size={14} className="mr-2" />
            {t('profile.editProfile')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;