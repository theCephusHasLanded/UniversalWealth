import React, { useEffect, useRef, useState } from 'react';

interface EyeLogoProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'gold' | 'light' | 'dark';
  animated?: boolean;
  expressiveness?: 'low' | 'medium' | 'high';
}

type EyeAnimation = 'none' | 'blink' | 'doubleBlink' | 'squint' | 'eyeRoll' | 'wink';

const EyeLogo: React.FC<EyeLogoProps> = ({
  size = 40,
  className = '',
  variant = 'default',
  animated = true,
  expressiveness = 'medium',
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<EyeAnimation>('none');
  const [pupilSize, setPupilSize] = useState(1); // Scale factor
  
  // Color variants
  const colors = {
    default: {
      outer: 'bg-navy-800',
      inner: 'bg-gold',
      border: 'border-gold/50',
      pupil: 'bg-navy-900',
      highlight: 'bg-white'
    },
    gold: {
      outer: 'bg-gold',
      inner: 'bg-navy-800',
      border: 'border-navy-700',
      pupil: 'bg-navy-900',
      highlight: 'bg-white'
    },
    light: {
      outer: 'bg-white',
      inner: 'bg-navy-500',
      border: 'border-navy-300',
      pupil: 'bg-navy-900',
      highlight: 'bg-white'
    },
    dark: {
      outer: 'bg-navy-900',
      inner: 'bg-gold/80',
      border: 'border-gold/30',
      pupil: 'bg-black',
      highlight: 'bg-white/90'
    }
  };
  
  const selectedColors = colors[variant];
  
  // Animation frequencies based on expressiveness
  const getAnimationFrequency = () => {
    switch (expressiveness) {
      case 'low': 
        return { minDelay: 6000, maxDelay: 10000, probability: 0.1 };
      case 'medium': 
        return { minDelay: 3000, maxDelay: 6000, probability: 0.3 };
      case 'high': 
        return { minDelay: 1500, maxDelay: 4000, probability: 0.5 };
      default: 
        return { minDelay: 3000, maxDelay: 6000, probability: 0.3 };
    }
  };
  
  // Function to trigger a random eye animation
  const triggerRandomAnimation = () => {
    if (!animated || document.hidden) return;
    
    const frequency = getAnimationFrequency();
    
    // Only trigger animation based on probability
    if (Math.random() > frequency.probability) return;
    
    // Don't start a new animation if one is already playing
    if (currentAnimation !== 'none') return;
    
    // Pick a random animation type with different probabilities
    const rand = Math.random();
    let animation: EyeAnimation = 'none';
    
    if (rand < 0.4) {
      animation = 'blink';
    } else if (rand < 0.6) {
      animation = 'doubleBlink';
    } else if (rand < 0.75) {
      animation = 'squint';
    } else if (rand < 0.9) {
      animation = 'eyeRoll';
    } else {
      animation = 'wink';
    }
    
    setCurrentAnimation(animation);
    
    // Reset animation after its duration
    const durations = {
      blink: 300,
      doubleBlink: 700,
      squint: 1500,
      eyeRoll: 1200,
      wink: 500
    };
    
    setTimeout(() => {
      setCurrentAnimation('none');
    }, durations[animation] || 300);
  };
  
  // Handle mouse movement to animate the eye
  useEffect(() => {
    if (!animated) return;
    
    // Function to update eye position based on cursor coordinates
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current || currentAnimation === 'eyeRoll') return;
      
      // Get eye element's position
      const eyeRect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;
      
      // Calculate distance from cursor to eye center
      const distanceX = e.clientX - eyeCenterX;
      const distanceY = e.clientY - eyeCenterY;
      
      // Calculate angle between cursor and eye
      const angle = Math.atan2(distanceY, distanceX);
      
      // Calculate max movement radius (25% of eye size)
      const maxRadius = size * 0.12;
      
      // Calculate distance (capped)
      const distance = Math.min(
        Math.sqrt(distanceX * distanceX + distanceY * distanceY),
        size
      );
      
      // Normalize distance to a value between 0 and 1
      const normalizedDistance = Math.min(distance / (size * 2), 1);
      
      // Calculate new position with smoother movement for longer distances
      const newX = Math.cos(angle) * maxRadius * normalizedDistance;
      const newY = Math.sin(angle) * maxRadius * normalizedDistance;
      
      // Update eye position with requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setEyePosition({ x: newX, y: newY });
      });
      
      // Set the eye as moving
      setIsMoving(true);
      
      // Dilate pupil based on how fast the cursor is moving
      const speed = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const dilation = Math.min(1.3, 1 + (speed / 1000));
      setPupilSize(dilation);
      
      // Clear the moving state after a delay for blinking animation
      clearTimeout(eyeRef.current.dataset.timeoutId as any);
      const timeoutId = setTimeout(() => {
        setIsMoving(false);
        setPupilSize(1);
      }, 150);
      eyeRef.current.dataset.timeoutId = timeoutId.toString();
    };
    
    // Function to randomly move the eye when no mouse movement
    const randomMovement = () => {
      if (document.hidden || currentAnimation !== 'none') return;
      
      // Random angle
      const angle = Math.random() * Math.PI * 2;
      
      // Random radius (less than max)
      const maxRadius = size * 0.1;
      const radius = Math.random() * maxRadius;
      
      // Calculate new position
      const newX = Math.cos(angle) * radius;
      const newY = Math.sin(angle) * radius;
      
      // Update eye position
      requestAnimationFrame(() => {
        setEyePosition({ x: newX, y: newY });
      });
      
      // Brief moving state for animation
      setIsMoving(true);
      setTimeout(() => {
        setIsMoving(false);
        // Randomly trigger an animation
        triggerRandomAnimation();
      }, 150);
    };
    
    // Set up interval for random eye movement
    const frequency = getAnimationFrequency();
    const movementInterval = 2000 + Math.random() * 2000;
    
    const intervalId = setInterval(randomMovement, movementInterval);
    
    // Set up interval for random animations independent of movement
    const animationIntervalTime = 
      Math.floor(Math.random() * (frequency.maxDelay - frequency.minDelay)) + frequency.minDelay;
    
    const animationIntervalId = setInterval(triggerRandomAnimation, animationIntervalTime);
    
    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(intervalId);
      clearInterval(animationIntervalId);
      if (eyeRef.current) {
        clearTimeout(Number(eyeRef.current.dataset.timeoutId));
      }
    };
  }, [animated, size, currentAnimation]);
  
  // Perform eye roll animation
  useEffect(() => {
    if (currentAnimation === 'eyeRoll') {
      // Sequence of positions to create a circular movement
      const eyeRollPositions = [
        { x: 0, y: -size * 0.12 },  // Look up
        { x: size * 0.12, y: -size * 0.08 },  // Up-right
        { x: size * 0.12, y: 0 },  // Look right
        { x: size * 0.12, y: size * 0.08 },  // Down-right
        { x: 0, y: size * 0.12 },  // Look down
        { x: -size * 0.12, y: size * 0.08 },  // Down-left
        { x: -size * 0.12, y: 0 },  // Look left
        { x: -size * 0.12, y: -size * 0.08 },  // Up-left
        { x: 0, y: 0 }  // Back to center
      ];

      // Animate through each position
      let step = 0;
      const animateRoll = () => {
        if (step < eyeRollPositions.length) {
          setEyePosition(eyeRollPositions[step]);
          step++;
          setTimeout(animateRoll, 100);
        }
      };
      
      animateRoll();
    }
  }, [currentAnimation, size]);
  
  // Calculate sizes for different eye parts
  const outerSize = size;
  const innerSize = size * 0.6;
  const baseRawPupilSize = innerSize * 0.5;
  const highlightSize = baseRawPupilSize * 0.3;
  
  // Dynamic styles based on current animation
  const getEyelidStyle = () => {
    let eyelidClass = 'scale-y-0';
    
    switch (currentAnimation) {
      case 'blink':
        eyelidClass = 'animate-blink';
        break;
      case 'doubleBlink':
        eyelidClass = 'animate-double-blink';
        break;
      case 'squint':
        eyelidClass = 'animate-squint';
        break;
      case 'wink':
        eyelidClass = 'animate-wink';
        break;
      default:
        eyelidClass = 'scale-y-0';
    }
    
    return eyelidClass;
  };
  
  return (
    <div 
      ref={eyeRef}
      className={`relative ${className}`}
      style={{ width: outerSize, height: outerSize }}
    >
      {/* Eye outer */}
      <div 
        className={`absolute inset-0 rounded-full ${selectedColors.outer} border ${selectedColors.border} shadow-inner overflow-hidden`}
        style={{ width: outerSize, height: outerSize }}
      >
        {/* Eye inner (iris) - this moves */}
        <div 
          className={`absolute ${selectedColors.inner} rounded-full transform transition-transform duration-150`}
          style={{ 
            width: innerSize,
            height: innerSize,
            top: (outerSize - innerSize) / 2,
            left: (outerSize - innerSize) / 2,
            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` 
          }}
        >
          {/* Pupil */}
          <div 
            className={`absolute ${selectedColors.pupil} rounded-full transform transition-all duration-200`}
            style={{ 
              width: baseRawPupilSize,
              height: baseRawPupilSize,
              top: (innerSize - baseRawPupilSize) / 2,
              left: (innerSize - baseRawPupilSize) / 2,
              transform: `scale(${isMoving ? pupilSize : currentAnimation === 'squint' ? 0.7 : 1})` 
            }}
          >
            {/* Highlight */}
            <div 
              className={`absolute ${selectedColors.highlight} rounded-full opacity-80`}
              style={{ 
                width: highlightSize,
                height: highlightSize,
                top: baseRawPupilSize * 0.2,
                left: baseRawPupilSize * 0.6
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Top eyelid */}
      <div 
        className={`absolute inset-0 w-full h-full bg-navy-900 origin-top
                    transition-transform duration-100 z-10 rounded-full
                    ${getEyelidStyle()}`}
      />
      
      {/* Bottom eyelid - appears during squint */}
      {currentAnimation === 'squint' && (
        <div 
          className="absolute inset-0 w-full h-full bg-navy-900 origin-bottom
                    z-10 rounded-full animate-squint-bottom"
        />
      )}
      
      {/* Wink eyelid (uneven close) */}
      {currentAnimation === 'wink' && (
        <div 
          className="absolute inset-0 w-full h-full bg-navy-900 origin-bottom-left
                    z-10 rounded-full skew-x-12 animate-wink"
        />
      )}
    </div>
  );
};

export default EyeLogo;