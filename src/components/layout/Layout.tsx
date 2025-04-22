import React, { useEffect, useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import SideFooter from './SideFooter';
import InteractiveBackground from '../animations/InteractiveBackground';
import CookieConsent from '../common/CookieConsent';
import { setConsent } from 'firebase/analytics';
import { analytics } from '../../config/firebase';

interface LayoutProps {
  children?: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [showFooter, setShowFooter] = useState(true);

  // Handle cookie consent
  const handleCookieAccept = () => {
    if (analytics) {
      setConsent({
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted'
      });
    }
  };

  const handleCookieDecline = () => {
    if (analytics) {
      setConsent({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans relative">
      {/* Subtle background animation */}
      <div className="fixed inset-0 z-0 opacity-30">
        <InteractiveBackground variant="exclusive" />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="px-6 pt-8 flex-grow">
          <div className="max-w-lg mx-auto pb-24">
            {children}
          </div>
        </main>
        
        {/* Always show the main navigation bar at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Side footer - always accessible from the left */}
        <SideFooter />

        {/* Cookie consent banner */}
        <CookieConsent 
          onAccept={handleCookieAccept}
          onDecline={handleCookieDecline}
        />
      </div>
    </div>
  );
};

export default Layout;
