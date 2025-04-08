import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Edit, 
  Calendar, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Shield, 
  Award,
  MessageCircle,
  UserPlus,
  Activity,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';
import { UserRole } from '../types/user';
import ProfileHeader from '../components/profile/ProfileHeader';
import ActivityLog from '../components/profile/ActivityLog';
import Card from '../components/common/Card';
import UserAvatar from '../components/common/UserAvatar';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCurrentUser: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab, isCurrentUser }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex border-b border-gray-800 mb-6">
      <button
        className={`px-4 py-2 text-sm ${activeTab === 'overview' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400'}`}
        onClick={() => setActiveTab('overview')}
      >
        {t('profile.overview')}
      </button>
      <button
        className={`px-4 py-2 text-sm ${activeTab === 'activity' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400'}`}
        onClick={() => setActiveTab('activity')}
      >
        {t('profile.activity')}
      </button>
      {isCurrentUser && (
        <button
          className={`px-4 py-2 text-sm ${activeTab === 'connections' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('connections')}
        >
          {t('profile.connections')}
        </button>
      )}
      {isCurrentUser && (
        <button
          className={`px-4 py-2 text-sm ${activeTab === 'settings' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('settings')}
        >
          {t('profile.settings')}
        </button>
      )}
    </div>
  );
};

