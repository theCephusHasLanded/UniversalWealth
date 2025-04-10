import React, { useState, useEffect } from 'react';
import { X, Shield, Cookie } from 'lucide-react';
import Button from './Button';

interface CookieConsentProps {
  onAccept: () => void;
  onCustomize?: () => void;
  onDecline?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onCustomize,
  onDecline,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show the banner after a delay
  useEffect(() => {
    // Check if user has already made a choice
    const hasMadeChoice = localStorage.getItem('lkhn-cookie-consent');
    
    if (!hasMadeChoice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('lkhn-cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };
  
  const handleDecline = () => {
    localStorage.setItem('lkhn-cookie-consent', 'declined');
    setIsVisible(false);
    if (onDecline) {
      onDecline();
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-navy-800/95 border-t border-navy-700 backdrop-blur-md shadow-xl">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          {/* Collapsed version */}
          {!isExpanded && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center">
                <Cookie size={18} className="text-gold flex-shrink-0 mt-1 md:mt-0 mr-3" />
                <p className="text-sm text-neutral-300 font-light">
                  <span className="text-gold mr-1">Members Only:</span> 
                  We use cookies to enhance your exclusive experience and provide personalized investment insights.
                </p>
              </div>
              
              <div className="flex items-center gap-3 ml-auto">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-gold underline"
                >
                  View Options
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAccept}
                >
                  Accept
                </Button>
              </div>
            </div>
          )}
          
          {/* Expanded version */}
          {isExpanded && (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Shield size={18} className="text-gold mr-2" />
                  <h3 className="text-sm font-medium text-white">Privacy & Cookie Preferences</h3>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-5">
                <div className="p-3 bg-navy-700 border-l border-gold">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">Essential</div>
                  <p className="text-xs text-neutral-300">
                    Required for the platform to function. Cannot be disabled.
                  </p>
                </div>
                
                <div className="p-3 bg-navy-700 border-l border-gold/60">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">Analytics</div>
                  <p className="text-xs text-neutral-300">
                    Help us improve the platform with anonymized usage data.
                  </p>
                </div>
                
                <div className="p-3 bg-navy-700 border-l border-gold/60">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">Personalization</div>
                  <p className="text-xs text-neutral-300">
                    Enable tailored investment insights and recommendations.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                >
                  Decline All
                </Button>
                {onCustomize && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onCustomize}
                  >
                    Customize
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAccept}
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;