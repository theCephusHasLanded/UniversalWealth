import React, { useEffect, useState } from 'react';

interface InteractiveBackgroundProps {
  className?: string;
  variant?: 'default' | 'exclusive';
}

// Enhanced CSS-based animated background for sophisticated look and feel
const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ 
  className = '',
  variant = 'default'
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to window size
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };
    
    const handleScroll = () => {
      const position = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollPosition(position);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Define color schemes based on variant
  const colorScheme = variant === 'exclusive' 
    ? {
        particles: ['#C9A861', '#0F1A2A', '#2C2C2C', '#D8D3C8'],
        spheres: [
          { color: '#0F1A2A', size: 300, left: 25, top: 30, intensity: 0.4, opacity: 0.4 },
          { color: '#C9A861', size: 240, left: 75, top: 55, intensity: 0.3, opacity: 0.2 },
          { color: '#2C2C2C', size: 350, left: 55, top: 20, intensity: 0.6, opacity: 0.3 }
        ],
        gradientFrom: 'from-navy-900/60',
        gradientTo: 'to-navy-700/40',
        patternOpacity: 0.03
      }
    : {
        particles: ['#45B26B', '#2D81FF', '#6E56CF', '#FFB930'],
        spheres: [
          { color: '#45B26B', size: 200, left: 20, top: 30, intensity: 0.5, opacity: 0.15 },
          { color: '#2D81FF', size: 300, left: 70, top: 60, intensity: 0.3, opacity: 0.15 },
          { color: '#6E56CF', size: 250, left: 50, top: 20, intensity: 0.7, opacity: 0.15 }
        ],
        gradientFrom: 'from-blue-900/20',
        gradientTo: 'to-purple-900/20',
        patternOpacity: 0.05
      };

  // Generate floating particles
  const particles = [];
  for (let i = 0; i < (variant === 'exclusive' ? 20 : 30); i++) {
    const size = Math.random() * (variant === 'exclusive' ? 15 : 20) + (variant === 'exclusive' ? 5 : 10);
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 20 + 20;
    const delay = Math.random() * 10;
    const color = colorScheme.particles[Math.floor(Math.random() * colorScheme.particles.length)];
    
    particles.push(
      <div 
        key={i}
        className={`absolute ${variant === 'exclusive' ? 'rounded-sm' : 'rounded-full'} animate-slow-pulse`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          background: color,
          opacity: variant === 'exclusive' ? 0.1 + Math.random() * 0.15 : 0.2 + Math.random() * 0.2,
          filter: `blur(${variant === 'exclusive' ? '5' : '8'}px)`,
          animation: `float ${duration}s infinite ease-in-out ${delay}s`,
          transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${variant === 'exclusive' ? 'bg-navy-800' : 'bg-black'} ${className}`}>
      
      {/* Particles */}
      {particles}
      
      {/* Glowing spheres */}
      {colorScheme.spheres.map((sphere, i) => (
        <div 
          key={i}
          className={`absolute ${variant === 'exclusive' ? 'rounded-sm' : 'rounded-full'} animate-slow-pulse blur-3xl`}
          style={{
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            left: `${sphere.left}%`,
            top: `${sphere.top}%`,
            background: sphere.color,
            opacity: sphere.opacity,
            transform: `translate(${(mousePosition.x - 0.5) * 50 * sphere.intensity}px, ${(mousePosition.y - 0.5) * 50 * sphere.intensity}px) rotate(${scrollPosition * 10}deg)`,
            transition: 'transform 0.6s ease-out',
          }}
        />
      ))}
      
      {/* Base gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradientFrom} ${colorScheme.gradientTo}`}
        style={{
          transform: `rotate(${(mousePosition.x - 0.5) * 5}deg)`,
          transition: 'transform 1s ease-out',
        }}
      />
      
      {/* Subtle grid pattern for exclusive variant */}
      {variant === 'exclusive' && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(201, 168, 97, ${colorScheme.patternOpacity}) 1px, transparent 1px), 
                             linear-gradient(to bottom, rgba(201, 168, 97, ${colorScheme.patternOpacity}) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            transform: `rotate(${(mousePosition.x - 0.5) * 2}deg)`,
            transition: 'transform 1.5s ease-out',
          }}
        />
      )}
    </div>
  );
};

export default InteractiveBackground;