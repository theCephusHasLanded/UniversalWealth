import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName || 'Investor';
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showSystem, setShowSystem] = useState(false);
  
  useEffect(() => {
    const timeline = [
      { action: () => setShowWelcome(true), delay: 500 },
      { action: () => setShowUser(true), delay: 1500 },
      { action: () => setShowSystem(true), delay: 2500 },
      { action: onComplete, delay: 4000 }
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
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
              }}
            />
          ))}
        </div>
        
        {/* Planet sphere */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-blue-900 to-indigo-900"
          style={{
            width: '300px',
            height: '300px',
            bottom: '-100px',
            right: '-100px',
            filter: 'blur(40px)',
            opacity: 0.4
          }}
        />
        
        {/* Glowing sphere */}
        <div
          className="absolute rounded-full bg-gradient-to-tr from-purple-600 to-blue-600"
          style={{
            width: '200px',
            height: '200px',
            top: '20%',
            left: '10%',
            filter: 'blur(60px)',
            opacity: 0.2,
            animation: 'float 20s infinite alternate ease-in-out'
          }}
        />
      </div>
      
      {/* Welcome messages */}
      <div className="z-10 flex flex-col items-center justify-center space-y-6">
        {showWelcome && (
          <div 
            className="text-4xl font-bold text-white tracking-wider opacity-0 animate-fadeIn"
            style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
          >
            WELCOME
          </div>
        )}
        
        {showUser && (
          <div 
            className="text-3xl font-medium text-green-500 tracking-wide opacity-0 animate-fadeIn"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            {userName}
          </div>
        )}
        
        {showSystem && (
          <div 
            className="text-xl text-blue-400 tracking-widest uppercase opacity-0 animate-fadeIn"
            style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
          >
            TO LKHN UNIVERSAL WEALTH
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;