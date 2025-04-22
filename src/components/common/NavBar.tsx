import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, User } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useTranslation } from '../../contexts/TranslationContext';
import UserAvatar from './UserAvatar';

const NavBar: React.FC = () => {
  const { userProfile, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  // Handle clicking outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Go to profile page when clicking on avatar
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Mark notification as read and perform its action
  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    // You can add specific actions based on notification type here
    setShowNotifications(false);
  };

  // View all notifications
  const viewAllNotifications = () => {
    markAllNotificationsAsRead();
    navigate('/notifications');
    setShowNotifications(false);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Notifications */}
      <div className="relative" ref={notificationRef}>
        <button
          className="text-neutral-400 hover:text-gold transition-colors p-1 relative"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-navy-900 text-xs flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div 
            className="fixed mt-2 w-64 bg-navy-700 border border-navy-600 backdrop-blur-sm overflow-hidden z-[9999] shadow-xl animate-fade-in origin-top-right notification-dropdown"
            style={{
              top: notificationRef.current ? notificationRef.current.getBoundingClientRect().bottom + 10 + 'px' : '60px',
              right: notificationRef.current ? (window.innerWidth - notificationRef.current.getBoundingClientRect().right) + 'px' : '30px'
            }}
          >
            <div className="p-3 border-b border-navy-600 flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-wider text-gold">{t('notifications.title')}</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-neutral-400 hover:text-white p-1"
                aria-label="Close notifications"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-navy-600/50 hover:bg-navy-600/50 transition-colors cursor-pointer ${!notification.read ? 'bg-navy-600/30' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <p className="text-xs text-white font-medium">{notification.title}</p>
                    <p className="text-xs text-neutral-400 mt-1">{notification.message}</p>
                    <p className="text-2xs text-neutral-500 mt-1">
                      {new Date(notification.createdAt.toDate()).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center">
                  <p className="text-xs text-neutral-400">{t('notifications.empty')}</p>
                </div>
              )}
            </div>

            <div className="p-2 border-t border-navy-600 bg-navy-800/50">
              <button 
                className="w-full text-xs text-center text-gold hover:underline py-1"
                onClick={viewAllNotifications}
              >
                {t('notifications.viewAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <button
        onClick={handleProfileClick}
        className="p-1 transition-transform hover:scale-105 group"
        aria-label="User profile"
      >
        {userProfile ? (
          <div className="relative">
            <UserAvatar
              userId={userProfile.userId}
              displayName={userProfile.displayName}
              photoURL={userProfile.photoURL}
              size="xs"
              style={userProfile.settings?.avatarStyle as any}
              className="border border-transparent group-hover:border-gold/50"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-navy-800"></span>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-navy-700 border border-navy-600 group-hover:border-gold/50 flex items-center justify-center">
            <User size={14} className="text-neutral-400 group-hover:text-gold" />
          </div>
        )}
      </button>
    </div>
  );
};

export default NavBar;