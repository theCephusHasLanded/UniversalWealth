import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface InteractiveAvatarProps {
  userId: string;
  displayName: string;
  photoURL?: string;
  size?: number;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'gold' | 'light' | 'dark';
}

const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  userId,
  displayName,
  photoURL,
  size = 40,
  className = '',
  interactive = true,
  variant = 'default'
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const [movement, setMovement] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Generate a color based on userId for consistency
  const generateColor = (id: string): string => {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    
    // LKHN color palette
    const colors = [
      '#45B26B', // Green
      '#2D81FF', // Blue
      '#6E56CF', // Purple
      '#E44A66', // Red
      '#FFB930', // Yellow 
      '#FF5C00', // Orange
      '#00C8BC', // Teal
      '#8E24AA', // Deep Purple
      '#C9A861', // Gold
      '#5E35B1'  // Indigo
    ];
    
    // Use hash to select a color
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Generate pattern based on userId
  const getPatternAndColor = () => {
    // Use hash of userId to determine pattern type
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const patternType = hash % 10; // 10 different pattern types for more diversity
    
    // Primary color from userId
    const primaryColor = generateColor(userId);
    
    // Create a slightly darker shade for secondary color
    const darkenColor = (hex: string, factor = 0.8) => {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Darken
      r = Math.floor(r * factor);
      g = Math.floor(g * factor);
      b = Math.floor(b * factor);
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    // Create a lighter shade for tertiary color
    const lightenColor = (hex: string, factor = 0.3) => {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Lighten (by adding white)
      r = Math.min(255, r + Math.floor((255 - r) * factor));
      g = Math.min(255, g + Math.floor((255 - g) * factor));
      b = Math.min(255, b + Math.floor((255 - b) * factor));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    const secondaryColor = darkenColor(primaryColor);
    const tertiaryColor = lightenColor(primaryColor);
    
    // Get a complementary color
    const getComplementaryColor = (hex: string) => {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Invert the colors (255 - value)
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    const complementaryColor = getComplementaryColor(primaryColor);
    
    let patternStyles;
    switch (patternType) {
      case 0: // Gradient
        patternStyles = {
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          children: []
        };
        break;
      case 1: // Circles
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'circle', size: '70%', top: '10%', left: '10%', color: secondaryColor, opacity: 0.6 },
            { type: 'circle', size: '40%', top: '50%', left: '60%', color: secondaryColor, opacity: 0.9 }
          ]
        };
        break;
      case 2: // Triangles
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'triangle', width: '60%', height: '60%', top: '20%', left: '20%', color: secondaryColor, opacity: 0.7, rotation: 0 },
            { type: 'triangle', width: '40%', height: '40%', top: '30%', left: '30%', color: secondaryColor, opacity: 0.9, rotation: 180 }
          ]
        };
        break;
      case 3: // Stripes
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'stripe', height: '20%', top: '20%', color: secondaryColor, opacity: 0.7 },
            { type: 'stripe', height: '20%', top: '60%', color: secondaryColor, opacity: 0.7 }
          ]
        };
        break;
      case 4: // Initials
        const initials = displayName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'text', text: initials, color: '#FFFFFF', fontSize: `${size / 2.5}px` }
          ]
        };
        break;
      case 5: // Grid
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'grid', color: secondaryColor, opacity: 0.7, lines: 3 }
          ]
        };
        break;
      case 6: // Concentric circles
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'circle', size: '90%', top: '5%', left: '5%', color: secondaryColor, opacity: 0.4 },
            { type: 'circle', size: '70%', top: '15%', left: '15%', color: tertiaryColor, opacity: 0.5 },
            { type: 'circle', size: '50%', top: '25%', left: '25%', color: secondaryColor, opacity: 0.6 },
            { type: 'circle', size: '30%', top: '35%', left: '35%', color: tertiaryColor, opacity: 0.7 }
          ]
        };
        break;
      case 7: // Checkered
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'checkerboard', color: secondaryColor, opacity: 0.7, count: 4 }
          ]
        };
        break;
      case 8: // Split color with diagonal line
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'diagonal', color: secondaryColor, opacity: 1.0, direction: 'top-left' }
          ]
        };
        break;
      case 9: // Dot matrix
        patternStyles = {
          background: primaryColor,
          children: [
            { type: 'dotmatrix', color: complementaryColor, opacity: 0.8, size: '12%', gap: 25 }
          ]
        };
        break;
      default:
        patternStyles = {
          background: primaryColor,
          children: []
        };
    }
    
    return patternStyles;
  };
  
  // Handle mouse movement to animate the avatar
  useEffect(() => {
    if (!interactive || !avatarRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current || !isHovered) return;
      
      // Get avatar position
      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Normalize the movement (max 3px)
      const maxDistance = rect.width / 2;
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      
      const movementScale = 3; // max 3px movement
      const newX = (mouseX / maxDistance) * movementScale * normalizedDistance;
      const newY = (mouseY / maxDistance) * movementScale * normalizedDistance;
      
      // Update movement with smooth transition
      setMovement({ x: newX, y: newY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, isHovered]);
  
  // Advanced random animations for interactivity
  useEffect(() => {
    if (!interactive) return;
    
    // Animation types
    const animations = [
      // Simple movement
      () => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 1 + Math.random() * 2; // 1-3px movement
        const newX = Math.cos(angle) * distance;
        const newY = Math.sin(angle) * distance;
        
        // Apply movement with animation
        setMovement({ x: newX, y: newY });
        
        // Reset after animation
        setTimeout(() => {
          setMovement({ x: 0, y: 0 });
          setIsAnimating(false);
        }, 500);
      },
      
      // Pulse effect (subtle zoom in/out)
      () => {
        // We'll use CSS animations for this, just trigger a class change
        // The movement is used as a trigger for the CSS animation
        setMovement({ x: 0.1, y: 0.1 }); // Tiny movement to trigger animation
        
        // Reset after animation
        setTimeout(() => {
          setMovement({ x: 0, y: 0 });
          setIsAnimating(false);
        }, 800);
      },
      
      // Circular motion
      () => {
        const duration = 800;
        const radius = 1.5;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          
          if (progress >= 1) {
            clearInterval(intervalId);
            setMovement({ x: 0, y: 0 });
            setIsAnimating(false);
            return;
          }
          
          // Circular motion
          const angle = progress * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          setMovement({ x, y });
        }, 16); // ~60fps
        
        // Safety cleanup
        setTimeout(() => {
          clearInterval(intervalId);
          setMovement({ x: 0, y: 0 });
          setIsAnimating(false);
        }, duration + 100);
      },
      
      // Shake effect (like disagreeing)
      () => {
        const duration = 400;
        const intensity = 1.5;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          
          if (progress >= 1) {
            clearInterval(intervalId);
            setMovement({ x: 0, y: 0 });
            setIsAnimating(false);
            return;
          }
          
          // Shake horizontally with decreasing amplitude
          const amplitude = intensity * (1 - progress);
          const x = amplitude * Math.sin(progress * Math.PI * 8);
          
          setMovement({ x, y: 0 });
        }, 16); // ~60fps
        
        // Safety cleanup
        setTimeout(() => {
          clearInterval(intervalId);
          setMovement({ x: 0, y: 0 });
          setIsAnimating(false);
        }, duration + 100);
      },
      
      // Nod effect (like agreeing)
      () => {
        const duration = 500;
        const intensity = 1;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          
          if (progress >= 1) {
            clearInterval(intervalId);
            setMovement({ x: 0, y: 0 });
            setIsAnimating(false);
            return;
          }
          
          // Vertical nod with decreasing amplitude
          const amplitude = intensity * (1 - progress);
          const y = amplitude * Math.sin(progress * Math.PI * 6);
          
          setMovement({ x: 0, y });
        }, 16); // ~60fps
        
        // Safety cleanup
        setTimeout(() => {
          clearInterval(intervalId);
          setMovement({ x: 0, y: 0 });
          setIsAnimating(false);
        }, duration + 100);
      }
    ];
    
    const startRandomAnimation = () => {
      // Only animate if not already animating and not hovered
      // Higher chance for smaller avatars to animate to draw attention
      const animationThreshold = size < 40 ? 0.5 : 0.7;
      
      if (!isAnimating && !isHovered && Math.random() > animationThreshold) {
        setIsAnimating(true);
        
        // Choose a random animation type
        const animationIndex = Math.floor(Math.random() * animations.length);
        animations[animationIndex]();
      }
    };
    
    // Set up interval for random animations
    // More frequent animations for smaller avatars
    const intervalDuration = size < 40 ? 
      2000 + Math.random() * 1000 : 
      4000 + Math.random() * 2000;
      
    const interval = setInterval(startRandomAnimation, intervalDuration);
    return () => clearInterval(interval);
  }, [interactive, isAnimating, isHovered, size]);
  
  // Render user profile photo if available
  if (photoURL) {
    return (
      <div 
        ref={avatarRef}
        className={`rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMovement({ x: 0, y: 0 });
        }}
      >
        <div 
          className="w-full h-full transition-transform duration-300"
          style={{ 
            transform: `translate(${movement.x}px, ${movement.y}px)`,
          }}
        >
          <img 
            src={photoURL}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.parentElement!.classList.add('bg-navy-700', 'flex', 'items-center', 'justify-center');
            }}
          />
        </div>
      </div>
    );
  }
  
  // Get pattern styles
  const patternStyles = getPatternAndColor();
  
  // Render generated pattern avatar
  return (
    <div 
      ref={avatarRef}
      className={`rounded-full overflow-hidden ${className} relative shadow-inner`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMovement({ x: 0, y: 0 });
      }}
    >
      <div 
        className="w-full h-full transition-all duration-300 relative flex items-center justify-center rounded-full overflow-hidden"
        style={{ 
          background: patternStyles.background,
          transform: `translate(${movement.x}px, ${movement.y}px) scale(${isHovered ? 1.05 : 1})`,
        }}
      >
        {/* Pattern elements based on pattern type */}
        {patternStyles.children.map((child, index) => {
          switch (child.type) {
            case 'circle':
              return (
                <div 
                  key={index}
                  className="absolute rounded-full"
                  style={{
                    width: child.size,
                    height: child.size,
                    top: child.top,
                    left: child.left,
                    backgroundColor: child.color,
                    opacity: child.opacity,
                    transition: 'transform 0.3s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              );
            case 'triangle':
              return (
                <div 
                  key={index}
                  className="absolute"
                  style={{
                    width: child.width,
                    height: child.height,
                    top: child.top,
                    left: child.left,
                    opacity: child.opacity,
                    transition: 'transform 0.3s ease',
                    transform: `rotate(${child.rotation}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    backgroundColor: child.color
                  }}
                />
              );
            case 'stripe':
              return (
                <div 
                  key={index}
                  className="absolute left-0 right-0"
                  style={{
                    height: child.height,
                    top: child.top,
                    backgroundColor: child.color,
                    opacity: child.opacity,
                    transition: 'transform 0.3s ease',
                    transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)'
                  }}
                />
              );
            case 'text':
              return (
                <div 
                  key={index}
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{
                    color: child.color,
                    fontSize: child.fontSize,
                    fontWeight: 'bold',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {child.text}
                </div>
              );
            case 'grid':
              return (
                <div 
                  key={index}
                  className="absolute inset-0"
                  style={{ opacity: child.opacity }}
                >
                  {Array.from({ length: child.lines }).map((_, i) => (
                    <div 
                      key={`h-${i}`}
                      className="absolute left-0 right-0"
                      style={{
                        height: '1px',
                        top: `${(i + 1) * (100 / (child.lines + 1))}%`,
                        backgroundColor: child.color,
                        transition: 'transform 0.3s ease',
                        transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)'
                      }}
                    />
                  ))}
                  {Array.from({ length: child.lines }).map((_, i) => (
                    <div 
                      key={`v-${i}`}
                      className="absolute top-0 bottom-0"
                      style={{
                        width: '1px',
                        left: `${(i + 1) * (100 / (child.lines + 1))}%`,
                        backgroundColor: child.color,
                        transition: 'transform 0.3s ease',
                        transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)'
                      }}
                    />
                  ))}
                </div>
              );
            case 'checkerboard':
              return (
                <div 
                  key={index}
                  className="absolute inset-0"
                  style={{ opacity: child.opacity }}
                >
                  {Array.from({ length: child.count * child.count }).map((_, i) => {
                    const row = Math.floor(i / child.count);
                    const col = i % child.count;
                    // Only render every other square
                    if ((row + col) % 2 === 0) return null;
                    
                    return (
                      <div 
                        key={`check-${i}`}
                        className="absolute"
                        style={{
                          width: `${100 / child.count}%`,
                          height: `${100 / child.count}%`,
                          top: `${row * (100 / child.count)}%`,
                          left: `${col * (100 / child.count)}%`,
                          backgroundColor: child.color,
                          transition: 'transform 0.3s ease',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                      />
                    );
                  })}
                </div>
              );
            case 'diagonal':
              return (
                <div 
                  key={index}
                  className="absolute inset-0 overflow-hidden"
                  style={{ opacity: child.opacity }}
                >
                  <div 
                    className="absolute"
                    style={{
                      width: '150%',
                      height: '150%',
                      top: child.direction === 'top-left' ? '-25%' : '-25%',
                      left: '-25%',
                      backgroundColor: child.color,
                      transform: `rotate(${child.direction === 'top-left' ? '45deg' : '-45deg'}) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
                      transition: 'transform 0.3s ease',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              );
            case 'dotmatrix':
              const dotSize = child.size;
              const gap = child.gap; // Percentage gap between dots
              
              // Calculate number of dots that can fit
              const dotsPerRow = Math.floor(100 / (parseInt(dotSize) + gap));
              
              return (
                <div 
                  key={index}
                  className="absolute inset-0"
                  style={{ opacity: child.opacity }}
                >
                  {Array.from({ length: dotsPerRow * dotsPerRow }).map((_, i) => {
                    const row = Math.floor(i / dotsPerRow);
                    const col = i % dotsPerRow;
                    
                    return (
                      <div 
                        key={`dot-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: dotSize,
                          height: dotSize,
                          top: `${row * (parseInt(dotSize) + gap) + gap/2}%`,
                          left: `${col * (parseInt(dotSize) + gap) + gap/2}%`,
                          backgroundColor: child.color,
                          transition: 'transform 0.3s ease',
                          transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
                    );
                  })}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
      
      {/* Enhanced shine effects */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{ 
          opacity: isHovered ? 0.25 : 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)'
        }}
      />
      
      {/* Subtle edge highlight */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ 
          boxShadow: isHovered 
            ? 'inset 0 0 0 1px rgba(255,255,255,0.3), 0 0 10px rgba(255,215,0,0.3)' 
            : 'inset 0 0 0 1px rgba(255,255,255,0.1)',
          transition: 'box-shadow 0.3s ease'
        }}
      />
      
      {/* Animated shimmer effect */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{ opacity: isAnimating ? 0.15 : 0 }}
      >
        <div 
          className="absolute inset-0 -rotate-45"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: isAnimating ? 'shimmer 1.5s ease-in-out' : 'none',
            backgroundSize: '200% 100%',
            backgroundPosition: isAnimating ? 'right' : 'left',
            transition: 'background-position 1.5s ease-in-out'
          }}
        />
      </div>
    </div>
  );
};

export default InteractiveAvatar;