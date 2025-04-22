import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Mail, Smartphone, ExternalLink, Info, X, Menu, Globe, Copyright } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import LanguageSelector from '../common/LanguageSelector';
import EyeLogo from '../common/EyeLogo';

interface FooterLink {
  labelKey: string;
  to: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface TabItem {
  id: string;
  icon: React.ReactNode;
  title: string;
}

const SideFooter: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('language');
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const legalLinks: FooterLink[] = [
    { labelKey: 'footer.privacy', to: '/privacy', icon: <Shield size={14} /> },
    { labelKey: 'footer.terms', to: '/terms', icon: <FileText size={14} /> },
    { labelKey: 'footer.cookies', to: '#', icon: null }
  ];
  
  const contactLinks: FooterLink[] = [
    { labelKey: 'footer.email', to: 'mailto:info@lkhn.com', icon: <Mail size={14} />, external: true },
    { labelKey: 'footer.phone', to: 'tel:+15551234567', icon: <Smartphone size={14} />, external: true },
    { labelKey: 'footer.consultation', to: '#', icon: <ExternalLink size={14} />, external: true }
  ];

  const tabs: TabItem[] = [
    { id: 'language', icon: <Globe size={16} className="text-gold/80" />, title: t('language') || 'Language' },
    { id: 'about', icon: <Info size={16} />, title: 'About' },
    { id: 'legal', icon: <Shield size={16} />, title: 'Legal' },
    { id: 'contact', icon: <Mail size={16} />, title: 'Contact' },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 mr-3 overflow-hidden">
                <EyeLogo size={40} variant="gold" expressiveness="low" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-white">{t('app.name')}</span>
                <div className="text-xs text-neutral-500 mt-1">© {new Date().getFullYear()} {t('footer.copyright')}</div>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              {t('app.overview')}
            </p>
            <div className="text-2xs text-neutral-500 flex items-center">
              <Copyright size={12} className="mr-1" /> {new Date().getFullYear()} {t('footer.copyright')}
            </div>
          </div>
        );
      
      case 'legal':
        return (
          <div className="p-4">
            <h4 className="text-xs uppercase tracking-wider text-gold mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-4">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to}
                    className="text-xs text-neutral-400 hover:text-gold transition-colors flex items-center"
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'contact':
        return (
          <div className="p-4">
            <h4 className="text-xs uppercase tracking-wider text-gold mb-3">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              {contactLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.to}
                    className="text-xs text-neutral-400 hover:text-gold transition-colors flex items-center"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'language':
        const { language, setLanguage } = useTranslation();
        
        const languages = [
          { code: 'en', name: 'language.en' },
          { code: 'es', name: 'language.es' },
          { code: 'fr', name: 'language.fr' },
          { code: 'ht', name: 'language.ht' },
          { code: 'zh', name: 'language.zh' },
          { code: 'ja', name: 'language.ja' },
          { code: 'ru', name: 'language.ru' },
          { code: 'xh', name: 'language.xh' },
          { code: 'ar', name: 'language.ar' },
        ];
        
        const handleLanguageChange = (code: string) => {
          // Set the language
          setLanguage(code as 'en' | 'es' | 'fr' | 'zh' | 'ja' | 'ru' | 'xh' | 'ar' | 'ht');
          
          // Set RTL attribute for Arabic language
          if (code === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
          } else {
            document.documentElement.setAttribute('dir', 'ltr');
          }
        };
        
        return (
          <div className="p-4">
            <h4 className="text-xs uppercase tracking-wider text-gold mb-3">{t('language')}</h4>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`text-xs ${language === lang.code ? 'text-gold bg-navy-700/50' : 'text-neutral-400'} 
                             hover:text-gold transition-colors py-2 px-2 text-left rounded-sm
                             ${language === lang.code ? 'border-l-2 border-gold' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{ direction: lang.code === 'ar' ? 'rtl' : 'ltr' }}
                >
                  {t(lang.name)}
                </button>
              ))}
            </div>
            <div className="text-2xs text-neutral-500 mt-3 flex items-center justify-center">
              <Globe size={10} className="mr-1 opacity-50" /> {language.toUpperCase()}
            </div>
          </div>
        );
    
      default:
        return null;
    }
  };
  
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`fixed left-0 bottom-1/2 transform translate-y-1/2 z-50 p-2 
                    ${isOpen ? 'bg-navy-700' : 'bg-navy-800/90 hover:bg-navy-700/90'} 
                    border border-navy-600 transition-all duration-300
                    shadow-lg flex flex-col items-center`}
        aria-label={isOpen ? 'Close footer' : 'Open settings & language'}
      >
        {isOpen ? (
          <X size={16} className="text-gold" />
        ) : (
          <>
            <Globe size={16} className="text-gold mb-1" />
            <span className="text-2xs text-neutral-400 uppercase tracking-wider">{useTranslation().language.toUpperCase()}</span>
          </>
        )}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-40 
                    transition-all duration-300 flex
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Tab navigation */}
        <div className="bg-navy-800 border-t border-r border-b border-navy-600 shadow-lg">
          <div className="py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center w-14 py-4 group relative ${
                  activeTab === tab.id ? 'text-gold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gold"></div>
                )}
                
                {/* Icon */}
                <div 
                  className={`mb-2 transition-transform group-hover:scale-110 ${
                    activeTab === tab.id ? 'text-gold' : 'text-neutral-400 group-hover:text-white'
                  }`}
                >
                  {tab.icon}
                </div>
                
                {/* Label */}
                <span className="text-2xs uppercase tracking-wider">{tab.title}</span>
                
                {/* Active indicator dot */}
                {activeTab === tab.id && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content panel */}
        <div className="w-64 bg-navy-800/95 backdrop-blur-sm border-t border-r border-b border-navy-600 shadow-lg overflow-y-auto max-h-80">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default SideFooter;