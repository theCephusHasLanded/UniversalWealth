import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  CreditCard, 
  Building, 
  BarChart2, 
  Users, 
  User, 
  MessageSquare
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import EyeLogo from '../common/EyeLogo';
import WealthSubMenu from '../common/WealthSubMenu';
import { useTranslation } from '../../contexts/TranslationContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const [showWealthMenu, setShowWealthMenu] = useState(false);
  
  // Store all menu items
  const allMenuItems: MenuItem[] = [
    { id: 'invite', icon: <div className="w-5 h-5 relative"><EyeLogo size={20} variant="gold" /></div>, label: t('nav.invite') || 'Invite' },
    { id: 'overview', icon: <Globe size={20} />, label: t('nav.overview') },
    { id: 'wealth', icon: <CreditCard size={20} />, label: t('nav.wealth') },
    { id: 'hub', icon: <Building size={20} />, label: t('nav.hub') },
    { id: 'trendcrypto', icon: <BarChart2 size={20} />, label: t('nav.trendcrypto') },
    { id: 'lificosm', icon: <Users size={20} />, label: t('nav.lificosm') },
    { id: 'forum', icon: <MessageSquare size={20} />, label: t('nav.forum') },
    { id: 'profile', icon: <User size={20} />, label: t('nav.profile') }
  ];
  
  // Define how many items to show at once (adjust for different screen sizes)
  const [visibleCount, setVisibleCount] = useState(5);
  // Track the starting index for the visible menu items
  const [startIndex, setStartIndex] = useState(0);
  
  // Helper function to get path from tab ID
  const getPathFromTabId = (tabId: string): string => {
    switch (tabId) {
      case 'invite':
        return '/membership';
      case 'overview':
        return '/dashboard';
      case 'wealth':
        return '/wealth';
      case 'hub':
        return '/hub';
      case 'trendcrypto':
        return '/trendcrypto';
      case 'lificosm':
        return '/lificosm';
      case 'forum':
        return '/forum';
      case 'profile':
        return '/profile';
      default:
        return '/';
    }
  };
  
  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Adjust visible count based on screen width
      if (window.innerWidth < 360) {
        setVisibleCount(3);
      } else if (window.innerWidth < 640) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
      }
    };
    
    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Auto-center the active tab
  useEffect(() => {
    const activeIndex = allMenuItems.findIndex(item => item.id === activeTab);
    if (activeIndex >= 0) {
      // Calculate the optimal starting index to center the active item
      let optimalStart = activeIndex - Math.floor(visibleCount / 2);
      
      // Make sure we don't go out of bounds
      optimalStart = Math.max(0, optimalStart);
      optimalStart = Math.min(allMenuItems.length - visibleCount, optimalStart);
      
      setStartIndex(optimalStart);
    }
  }, [activeTab, visibleCount, allMenuItems]);
  
  // Get the currently visible menu items
  const visibleMenuItems = allMenuItems.slice(startIndex, startIndex + visibleCount);
  
  // Touch gesture handling
  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    
    // Threshold for swipe detection (adjust as needed)
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - move menu left
        rotateMenu(-1);
      } else {
        // Swipe left - move menu right
        rotateMenu(1);
      }
    }
    
    touchStartX.current = null;
  };
  
  // Function to rotate the menu
  const rotateMenu = (direction: number) => {
    // Calculate new starting index
    const newIndex = startIndex + direction;
    
    // Check boundaries
    if (newIndex >= 0 && newIndex <= allMenuItems.length - visibleCount) {
      setStartIndex(newIndex);
    }
  };
  
  // Handle circular rotation with animation
  const animateRotation = (index: number) => {
    if (!containerRef.current) return;
    
    const menuItems = containerRef.current.querySelectorAll('.menu-item');
    if (!menuItems.length) return;
    
    menuItems.forEach((item, i) => {
      // Apply animation delay based on position
      const delay = Math.abs(i - index) * 0.05;
      (item as HTMLElement).style.transition = `transform 0.3s ease ${delay}s, opacity 0.3s ease ${delay}s`;
      
      if (i === index) {
        // Center item
        (item as HTMLElement).style.transform = 'translateY(0) scale(1.1)';
        (item as HTMLElement).style.opacity = '1';
      } else {
        // Other items
        (item as HTMLElement).style.transform = 'translateY(4px) scale(1)';
        (item as HTMLElement).style.opacity = '0.7';
      }
    });
  };

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 border-t border-navy-700 bg-navy-800/95 backdrop-blur-sm"
      onTouchStart={isTouch ? handleTouchStart : undefined}
      onTouchEnd={isTouch ? handleTouchEnd : undefined}
    >
      <div className="flex justify-between items-center px-2 max-w-lg mx-auto">
        {/* Menu items */}
        <div 
          ref={containerRef}
          className="flex-1 flex justify-around" 
        >
          {visibleMenuItems.map((item, index) => {
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  animateRotation(index);
                  
                  // If this is the wealth tab, show the wealth submenu
                  if (item.id === 'wealth') {
                    setShowWealthMenu(true);
                    navigate('/wealth');
                    return;
                  }
                  
                  // Navigate based on tab ID
                  const path = getPathFromTabId(item.id);
                  navigate(path);
                  
                  // Dispatch custom event to set active tab
                  window.dispatchEvent(new CustomEvent('setActiveTab', { detail: item.id }));
                }}
                className={`menu-item p-3 flex flex-col items-center transition-all ${
                  isActive ? 'text-gold' : 'text-neutral-500'
                } hover:text-white`}
                style={{
                  transform: isActive ? 'translateY(0) scale(1.1)' : 'translateY(4px) scale(1)',
                  opacity: isActive ? 1 : 0.7
                }}
              >
                {item.icon}
                <span className="text-xs mt-1 uppercase tracking-wider">{item.label}</span>
                {isActive && (
                  <div className="h-0.5 w-5 bg-gold mt-1.5 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Optional: Indicator dots for menu position */}
      <div className="flex justify-center pb-1">
        {Array.from({ length: Math.min(3, Math.ceil(allMenuItems.length / visibleCount)) }).map((_, index) => (
          <div 
            key={index}
            className={`h-1 w-1 rounded-full mx-0.5 ${
              Math.floor(startIndex / visibleCount) === index ? 'bg-gold' : 'bg-navy-600'
            }`}
          />
        ))}
      </div>
      
      {/* Wealth SubMenu */}
      <WealthSubMenu 
        isOpen={showWealthMenu} 
        onClose={() => setShowWealthMenu(false)} 
      />
    </footer>
  );
};

export default Navigation;