const ProfileOverview: React.FC = () => {
  const { userProfile } = useUser();
  const { t } = useTranslation();
  
  if (!userProfile) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">{t('profile.about')}</h3>
          <p className="text-gray-300 mb-6">
            {userProfile.bio || t('profile.noBio')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProfile.location && (
              <div className="flex items-center text-gray-400">
                <MapPin className="mr-2" size={16} />
                <span>{userProfile.location}</span>
              </div>
            )}
            {userProfile.website && (
              <div className="flex items-center text-gray-400">
                <Globe className="mr-2" size={16} />
                <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {userProfile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center text-gray-400">
              <Mail className="mr-2" size={16} />
              <span>{userProfile.email}</span>
            </div>
            {userProfile.phoneNumber && (
              <div className="flex items-center text-gray-400">
                <Phone className="mr-2" size={16} />
                <span>{userProfile.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center text-gray-400">
              <Calendar className="mr-2" size={16} />
              <span>{t('profile.memberSince')} {new Date(userProfile.createdAt.toDate()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Shield className="mr-2" size={16} />
              <span>
                {userProfile.roles.includes(UserRole.ADMIN) 
                  ? t('profile.adminRole')
                  : userProfile.roles.includes(UserRole.COMMUNITY_LEADER)
                  ? t('profile.leaderRole')
                  : userProfile.roles.includes(UserRole.BUSINESS_OWNER)
                  ? t('profile.businessRole')
                  : t('profile.memberRole')
                }
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('profile.achievements')}</h3>
          
          {(userProfile.badges && userProfile.badges.length > 0) ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userProfile.badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-800 rounded-sm">
                  <Award className="text-yellow-500 mb-2" size={24} />
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">{t('profile.noAchievements')}</p>
          )}
        </Card>
      </div>
      
      <div>
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">{t('profile.stats')}</h3>
          
          <div className="space-y-4">
            {userProfile.wealthScore !== undefined && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{t('profile.wealthScore')}</span>
                  <span className="text-sm font-medium">{userProfile.wealthScore}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${Math.min(userProfile.wealthScore, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userProfile.creditScore !== undefined && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{t('profile.creditScore')}</span>
                  <span className="text-sm font-medium">{userProfile.creditScore}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${Math.min((userProfile.creditScore / 850) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userProfile.communityContributions !== undefined && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{t('profile.contributions')}</span>
                  <span className="text-sm font-medium">{userProfile.communityContributions}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full" 
                    style={{ width: `${Math.min((userProfile.communityContributions / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userProfile.eventAttendance !== undefined && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{t('profile.events')}</span>
                  <span className="text-sm font-medium">{userProfile.eventAttendance}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${Math.min((userProfile.eventAttendance / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('profile.socialLinks')}</h3>
          
          {userProfile.socialLinks && Object.values(userProfile.socialLinks).some(link => !!link) ? (
            <div className="space-y-3">
              {userProfile.socialLinks.twitter && (
                <a href={`https://twitter.com/${userProfile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-blue-400">
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>
                  </div>
                  <span>Twitter</span>
                </a>
              )}
              
              {userProfile.socialLinks.instagram && (
                <a href={`https://instagram.com/${userProfile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-pink-400">
                  <div className="w-8 h-8 bg-pink-900 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <span>Instagram</span>
                </a>
              )}
              
              {userProfile.socialLinks.linkedin && (
                <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-blue-600">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg>
                  </div>
                  <span>LinkedIn</span>
                </a>
              )}
              
              {userProfile.socialLinks.facebook && (
                <a href={userProfile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-blue-500">
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.62v-7h-2.35v-2.69h2.35v-2c0-2.33 1.42-3.6 3.5-3.6 1 0 1.84.08 2.1.12v2.43h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69L17.76 14h-2.27v7H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path></svg>
                  </div>
                  <span>Facebook</span>
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-400">{t('profile.noSocialLinks')}</p>
          )}
        </Card>
      </div>
    </div>
  );
};

// Profile edit component for editing user information
const ProfileEdit: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { userProfile, updateProfile, uploadProfileImage, uploadCoverImage } = useUser();
  const { t } = useTranslation();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState<string>('adventurer');
  
  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBio(userProfile.bio || '');
      setLocation(userProfile.location || '');
      setWebsite(userProfile.website || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      
      if (userProfile.settings?.avatarStyle) {
        setAvatarStyle(userProfile.settings.avatarStyle);
      }
      
      if (userProfile.socialLinks) {
        setTwitter(userProfile.socialLinks.twitter || '');
        setInstagram(userProfile.socialLinks.instagram || '');
        setLinkedin(userProfile.socialLinks.linkedin || '');
        setFacebook(userProfile.socialLinks.facebook || '');
      }
    }
  }, [userProfile]);
  
  // Handle profile image selection
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle cover image selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Upload profile image if selected
      let photoURL = userProfile?.photoURL;
      if (profileImageFile) {
        photoURL = await uploadProfileImage(profileImageFile);
      }
      
      // Upload cover image if selected
      let coverPhotoURL = userProfile?.coverPhotoURL;
      if (coverImageFile) {
        coverPhotoURL = await uploadCoverImage(coverImageFile);
      }
      
      // Update profile and settings
      await updateProfile({
        displayName,
        bio,
        location,
        website,
        phoneNumber,
        photoURL,
        coverPhotoURL,
        socialLinks: {
          twitter,
          instagram,
          linkedin,
          facebook
        },
        settings: {
          ...userProfile?.settings,
          avatarStyle
        }
      });
      
      onCancel();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{t('profile.editProfile')}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-sm">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('profile.profileImage')}</label>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
                  {(profileImagePreview || userProfile?.photoURL) ? (
                    <img 
                      src={profileImagePreview || userProfile?.photoURL} 
                      alt={t('profile.profileImage')} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserAvatar 
                      userId={userProfile?.userId || 'temp'}
                      displayName={displayName || 'User'}
                      size="lg"
                      style={avatarStyle as any}
                      className="w-full h-full"
                    />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 rounded-full p-1 cursor-pointer">
                  <Camera size={14} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>
              
              {/* Avatar style selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Avatar Style (if no custom image)</label>
                <select
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
                  value={avatarStyle}
                  onChange={(e) => setAvatarStyle(e.target.value)}
                >
                  <option value="adventurer">Adventurer</option>
                  <option value="avataaars">Avataaars</option>
                  <option value="bottts">Bottts</option>
                  <option value="identicon">Identicon</option>
                  <option value="initials">Initials</option>
                  <option value="micah">Micah</option>
                  <option value="thumbs">Thumbs</option>
                  <option value="lorelei">Lorelei</option>
                  <option value="pixelart">Pixel Art</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">{t('profile.coverImage')}</label>
                <div className="relative h-20 w-full rounded-sm overflow-hidden bg-gray-700">
                  {(coverImagePreview || userProfile?.coverPhotoURL) && (
                    <img 
                      src={coverImagePreview || userProfile?.coverPhotoURL} 
                      alt={t('profile.coverImage')} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <label className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full p-2 cursor-pointer">
                    <ImageIcon size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleCoverImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{t('profile.displayName')}</label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{t('profile.bio')}</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3 min-h-[100px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('profile.location')}</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('profile.website')}</label>
              <input
                type="url"
                className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('profile.phoneNumber')}</label>
              <input
                type="tel"
                className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          
          <h4 className="text-md font-medium mb-4 mt-6">{t('profile.socialLinks')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <div className="flex">
                <span className="bg-gray-700 px-3 py-2 rounded-l-sm border-y border-l border-gray-600">@</span>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-r-sm py-2 px-3"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <div className="flex">
                <span className="bg-gray-700 px-3 py-2 rounded-l-sm border-y border-l border-gray-600">@</span>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-r-sm py-2 px-3"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                type="url"
                className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 px-3"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username"
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 border border-gray-700 text-sm rounded-sm"
            onClick={onCancel}
            disabled={loading}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-sm flex items-center"
            disabled={loading}
          >
            {loading ? t('common.saving') : t('common.save')}
            {loading && <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          </button>
        </div>
      </form>
    </Card>
  );
};

// Profile Actions component (Message, Connect buttons)
const ProfileActions: React.FC = () => {
  const { userProfile, createChatRoom, connectWithUser } = useUser();
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle sending a message
  const handleMessage = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a private chat room
      const roomId = await createChatRoom(
        userProfile?.displayName || 'Chat',
        [userId],
        'private'
      );
      
      // Redirect to chat room (would need routing setup)
      console.log(`Chat room created with ID: ${roomId}`);
      // TODO: Add proper navigation to chat room
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle connecting with user
  const handleConnect = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await connectWithUser(userId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex space-x-3">
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
      
      <button
        className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-sm"
        onClick={handleMessage}
        disabled={loading}
      >
        <MessageCircle size={16} className="mr-2" />
        {t('profile.message')}
      </button>
      
      <button
        className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-sm"
        onClick={handleConnect}
        disabled={loading}
      >
        <UserPlus size={16} className="mr-2" />
        {t('profile.connect')}
      </button>
    </div>
  );
};

const ProfileConnections: React.FC = () => {
  const { userProfile, fetchUserProfile } = useUser();
  const { t } = useTranslation();
  const [connections, setConnections] = useState<Array<{
    user: {
      userId: string;
      displayName: string;
      photoURL?: string;
    },
    status: string;
    since: Date;
  }>>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadConnections = async () => {
      if (userProfile?.connections && userProfile.connections.length > 0) {
        const connectionsData = [];
        
        for (const connection of userProfile.connections) {
          if (connection.status === 'connected') {
            try {
              const user = await fetchUserProfile(connection.userId);
              if (user) {
                connectionsData.push({
                  user: {
                    userId: user.userId,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                  },
                  status: connection.status,
                  since: connection.since.toDate()
                });
              }
            } catch (err) {
              console.error('Error fetching connection profile:', err);
            }
          }
        }
        
        setConnections(connectionsData);
      }
      
      setLoading(false);
    };
    
    loadConnections();
  }, [userProfile, fetchUserProfile]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <User size={40} className="mx-auto mb-4 text-gray-500" />
        <h4 className="text-lg font-medium mb-2">{t('profile.noConnections')}</h4>
        <p className="text-gray-400">{t('profile.connectionsEmpty')}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((connection) => (
        <Card key={connection.user.userId} className="p-4 flex items-center">
          <UserAvatar 
            userId={connection.user.userId}
            displayName={connection.user.displayName}
            photoURL={connection.user.photoURL}
            size="md"
            className="mr-4"
          />
          
          <div className="flex-1">
            <h4 className="font-medium">{connection.user.displayName}</h4>
            <p className="text-sm text-gray-400">
              {t('profile.connectedSince')} {new Date(connection.since).toLocaleDateString()}
            </p>
          </div>
          
          <button className="text-blue-500 hover:text-blue-400">
            <MessageCircle size={16} />
          </button>
        </Card>
      ))}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { userProfile, fetchUserProfile } = useUser();
  const { userId } = useParams<{ userId: string }>();
  const { t } = useTranslation();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Is this the current user's profile?
  const isCurrentUser = !userId || (userProfile && userId === userProfile.userId);
  
  // Fetch profile data
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (isCurrentUser) {
          // Use the current user's profile
          setProfile(userProfile);
        } else if (userId) {
          // Fetch the requested user's profile
          const userProfile = await fetchUserProfile(userId);
          
          if (userProfile) {
            setProfile(userProfile);
          } else {
            setError('User not found');
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (!isCurrentUser || userProfile) {
      getProfile();
    }
  }, [userId, userProfile, isCurrentUser, fetchUserProfile]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">{t('profile.errorTitle')}</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded"
            onClick={() => window.location.href = '/'}
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-gray-500 mb-4">
            <User size={64} className="mx-auto" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('profile.userNotFound')}</h2>
          <p className="text-gray-400 mb-4">{t('profile.userNotFoundDesc')}</p>
          <button 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded"
            onClick={() => window.location.href = '/'}
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <ProfileHeader 
        name={profile.displayName}
        photoURL={profile.photoURL}
        coverPhotoURL={profile.coverPhotoURL}
        roles={profile.roles}
        isCurrentUser={isCurrentUser}
        onEdit={() => setIsEditing(true)}
      />
      
      {/* Profile Actions */}
      <div className="flex justify-between items-center mb-6">
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isCurrentUser={isCurrentUser} 
        />
        
        {/* Show actions only if viewing another user's profile */}
        {!isCurrentUser && <ProfileActions />}
      </div>
      
      {/* Profile Content */}
      <div>
        {/* Edit Profile Form */}
        {isEditing ? (
          <ProfileEdit onCancel={() => setIsEditing(false)} />
        ) : (
          <div>
            {/* Overview */}
            {activeTab === 'overview' && <ProfileOverview />}
            
            {/* Activity */}
            {activeTab === 'activity' && <ActivityLog />}
            
            {/* Connections */}
            {activeTab === 'connections' && isCurrentUser && <ProfileConnections />}
            
            {/* Settings */}
            {activeTab === 'settings' && isCurrentUser && (
              <div className="text-center py-12">
                <Activity size={40} className="mx-auto mb-4 text-gray-500" />
                <h4 className="text-lg font-medium mb-2">{t('profile.settingsTitle')}</h4>
                <p className="text-gray-400 mb-6">{t('profile.settingsDesc')}</p>
                <button 
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded"
                  onClick={() => setActiveTab('overview')}
                >
                  {t('profile.goToSettings')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;