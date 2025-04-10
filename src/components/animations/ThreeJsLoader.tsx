import React, { useEffect, useState } from 'react';

interface ThreeJsLoaderProps {
  onComplete?: () => void;
  progress?: number; // 0 to 1
}

// Sophisticated exclusive loader
const ThreeJsLoader: React.FC<ThreeJsLoaderProps> = ({ onComplete, progress = 0 }) => {
  const [quotes] = useState([
    "Curating your exclusive experience...",
    "Preparing your bespoke dashboard...",
    "Connecting to private investment networks...",
    "Syncing with global wealth insights...",
    "Verifying member credentials..."
  ]);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    if (progress >= 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);
  
  // Rotate through the quotes
  useEffect(() => {
    if (progress < 1) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length);
      }, 2500);
      
      return () => clearInterval(quoteInterval);
    }
  }, [progress, quotes]);
  
  // Calculate the progress for the loading bar
  const progressWidth = `${progress * 100}%`;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900">
      {/* Interactive Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sophisticated grid pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(201, 168, 97, 0.04) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(201, 168, 97, 0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Glowing orbs */}
        <div className="absolute h-80 w-80 rounded-full bg-navy-600 opacity-30 blur-3xl"
          style={{ top: '30%', left: '20%', transform: 'translate(-50%, -50%)' }}
        />
        <div className="absolute h-60 w-60 rounded-full bg-gold opacity-10 blur-3xl"
          style={{ top: '70%', left: '70%', transform: 'translate(-50%, -50%)' }}
        />
      </div>
      
      {/* Loader Content */}
      <div className="relative flex flex-col items-center px-8 max-w-md text-center z-10">
        {/* Logo */}
        <div className="mb-12 animate-fade-in">
          <div className="h-20 w-20 mx-auto bg-navy-800 border border-gold/20 flex items-center justify-center shadow-xl">
            <span className="text-3xl font-bold text-gold">L</span>
          </div>
          <h1 className="mt-5 text-base uppercase tracking-widest text-neutral-200 font-medium">
            LKHN <span className="text-gold">Universal</span> Wealth
          </h1>
        </div>
        
        {/* Loading quote */}
        <div className="h-8 mb-10">
          <p 
            key={currentQuote} 
            className="text-sm text-neutral-400 animate-fade-in font-serif"
          >
            {quotes[currentQuote]}
          </p>
        </div>
        
        {/* Sophisticated progress bar */}
        <div className="w-64 h-px bg-navy-700 mb-2 overflow-hidden">
          <div 
            className="h-full bg-gold transition-all duration-500 ease-out"
            style={{ width: progressWidth }}
          />
        </div>
        
        {/* Percentage */}
        <div className="flex justify-between w-64 text-xs text-neutral-500 uppercase tracking-widest">
          <span>Initializing</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        
        {/* Small dots indicating steps */}
        <div className="flex justify-between w-32 mt-8">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                progress * 5 > i ? 'bg-gold' : 'bg-navy-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Footer text - only show when almost done loading */}
      {progress > 0.9 && (
        <div className="absolute bottom-8 left-0 right-0 text-center animate-fade-in">
          <p className="text-gold text-xs uppercase tracking-widest">Member Access Ready</p>
        </div>
      )}
    </div>
  );
};

export default ThreeJsLoader;