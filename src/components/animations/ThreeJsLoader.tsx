import React, { useEffect } from 'react';

interface ThreeJsLoaderProps {
  onComplete?: () => void;
  progress?: number; // 0 to 1
}

// Simplified CSS-based loader as a fallback for Three.js
const ThreeJsLoader: React.FC<ThreeJsLoaderProps> = ({ onComplete, progress = 0 }) => {
  useEffect(() => {
    if (progress >= 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);
  
  // Calculate the progress degrees for the circle
  const progressDegrees = progress * 360;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative flex flex-col items-center">
        {/* Main pulsing sphere */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-40 w-40 rounded-full bg-blue-500 opacity-20 animate-ping" />
          <div className="absolute h-40 w-40 rounded-full bg-blue-500 blur-xl opacity-30" />
          <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">LKHN</span>
          </div>
        </div>
        
        {/* Progress ring */}
        <div className="absolute h-48 w-48 rounded-full">
          <div className="h-full w-full rounded-full border-4 border-green-500/20" />
          <div 
            className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-transparent border-t-green-500"
            style={{ 
              transform: `rotate(${progressDegrees}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
        
        {/* Floating particles */}
        <div className="absolute h-60 w-60">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-green-500"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `float-${i} ${Math.random() * 3 + 2}s infinite alternate ease-in-out`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-white text-lg">Loading {Math.round(progress * 100)}%</p>
      </div>
    </div>
  );
};

export default ThreeJsLoader;