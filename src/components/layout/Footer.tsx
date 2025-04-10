import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Mail, Smartphone, ArrowUp, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface FooterLink {
  labelKey: string;
  to: string;
  icon?: React.ReactNode;
  external?: boolean;
}

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
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
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  return (
    <footer className="bg-navy-800 border-t border-navy-700 py-8 mt-auto translate-z-0">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center mb-6 md:mb-0">
            <div className="h-10 w-10 mr-3 bg-navy-700 border border-gold/30 flex items-center justify-center">
              <span className="text-lg font-bold text-gold">L</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400">{t('app.name')}</span>
              <div className="text-xs text-neutral-500 mt-1">© {new Date().getFullYear()} {t('footer.copyright')}</div>
            </div>
          </div>
          
          {/* Nav Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 md:mb-0">
            {/* Legal Links */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gold mb-3">{t('footer.legal')}</h4>
              <ul className="space-y-2">
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
            
            {/* Contact Links */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gold mb-3">{t('footer.contact')}</h4>
              <ul className="space-y-2">
                {contactLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.to}
                      className="text-xs text-neutral-400 hover:text-gold transition-colors flex items-center"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.icon && <span className="mr-2">{link.icon}</span>}
                      {link.labelKey === 'footer.email' || link.labelKey === 'footer.phone' 
                        ? t(link.labelKey) 
                        : t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="h-10 w-10 bg-navy-700 hover:bg-navy-600 border border-navy-600 flex items-center justify-center transition-colors"
            aria-label={t('footer.back_to_top')}
          >
            <ArrowUp size={16} className="text-neutral-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;