import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import InteractiveBackground from './InteractiveBackground';
import EyeLogo from '../common/EyeLogo';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName || 'Member';
  
  const [step, setStep] = useState(0);
  const [showExclusive, setShowExclusive] = useState(false);
  
  // Animation timeline
  useEffect(() => {
    const timeline = [
      { action: () => setStep(1), delay: 500 }, // Welcome
      { action: () => setStep(2), delay: 1000 }, // User name
      { action: () => setStep(3), delay: 800 }, // System name
      { action: () => setShowExclusive(true), delay: 1000 }, // Show exclusive features
      { action: onComplete, delay: 2500 } // Complete
    ];
    
    let timeouts: NodeJS.Timeout[] = [];
    
    let cumulativeDelay = 0;
    timeline.forEach((item) => {
      cumulativeDelay += item.delay;
      timeouts.push(setTimeout(item.action, cumulativeDelay));
    });
    
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 bg-navy-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Sophisticated background */}
      <div className="absolute inset-0 overflow-hidden">
        <InteractiveBackground variant="exclusive" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/60 to-navy-900/80 z-10"></div>
      </div>
      
      {/* Center content */}
      <div className="relative z-20 text-center px-6 max-w-lg">
        {/* Welcome message with staggered reveal */}
        <div className="mb-8">
          {step >= 1 && (
            <div className="h-24 w-24 mx-auto bg-navy-800 border border-gold/30 rounded-full flex items-center justify-center shadow-xl animate-fade-in mb-6 overflow-hidden">
              <EyeLogo size={80} variant="gold" expressiveness="high" />
            </div>
          )}
          
          {step >= 2 && (
            <div 
              className="text-2xl text-gold font-serif italic mb-2 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              Welcome back,
            </div>
          )}
          
          {step >= 2 && (
            <div 
              className="text-3xl font-medium text-white tracking-wide animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              {userName}
            </div>
          )}
          
          {step >= 3 && (
            <div 
              className="mt-4 text-sm text-neutral-300 uppercase tracking-widest animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              Your exclusive access to LKHN Universal Wealth
            </div>
          )}
        </div>
        
        {/* Exclusive features teaser */}
        {showExclusive && (
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['Wealth Analytics', 'Private Markets', 'Member Events'].map((feature, i) => (
                <div 
                  key={i} 
                  className="animate-slide-up p-3 bg-navy-700/50 border border-navy-600"
                  style={{ animationDelay: `${0.5 + (i * 0.1)}s` }}
                >
                  <div className="h-px w-6 bg-gold/50 mx-auto mb-4"></div>
                  <div className="text-xs text-neutral-200 uppercase tracking-wider">{feature}</div>
                </div>
              ))}
            </div>
            
            <div 
              className="text-xs text-gold-300 animate-fade-in opacity-0"
              style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
            >
              Preparing your personalized dashboard...
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom status indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`h-1 w-1 rounded-full transition-all duration-500 ${
                step > i ? 'bg-gold' : 'bg-navy-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;