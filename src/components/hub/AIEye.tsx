import React, { useEffect, useRef, useState } from 'react';

interface AIEyeProps {
  type: 'rhythm' | 'nexus' | 'serenity';
  size?: number;
  className?: string;
  animated?: boolean;
  expressiveness?: 'low' | 'medium' | 'high';
  following?: boolean;
  speaking?: boolean;
}

type EyeAnimation = 'none' | 'blink' | 'doubleBlink' | 'squint' | 'eyeRoll' | 'wink' | 'pulsate' | 'flutter' | 'slowBlink';

const AIEye: React.FC<AIEyeProps> = ({
  type,
  size = 60,
  className = '',
  animated = true,
  expressiveness = 'medium',
  following = true,
  speaking = false,
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<EyeAnimation>('none');
  const [pupilSize, setPupilSize] = useState(1); // Scale factor
  const [pulsateIntensity, setPulsateIntensity] = useState(0);
  
  // Color configurations for each AI type
  const colorConfigs = {
    rhythm: {
      outer: 'bg-purple-900',
      inner: 'bg-purple-600',
      border: 'border-purple-500',
      pupil: 'bg-black',
      highlight: 'bg-white',
      hue: '#7C3AED', // Vibrant purple
      glow: 'shadow-[0_0_15px_rgba(124,58,237,0.5)]',
    },
    nexus: {
      outer: 'bg-blue-800',
      inner: 'bg-blue-500',
      border: 'border-blue-400',
      pupil: 'bg-black',
      highlight: 'bg-white',
      hue: '#3B82F6', // Vibrant blue
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    },
    serenity: {
      outer: 'bg-green-800',
      inner: 'bg-green-600',
      border: 'border-green-500',
      pupil: 'bg-black',
      highlight: 'bg-white',
      hue: '#10B981', // Calming green
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    }
  };
  
  const selectedColors = colorConfigs[type];
  
  // Animation frequencies and patterns based on AI type
  const getAnimationConfig = () => {
    switch (type) {
      case 'rhythm':
        // Rhythm: More frequent, energetic animations with pulsing
        return { 
          minDelay: 800, 
          maxDelay: 2000, 
          probability: 0.7,
          animations: ['blink', 'doubleBlink', 'pulsate'],
          probabilities: [0.2, 0.3, 0.5], // Higher chance of pulsate
          durations: {
            blink: 150, // Faster blink
            doubleBlink: 400, // Faster double blink
            pulsate: 1500, // Longer pulsate
          }
        };
      case 'nexus':
        // Nexus: Social, engaging animations with winks and fluttering
        return { 
          minDelay: 1200, 
          maxDelay: 3000, 
          probability: 0.5,
          animations: ['blink', 'wink', 'flutter', 'eyeRoll'],
          probabilities: [0.2, 0.3, 0.3, 0.2], // Higher chance of wink and flutter
          durations: {
            blink: 200,
            wink: 350,
            flutter: 800,
            eyeRoll: 1200,
          }
        };
      case 'serenity':
        // Serenity: Calm, slow, deliberate movements
        return { 
          minDelay: 3000, 
          maxDelay: 8000, 
          probability: 0.3,
          animations: ['slowBlink', 'blink', 'squint'],
          probabilities: [0.6, 0.3, 0.1], // Higher chance of slow blink
          durations: {
            slowBlink: 800, // Very slow, calming blink
            blink: 300, // Normal blink
            squint: 1000, // Thoughtful squint
          }
        };
      default:
        return { 
          minDelay: 2000, 
          maxDelay: 4000, 
          probability: 0.4,
          animations: ['blink', 'doubleBlink'],
          probabilities: [0.7, 0.3],
          durations: {
            blink: 200,
            doubleBlink: 500,
          }
        };
    }
  };
  
  // Function to trigger animations specific to AI type
  const triggerAnimation = () => {
    if (!animated || document.hidden || speaking) return;
    
    const config = getAnimationConfig();
    
    // Only trigger animation based on probability
    if (Math.random() > config.probability) return;
    
    // Don't start a new animation if one is already playing
    if (currentAnimation !== 'none') return;
    
    // Select animation based on weighted probabilities
    const rand = Math.random();
    let selectedIndex = 0;
    let cumulativeProbability = 0;
    
    for (let i = 0; i < config.animations.length; i++) {
      cumulativeProbability += config.probabilities[i];
      if (rand < cumulativeProbability) {
        selectedIndex = i;
        break;
      }
    }
    
    const animation = config.animations[selectedIndex] as EyeAnimation;
    setCurrentAnimation(animation);
    
    // Reset animation after its duration
    const durations = config.durations || {
      blink: 200, 
      doubleBlink: 500, 
      squint: 1000, 
      eyeRoll: 1200, 
      wink: 400, 
      pulsate: 1200, 
      flutter: 800, 
      slowBlink: 700
    };
    
    setTimeout(() => {
      setCurrentAnimation('none');
    }, durations[animation] || 300);
  };
  
  // Handle mouse movement to animate the eye
  useEffect(() => {
    if (!animated || !following) return;
    
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
      
      // Calculate max movement radius based on AI type
      const maxRadius = type === 'nexus' ? size * 0.15 : // Nexus is more attentive and looks further
                      type === 'rhythm' ? size * 0.12 : // Rhythm is energetic and responsive
                      size * 0.08; // Serenity is calmer and more centered
      
      // Calculate distance (capped)
      const distance = Math.min(
        Math.sqrt(distanceX * distanceX + distanceY * distanceY),
        size * 2
      );
      
      // Normalize distance to a value between 0 and 1
      const normalizedDistance = Math.min(distance / (size * 2), 1);
      
      // Calculate new position with smoother movement based on AI type
      const movementFactor = type === 'rhythm' ? 0.9 : // Quick movements
                            type === 'nexus' ? 0.8 : // Responsive movements
                            0.5; // Slow, deliberate movements for Serenity
      
      const newX = Math.cos(angle) * maxRadius * normalizedDistance * movementFactor;
      const newY = Math.sin(angle) * maxRadius * normalizedDistance * movementFactor;
      
      // Update eye position with requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setEyePosition({ x: newX, y: newY });
      });
      
      // Set the eye as moving
      setIsMoving(true);
      
      // Dilate pupil based on how fast the cursor is moving and AI type
      const speed = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const dilationBase = type === 'nexus' ? 1.1 : // Nexus is more interested and dilates more
                         type === 'rhythm' ? 1.0 : // Rhythm has normal dilation
                         0.9; // Serenity maintains more even pupil size
      
      const dilation = Math.min(1.4, dilationBase + (speed / 1000));
      setPupilSize(dilation);
      
      // Clear the moving state after a delay based on AI type
      clearTimeout(eyeRef.current.dataset.timeoutId as any);
      const timeoutId = setTimeout(() => {
        setIsMoving(false);
        setPupilSize(1);
      }, type === 'serenity' ? 300 : 150); // Serenity moves more slowly
      
      eyeRef.current.dataset.timeoutId = timeoutId.toString();
    };
    
    // Function to randomly move the eye when no mouse movement
    const randomMovement = () => {
      if (document.hidden || currentAnimation !== 'none' || speaking) return;
      
      // Random angle, with weighted tendencies based on AI type
      let angle;
      
      if (type === 'rhythm') {
        // Rhythm tends to look all around energetically
        angle = Math.random() * Math.PI * 2;
      } else if (type === 'nexus') {
        // Nexus tends to look more horizontally, connecting with others
        const horizontal = Math.random() * Math.PI - Math.PI/2;
        const vertical = (Math.random() - 0.5) * Math.PI * 0.5;
        angle = horizontal + vertical;
      } else {
        // Serenity tends to look more up and down, introspectively
        const vertical = Math.random() * Math.PI - Math.PI/2;
        const horizontal = (Math.random() - 0.5) * Math.PI * 0.3;
        angle = vertical + horizontal;
      }
      
      // Random radius (less than max)
      const maxRadius = type === 'rhythm' ? size * 0.12 :
                      type === 'nexus' ? size * 0.1 :
                      size * 0.07;
                      
      const radius = Math.random() * maxRadius;
      
      // Calculate new position
      const newX = Math.cos(angle) * radius;
      const newY = Math.sin(angle) * radius;
      
      // Update eye position with different transition speeds
      requestAnimationFrame(() => {
        setEyePosition({ x: newX, y: newY });
      });
      
      // Brief moving state for animation
      setIsMoving(true);
      setTimeout(() => {
        setIsMoving(false);
        // Randomly trigger an animation
        if (Math.random() < 0.3) {
          triggerAnimation();
        }
      }, type === 'serenity' ? 300 : 150);
    };
    
    // Set up interval for random eye movement based on AI type
    const config = getAnimationConfig();
    const baseMovementInterval = type === 'rhythm' ? 1500 :
                               type === 'nexus' ? 2000 :
                               3000;
    
    const movementInterval = baseMovementInterval + Math.random() * 1000;
    const intervalId = setInterval(randomMovement, movementInterval);
    
    // Set up interval for random animations independent of movement
    const animationIntervalTime = 
      Math.floor(Math.random() * (config.maxDelay - config.minDelay)) + config.minDelay;
    
    const animationIntervalId = setInterval(triggerAnimation, animationIntervalTime);
    
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
  }, [animated, size, currentAnimation, type, following, speaking]);
  
  // Special animations for each AI type
  useEffect(() => {
    if (currentAnimation === 'eyeRoll') {
      // Eye roll animation (used by all types, but most common in Nexus)
      const positions = [
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
      
      let step = 0;
      const animateRoll = () => {
        if (step < positions.length) {
          setEyePosition(positions[step]);
          step++;
          setTimeout(animateRoll, 100);
        }
      };
      
      animateRoll();
    } else if (currentAnimation === 'pulsate') {
      // Pulsate animation (primarily for Rhythm) - pupil expands and contracts rhythmically
      const pulsateSteps = 10;
      let step = 0;
      const maxIntensity = 0.3;
      
      const animatePulsate = () => {
        if (currentAnimation !== 'pulsate') return;
        
        // Sine wave pattern for smooth pulsation
        const intensity = maxIntensity * Math.sin((step / pulsateSteps) * Math.PI);
        setPulsateIntensity(intensity);
        
        step = (step + 1) % (pulsateSteps * 2);
        
        if (step < pulsateSteps * 2) {
          requestAnimationFrame(animatePulsate);
        }
      };
      
      animatePulsate();
    } else if (currentAnimation === 'flutter') {
      // Flutter animation (primarily for Nexus) - rapid blinking with movement
      const flutterCount = 3;
      let count = 0;
      
      const animateFlutter = () => {
        if (count < flutterCount * 2) {
          setCurrentAnimation(count % 2 === 0 ? 'blink' : 'none');
          count++;
          setTimeout(animateFlutter, 100);
        } else {
          setCurrentAnimation('none');
        }
      };
      
      animateFlutter();
    } else if (currentAnimation === 'slowBlink') {
      // Slow blink animation (primarily for Serenity) - very deliberate eye close and open
      setTimeout(() => {
        setCurrentAnimation('none');
      }, 800);
    }
  }, [currentAnimation, size, type]);
  
  // Speaking animation
  useEffect(() => {
    if (speaking) {
      const speakingAnimation = () => {
        // Different speaking patterns based on AI type
        if (type === 'rhythm') {
          // Rhythm has energetic, musical pulsing when speaking
          const intensity = 0.15 * Math.sin(Date.now() / 100);
          setPulsateIntensity(intensity);
          
          // Occasional quick blinks during speech
          if (Math.random() < 0.01) {
            setCurrentAnimation('blink');
            setTimeout(() => setCurrentAnimation('none'), 150);
          }
        } else if (type === 'nexus') {
          // Nexus has more expressive movements when speaking
          if (Math.random() < 0.005) {
            setCurrentAnimation('flutter');
            setTimeout(() => setCurrentAnimation('none'), 400);
          } else if (Math.random() < 0.003) {
            setCurrentAnimation('eyeRoll');
            setTimeout(() => setCurrentAnimation('none'), 1000);
          }
          
          // Subtle looking around
          if (Math.random() < 0.02) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size * 0.1;
            setEyePosition({
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius
            });
          }
        } else {
          // Serenity has calm, slow movements when speaking
          if (Math.random() < 0.003) {
            setCurrentAnimation('slowBlink');
            setTimeout(() => setCurrentAnimation('none'), 800);
          }
          
          // Very subtle movements
          if (Math.random() < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size * 0.05;
            setEyePosition({
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius
            });
          }
        }
        
        if (speaking) {
          requestAnimationFrame(speakingAnimation);
        }
      };
      
      requestAnimationFrame(speakingAnimation);
    } else {
      // Reset pulsate intensity when not speaking
      setPulsateIntensity(0);
    }
    
    return () => {
      setPulsateIntensity(0);
    };
  }, [speaking, type, size]);
  
  // Calculate sizes for different eye parts
  const outerSize = size;
  const innerSize = size * 0.65;
  const baseRawPupilSize = innerSize * 0.5;
  const highlightSize = baseRawPupilSize * 0.3;
  
  // Dynamic styles based on current animation
  const getEyelidStyle = () => {
    if (currentAnimation === 'blink') {
      return 'animate-blink';
    } else if (currentAnimation === 'doubleBlink') {
      return 'animate-double-blink';
    } else if (currentAnimation === 'squint') {
      return 'animate-squint';
    } else if (currentAnimation === 'wink') {
      return 'animate-wink';
    } else if (currentAnimation === 'slowBlink') {
      return 'animate-slow-blink';
    } else {
      return 'scale-y-0';
    }
  };
  
  // Determine if the eye should glow
  const shouldGlow = speaking || type === 'rhythm' ? currentAnimation === 'pulsate' || pulsateIntensity !== 0 : false;
  
  return (
    <div 
      ref={eyeRef}
      className={`relative ${className} ${shouldGlow ? selectedColors.glow : ''} transition-shadow duration-500`}
      style={{ 
        width: outerSize, 
        height: outerSize,
        transitionTimingFunction: 'ease-in-out'
      }}
    >
      {/* Eye outer */}
      <div 
        className={`absolute inset-0 rounded-full ${selectedColors.outer} border ${selectedColors.border} shadow-inner overflow-hidden transition-all duration-300`}
        style={{ 
          width: outerSize, 
          height: outerSize,
          transform: type === 'rhythm' && (currentAnimation === 'pulsate' || pulsateIntensity !== 0) ? 
            `scale(${1 + pulsateIntensity * 0.05})` : 'scale(1)'
        }}
      >
        {/* Eye inner (iris) - this moves */}
        <div 
          className={`absolute ${selectedColors.inner} rounded-full transform transition-all`}
          style={{ 
            width: innerSize,
            height: innerSize,
            top: (outerSize - innerSize) / 2,
            left: (outerSize - innerSize) / 2,
            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
            transitionDuration: type === 'serenity' ? '400ms' : '200ms'
          }}
        >
          {/* Pupil */}
          <div 
            className={`absolute ${selectedColors.pupil} rounded-full transform transition-all`}
            style={{ 
              width: baseRawPupilSize,
              height: baseRawPupilSize,
              top: (innerSize - baseRawPupilSize) / 2,
              left: (innerSize - baseRawPupilSize) / 2,
              transform: `scale(${
                isMoving ? pupilSize : 
                currentAnimation === 'squint' ? 0.7 : 
                type === 'rhythm' && (currentAnimation === 'pulsate' || pulsateIntensity !== 0) ? 
                  1 + pulsateIntensity : 1
              })`,
              transitionDuration: type === 'rhythm' ? '100ms' : '200ms'
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
        className={`absolute inset-0 w-full h-full bg-black origin-top
                    transition-transform z-10 rounded-full
                    ${getEyelidStyle()}`}
        style={{
          transitionDuration: type === 'serenity' && currentAnimation === 'slowBlink' ? '400ms' : '150ms'
        }}
      />
      
      {/* Bottom eyelid - appears during squint */}
      {currentAnimation === 'squint' && (
        <div 
          className="absolute inset-0 w-full h-full bg-black origin-bottom
                    z-10 rounded-full animate-squint-bottom"
        />
      )}
      
      {/* Wink eyelid (uneven close) */}
      {currentAnimation === 'wink' && (
        <div 
          className="absolute inset-0 w-full h-full bg-black origin-bottom-left
                    z-10 rounded-full skew-x-12 animate-wink"
        />
      )}
    </div>
  );
};

export default AIEye;