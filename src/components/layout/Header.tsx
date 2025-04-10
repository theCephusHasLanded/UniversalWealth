import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LanguageSelector from '../common/LanguageSelector';
import UserAvatar from '../common/UserAvatar';
import Logo from '../common/Logo';
import { useTranslation } from '../../contexts/TranslationContext';
import { useUser } from '../../contexts/UserContext';
import { Bell, User, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { userProfile } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position for header styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle clicks outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className={`py-4 px-6 transition-all duration-300 backdrop-blur-sm ${isScrolled ? 'border-b border-navy-700 bg-navy-800/90' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <Logo size="sm" showText={true} variant="dark" />
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="text-xs text-neutral-400 uppercase tracking-widest">{t('app.tagline')}</div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSelector />
            
            <div className="relative" ref={notificationRef}>
              <button 
                className="text-neutral-400 hover:text-gold transition-colors p-1 relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (notifications > 0 && showNotifications) {
                    setNotifications(0);
                  }
                }}
              >
                <Bell size={16} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-navy-900 text-xs flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* Notification dropdown */}
              {showNotifications && (
                <div className="fixed mt-2 w-64 bg-navy-700 border border-navy-600 backdrop-blur-sm overflow-hidden z-[9999] shadow-xl animate-fade-in origin-top-right notification-dropdown"
                     style={{
                       top: notificationRef.current ? notificationRef.current.getBoundingClientRect().bottom + 10 + 'px' : '60px',
                       right: notificationRef.current ? (window.innerWidth - notificationRef.current.getBoundingClientRect().right) + 'px' : '30px'
                     }}
                >
                  <div className="p-3 border-b border-navy-600">
                    <h3 className="text-xs uppercase tracking-wider text-gold">{t('notifications.title')}</h3>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {notifications > 0 ? (
                      <>
                        <div className="p-3 border-b border-navy-600/50 hover:bg-navy-600/50 transition-colors cursor-pointer">
                          <p className="text-xs text-white font-medium">New investment opportunity</p>
                          <p className="text-xs text-neutral-400 mt-1">Exclusive early access for members</p>
                          <p className="text-2xs text-neutral-500 mt-1">2 hours ago</p>
                        </div>
                        <div className="p-3 border-b border-navy-600/50 hover:bg-navy-600/50 transition-colors cursor-pointer">
                          <p className="text-xs text-white font-medium">Financial goal achieved</p>
                          <p className="text-xs text-neutral-400 mt-1">You reached your monthly savings target</p>
                          <p className="text-2xs text-neutral-500 mt-1">Yesterday</p>
                        </div>
                        <div className="p-3 hover:bg-navy-600/50 transition-colors cursor-pointer">
                          <p className="text-xs text-white font-medium">New Hub event announced</p>
                          <p className="text-xs text-neutral-400 mt-1">Wealth mastery workshop this weekend</p>
                          <p className="text-2xs text-neutral-500 mt-1">2 days ago</p>
                        </div>
                      </>
                    ) : (
                      <div className="p-5 text-center">
                        <p className="text-xs text-neutral-400">{t('notifications.empty')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-navy-600 bg-navy-800/50">
                    <button className="w-full text-xs text-center text-gold hover:underline py-1">
                      {t('notifications.viewAll')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Avatar - Links to profile page */}
            <Link 
              to="/profile"
              className="p-1 transition-transform hover:scale-105 group"
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
            </Link>
            
            <button className="md:hidden text-neutral-400 hover:text-gold transition-colors p-1">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
