import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: t('language.en') },
    { code: 'es', name: t('language.es') },
    { code: 'fr', name: t('language.fr') },
    { code: 'ht', name: t('language.ht') },
    { code: 'zh', name: t('language.zh') },
    { code: 'ja', name: t('language.ja') },
    { code: 'ru', name: t('language.ru') },
    { code: 'xh', name: t('language.xh') },
    { code: 'ar', name: t('language.ar') },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (code: string) => {
    // Set the language
    setLanguage(code as 'en' | 'es' | 'fr' | 'zh' | 'ja' | 'ru' | 'xh' | 'ar' | 'ht');
    
    // Set RTL attribute for Arabic language
    if (code === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    
    closeDropdown();
  };

  // Calculate dropdown position based on button position
  const getDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      return {
        top: `${rect.bottom + 10}px`,
        right: `${window.innerWidth - rect.right}px`,
      };
    }
    return { top: '60px', right: '30px' };
  };
  
  // Recalculate position when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        // Force a re-render to update position
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 0);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-neutral-400 hover:text-gold transition-colors flex items-center gap-1 text-xs uppercase tracking-wider"
      >
        <Globe size={14} />
        <span>{language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            ...getDropdownPosition(),
            zIndex: 9999
          }}
          className="w-40 bg-navy-700 border border-navy-600 backdrop-blur-sm overflow-hidden language-dropdown shadow-xl animate-fade-in relative"
        >
          {languages.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`block w-full text-left px-4 py-2 text-xs tracking-wide transition-colors ${
                language === code 
                  ? 'bg-navy-600 text-gold border-l-2 border-gold' 
                  : 'text-neutral-300 hover:bg-navy-600 hover:text-white'
              }`}
              style={{ direction: code === 'ar' ? 'rtl' : 'ltr' }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
