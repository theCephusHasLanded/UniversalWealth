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
import EyeLogo from '../components/common/EyeLogo';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCurrentUser: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab, isCurrentUser }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="h-px w-6 bg-gold mr-2"></div>
        <h2 className="text-sm font-normal tracking-widest text-gold uppercase">{t('profile.profile') || 'PROFILE'}</h2>
      </div>
    
      <div className="flex flex-wrap border-b border-navy-700 overflow-x-auto whitespace-nowrap max-w-full">
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider ${
            activeTab === 'overview' 
              ? 'border-b-2 border-gold text-white' 
              : 'text-neutral-400 hover:text-neutral-200 transition-colors'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          {t('profile.overview')}
        </button>
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider ${
            activeTab === 'activity' 
              ? 'border-b-2 border-gold text-white' 
              : 'text-neutral-400 hover:text-neutral-200 transition-colors'
          }`}
          onClick={() => setActiveTab('activity')}
        >
          {t('profile.activity')}
        </button>
        {isCurrentUser && (
          <button
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider ${
              activeTab === 'connections' 
                ? 'border-b-2 border-gold text-white' 
                : 'text-neutral-400 hover:text-neutral-200 transition-colors'
            }`}
            onClick={() => setActiveTab('connections')}
          >
            {t('profile.connections')}
          </button>
        )}
        {isCurrentUser && (
          <button
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider ${
              activeTab === 'settings' 
                ? 'border-b-2 border-gold text-white' 
                : 'text-neutral-400 hover:text-neutral-200 transition-colors'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            {t('profile.settings')}
          </button>
        )}
      </div>
    </div>
  );
};

