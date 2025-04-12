import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Users, 
  X,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * A submenu for Wealth section that appears when the user taps on Wealth in the main navigation
 */
const WealthSubMenu: React.FC<{ onClose: () => void, isOpen: boolean }> = ({ onClose, isOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const menuItems = [
    {
      id: 'wealth-overview',
      icon: <CreditCard size={18} />,
      label: t('wealth.overview') || 'Overview',
      path: '/wealth',
      active: location.pathname === '/wealth',
    },
    {
      id: 'wealth-planning',
      icon: <BookOpen size={18} />,
      label: t('wealth.planning.title') || 'Wealth Planning',
      path: '/wealth/planning',
      active: location.pathname === '/wealth/planning',
    },
    {
      id: 'wealth-investments',
      icon: <TrendingUp size={18} />,
      label: t('wealth.investments') || 'Investments',
      path: '/wealth/investments',
      active: location.pathname === '/wealth/investments',
      disabled: true,
    },
    {
      id: 'wealth-pay-in-4',
      icon: <DollarSign size={18} />,
      label: t('wealth.payIn4') || 'Pay-in-4',
      path: '/wealth/pay-in-4',
      active: location.pathname === '/wealth/pay-in-4',
      disabled: true,
    },
    {
      id: 'wealth-community',
      icon: <Users size={18} />,
      label: t('wealth.community') || 'Community',
      path: '/wealth/community',
      active: location.pathname === '/wealth/community',
      disabled: true,
    },
  ];

  const handleNavigate = (path: string, disabled: boolean = false) => {
    if (disabled) return;
    navigate(path);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        ref={menuRef}
        className="bg-navy-800 border border-navy-700 rounded-sm shadow-lg p-4 w-full max-w-xs mx-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase tracking-wider text-gold">
            {t('wealth.name')}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path, item.disabled)}
              className={`w-full flex items-center justify-between p-3 rounded-sm ${
                item.active 
                  ? 'bg-navy-700 text-gold' 
                  : item.disabled 
                    ? 'text-neutral-500 cursor-not-allowed' 
                    : 'text-neutral-200 hover:bg-navy-700'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
              {item.active && (
                <span className="w-1 h-6 bg-gold rounded-full" />
              )}
              {!item.active && !item.disabled && (
                <ChevronRight size={16} className="text-neutral-400" />
              )}
              {item.disabled && (
                <span className="text-xs text-neutral-500">Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WealthSubMenu;