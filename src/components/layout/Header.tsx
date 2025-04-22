import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import NavBar from '../common/NavBar';
import { useTranslation } from '../../contexts/TranslationContext';
import { Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position for header styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`py-4 px-6 transition-all duration-300 backdrop-blur-sm ${isScrolled ? 'border-b border-navy-700 bg-navy-800/90' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <Logo size="sm" showText={true} variant="dark" />

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="text-xs text-neutral-400 uppercase tracking-widest">{t('app.tagline')}</div>
          </div>

          {/* NavBar Component */}
          <NavBar />

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-neutral-400 hover:text-gold transition-colors p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu (hidden by default) */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-navy-800/95 border border-navy-700 p-4 rounded-sm animate-fade-in">
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="text-neutral-300 hover:text-gold py-2 px-3 hover:bg-navy-700/50 rounded-sm transition-colors">
              {t('nav.overview')}
            </Link>
            <Link to="/wealth" className="text-neutral-300 hover:text-gold py-2 px-3 hover:bg-navy-700/50 rounded-sm transition-colors">
              {t('nav.wealth')}
            </Link>
            <Link to="/forum" className="text-neutral-300 hover:text-gold py-2 px-3 hover:bg-navy-700/50 rounded-sm transition-colors">
              {t('nav.forum')}
            </Link>
            <Link to="/profile" className="text-neutral-300 hover:text-gold py-2 px-3 hover:bg-navy-700/50 rounded-sm transition-colors">
              {t('nav.profile')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
