import React, { useEffect, useState } from 'react';

interface InteractiveBackgroundProps {
  className?: string;
}

// CSS-based animated background as a fallback for Three.js
const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to window size
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate floating particles
  const particles = [];
  for (let i = 0; i < 30; i++) {
    const size = Math.random() * 20 + 10;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 20 + 20;
    const delay = Math.random() * 10;
    const color = [
      '#45B26B', '#2D81FF', '#6E56CF', '#FFB930'
    ][Math.floor(Math.random() * 4)];
    
    particles.push(
      <div 
        key={i}
        className="absolute rounded-full animate-pulse"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          background: color,
          opacity: 0.2 + Math.random() * 0.2,
          filter: 'blur(8px)',
          animation: `float ${duration}s infinite ease-in-out ${delay}s`,
          transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
    );
  }

  // Create glowing spheres that react to mouse movement
  const spheres = [
    { color: '#45B26B', size: 200, left: 20, top: 30, intensity: 0.5 },
    { color: '#2D81FF', size: 300, left: 70, top: 60, intensity: 0.3 },
    { color: '#6E56CF', size: 250, left: 50, top: 20, intensity: 0.7 }
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>
      
      {/* Particles */}
      {particles}
      
      {/* Glowing spheres */}
      {spheres.map((sphere, i) => (
        <div 
          key={i}
          className="absolute rounded-full animate-pulse blur-3xl"
          style={{
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            left: `${sphere.left}%`,
            top: `${sphere.top}%`,
            background: sphere.color,
            opacity: 0.15,
            transform: `translate(${(mousePosition.x - 0.5) * 50 * sphere.intensity}px, ${(mousePosition.y - 0.5) * 50 * sphere.intensity}px)`,
            transition: 'transform 0.6s ease-out',
          }}
        />
      ))}
      
      {/* Base gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
        style={{
          transform: `rotate(${(mousePosition.x - 0.5) * 5}deg)`,
          transition: 'transform 1s ease-out',
        }}
      />
    </div>
  );
};

export default InteractiveBackground;