const ProfileOverview: React.FC = () => {
  const { userProfile } = useUser();
  const { t } = useTranslation();
  
  if (!userProfile) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="md:col-span-2 w-full">
        <Card variant="glass" className="p-6 mb-6 relative overflow-hidden">
          {/* Subtle eye logo in background */}
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <EyeLogo size={128} variant="gold" expressiveness="low" />
          </div>
          
          <div className="flex items-center mb-4">
            <div className="h-px w-6 bg-gold/50 mr-2"></div>
            <h3 className="text-sm uppercase tracking-wider text-gold/80">{t('profile.about')}</h3>
          </div>
          
          <p className="text-neutral-300 mb-6 relative z-10">
            {userProfile.bio || t('profile.noBio')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userProfile.location && (
              <div className="flex items-center text-neutral-400">
                <div className="w-8 h-8 bg-navy-700 border border-navy-600 flex items-center justify-center mr-3 rounded-sm">
                  <MapPin size={14} className="text-gold/70" />
                </div>
                <span>{userProfile.location}</span>
              </div>
            )}
            {userProfile.website && (
              <div className="flex items-center text-neutral-400">
                <div className="w-8 h-8 bg-navy-700 border border-navy-600 flex items-center justify-center mr-3 rounded-sm">
                  <Globe size={14} className="text-gold/70" />
                </div>
                <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-gold/80 hover:text-gold transition-colors">
                  {userProfile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center text-neutral-400">
              <div className="w-8 h-8 bg-navy-700 border border-navy-600 flex items-center justify-center mr-3 rounded-sm">
                <Mail size={14} className="text-gold/70" />
              </div>
              <span>{userProfile.email}</span>
            </div>
            {userProfile.phoneNumber && (
              <div className="flex items-center text-neutral-400">
                <div className="w-8 h-8 bg-navy-700 border border-navy-600 flex items-center justify-center mr-3 rounded-sm">
                  <Phone size={14} className="text-gold/70" />
                </div>
                <span>{userProfile.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center text-neutral-400">
              <div className="w-8 h-8 bg-navy-700 border border-navy-600 flex items-center justify-center mr-3 rounded-sm">
                <Calendar size={14} className="text-gold/70" />
              </div>
              <span>{t('profile.memberSince')} {new Date(userProfile.createdAt.toDate()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-neutral-400">
              <div className="w-8 h-8 bg-navy-700 border border-navy-600 flex items-center justify-center mr-3 rounded-sm">
                <Shield size={14} className="text-gold/70" />
              </div>
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
        
        <Card variant="glass" className="p-6 relative overflow-hidden">
          <div className="flex items-center mb-4">
            <div className="h-px w-6 bg-gold/50 mr-2"></div>
            <h3 className="text-sm uppercase tracking-wider text-gold/80">{t('profile.achievements')}</h3>
          </div>
          
          {(userProfile.badges && userProfile.badges.length > 0) ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userProfile.badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 bg-navy-800 border border-navy-700 hover:border-gold/30 transition-all duration-300 rounded-sm">
                  <Award className="text-gold mb-3" size={24} />
                  <span className="text-sm font-medium text-white">{badge}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">{t('profile.noAchievements')}</p>
          )}
        </Card>
      </div>
      
      <div>
        <Card variant="glass" className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="h-px w-6 bg-gold/50 mr-2"></div>
            <h3 className="text-sm uppercase tracking-wider text-gold/80">{t('profile.stats')}</h3>
          </div>
          
          <div className="space-y-5">
            {userProfile.wealthScore !== undefined && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-400">{t('profile.wealthScore')}</span>
                  <span className="text-sm font-medium text-white">{userProfile.wealthScore}</span>
                </div>
                <div className="w-full bg-navy-700 h-1.5 rounded-sm overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-green-500 h-full" 
                    style={{ width: `${Math.min(userProfile.wealthScore, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userProfile.creditScore !== undefined && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-400">{t('profile.creditScore')}</span>
                  <span className="text-sm font-medium text-white">{userProfile.creditScore}</span>
                </div>
                <div className="w-full bg-navy-700 h-1.5 rounded-sm overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-full" 
                    style={{ width: `${Math.min((userProfile.creditScore / 850) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userProfile.communityContributions !== undefined && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-400">{t('profile.contributions')}</span>
                  <span className="text-sm font-medium text-white">{userProfile.communityContributions}</span>
                </div>
                <div className="w-full bg-navy-700 h-1.5 rounded-sm overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-purple-500 h-full" 
                    style={{ width: `${Math.min((userProfile.communityContributions / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userProfile.eventAttendance !== undefined && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-400">{t('profile.events')}</span>
                  <span className="text-sm font-medium text-white">{userProfile.eventAttendance}</span>
                </div>
                <div className="w-full bg-navy-700 h-1.5 rounded-sm overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-gold to-yellow-500 h-full" 
                    style={{ width: `${Math.min((userProfile.eventAttendance / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-px w-6 bg-gold/50 mr-2"></div>
            <h3 className="text-sm uppercase tracking-wider text-gold/80">{t('profile.socialLinks')}</h3>
          </div>
          
          {userProfile.socialLinks && Object.values(userProfile.socialLinks).some(link => !!link) ? (
            <div className="space-y-3">
              {userProfile.socialLinks.twitter && (
                <a href={`https://twitter.com/${userProfile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-neutral-300 hover:text-blue-400 p-2 rounded-sm hover:bg-navy-700/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-600/20 border border-blue-600/30 rounded-sm flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>
                  </div>
                  <span className="text-sm">Twitter</span>
                </a>
              )}
              
              {userProfile.socialLinks.instagram && (
                <a href={`https://instagram.com/${userProfile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-neutral-300 hover:text-pink-400 p-2 rounded-sm hover:bg-navy-700/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-600/20 border border-pink-600/30 rounded-sm flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <span className="text-sm">Instagram</span>
                </a>
              )}
              
              {userProfile.socialLinks.linkedin && (
                <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-neutral-300 hover:text-blue-500 p-2 rounded-sm hover:bg-navy-700/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-600/20 border border-blue-600/30 rounded-sm flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg>
                  </div>
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              
              {userProfile.socialLinks.facebook && (
                <a href={userProfile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-neutral-300 hover:text-blue-400 p-2 rounded-sm hover:bg-navy-700/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-600/20 border border-blue-600/30 rounded-sm flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.62v-7h-2.35v-2.69h2.35v-2c0-2.33 1.42-3.6 3.5-3.6 1 0 1.84.08 2.1.12v2.43h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69L17.76 14h-2.27v7H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path></svg>
                  </div>
                  <span className="text-sm">Facebook</span>
                </a>
              )}
            </div>
          ) : (
            <p className="text-neutral-400">{t('profile.noSocialLinks')}</p>
          )}
        </Card>
      </div>
    </div>
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
        className="flex items-center px-3 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-gold/30 text-neutral-200 text-sm rounded-sm transition-colors"
        onClick={handleMessage}
        disabled={loading}
      >
        <MessageCircle size={16} className="mr-2 text-gold/70" />
        {t('profile.message')}
      </button>
      
      <button
        className="flex items-center px-3 py-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 text-gold text-sm rounded-sm transition-colors"
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-navy-700 border-t-gold rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <EyeLogo size={24} variant="gold" expressiveness="low" />
          </div>
        </div>
      </div>
    );
  }
  
  if (connections.length === 0) {
    return (
      <Card variant="glass" className="text-center py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <EyeLogo size={128} variant="gold" expressiveness="low" />
        </div>
        
        <User size={48} className="mx-auto mb-4 text-neutral-500" />
        <h4 className="text-lg font-medium mb-3 text-white">{t('profile.noConnections')}</h4>
        <p className="text-neutral-400 max-w-md mx-auto">{t('profile.connectionsEmpty')}</p>
        
        <button 
          className="mt-6 px-4 py-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 transition-colors rounded-sm text-sm inline-flex items-center text-gold"
        >
          <UserPlus size={16} className="mr-2" />
          Find People to Connect
        </button>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((connection) => (
        <Card variant="glass" key={connection.user.userId} className="p-5 flex items-center hover:border-gold/30 transition-all duration-300">
          <UserAvatar 
            userId={connection.user.userId}
            displayName={connection.user.displayName}
            photoURL={connection.user.photoURL}
            size="md"
            className="mr-4"
            interactive={true}
          />
          
          <div className="flex-1">
            <h4 className="font-medium text-white">{connection.user.displayName}</h4>
            <p className="text-xs text-neutral-400 mt-1">
              {t('profile.connectedSince')} {new Date(connection.since).toLocaleDateString()}
            </p>
          </div>
          
          <button className="text-neutral-400 hover:text-gold transition-colors p-2 rounded-sm hover:bg-navy-700/50">
            <MessageCircle size={16} />
          </button>
        </Card>
      ))}
    </div>
  );
};

// Simple main ProfilePage component 
const ProfilePage: React.FC = () => {
  const { userProfile } = useUser();
  const { userId } = useParams<{ userId: string }>();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Is this the current user's profile?
  const isCurrentUser = !userId || (userProfile && userId === userProfile.userId);
  
  // Simple loading state
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-navy-700 border-t-gold rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <EyeLogo size={32} variant="gold" expressiveness="low" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4 sm:py-6 md:py-8 max-w-4xl mx-auto animate-fade-in">
      {/* Profile Header */}
      <ProfileHeader 
        name={userProfile.displayName}
        photoURL={userProfile.photoURL}
        coverPhotoURL={userProfile.coverPhotoURL}
        roles={userProfile.roles}
        isCurrentUser={isCurrentUser}
        onEdit={() => setIsEditing(true)}
      />
      
      {/* Profile Tabs and Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
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
        {/* Overview */}
        {activeTab === 'overview' && <ProfileOverview />}
        
        {/* Activity */}
        {activeTab === 'activity' && <ActivityLog />}
        
        {/* Connections */}
        {activeTab === 'connections' && isCurrentUser && <ProfileConnections />}
        
        {/* Settings */}
        {activeTab === 'settings' && isCurrentUser && (
          <Card variant="glass" className="text-center py-12 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
              <EyeLogo size={128} variant="gold" expressiveness="low" />
            </div>
            
            <Activity size={48} className="mx-auto mb-5 text-gold/80" />
            <h4 className="text-xl font-medium mb-3 text-white">{t('profile.settingsTitle')}</h4>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">{t('profile.settingsDesc')}</p>
            <button 
              className="px-4 py-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/50 text-gold text-sm rounded-sm transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {t('profile.editProfile')}
            </button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;