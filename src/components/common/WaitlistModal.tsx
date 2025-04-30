import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle, Lock, User, Mail, Sparkles, Clock, Gift } from 'lucide-react';
import EyeLogo from './EyeLogo';
import Button from './Button';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string, name: string) => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(0);
  const [transitionIn, setTransitionIn] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Delay to allow CSS transition to work
      setTimeout(() => setTransitionIn(true), 10);
    } else {
      setTransitionIn(false);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (submitted) {
      // Generate random waitlist position between 50-200
      setPosition(Math.floor(Math.random() * 150) + 50);
    }
  }, [submitted]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email');
      return;
    }
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    // Clear any errors
    setError('');
    
    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(email, name);
    }
    
    // Show success state
    setSubmitted(true);
  };
  
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`relative max-w-md w-full bg-gradient-to-br from-navy-950 to-navy-900 border border-navy-800 rounded-sm shadow-xl transform transition-all duration-300 overflow-hidden ${
          transitionIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        {/* Gold accent lines */}
        <div className="absolute top-0 left-8 w-24 h-0.5 bg-gold opacity-70"></div>
        <div className="absolute top-8 left-0 w-0.5 h-24 bg-gold opacity-70"></div>
        <div className="absolute bottom-0 right-8 w-24 h-0.5 bg-gold opacity-70"></div>
        <div className="absolute bottom-8 right-0 w-0.5 h-24 bg-gold opacity-70"></div>
        
        {/* Content */}
        <div className="p-8">
          {!submitted ? (
            /* Form state */
            <>
              {/* Logo and Title */}
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 mr-4 bg-navy-800 border border-gold/50 rounded-full flex items-center justify-center overflow-hidden">
                  <EyeLogo size={40} variant="gold" expressiveness="high" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <div className="h-0.5 w-6 bg-gold mr-2"></div>
                    <span className="text-xs uppercase tracking-widest text-white">LKHN</span>
                  </div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-normal tracking-widest uppercase text-white">
                      Exclusive Access
                    </h2>
                  </div>
                </div>
              </div>
              
              <h3 className="text-gold text-lg mb-2 flex items-center">
                <Lock size={16} className="mr-2" />
                Join the Waitlist
              </h3>
              
              <p className="text-neutral-300 text-sm mb-6">
                LKHN Membership is currently invite-only. Join our waitlist to be notified when new spots become available and get early access to exclusive features.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 text-red-200 text-sm rounded-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-navy-800 border border-navy-700 focus:border-gold/50 rounded-sm py-2 pl-10 pr-3 text-white outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-navy-800 border border-navy-700 focus:border-gold/50 rounded-sm py-2 pl-10 pr-3 text-white outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                    className="w-full"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </form>
              
              {/* Benefits */}
              <div className="mt-8 border-t border-navy-800 pt-6">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 mb-4 flex items-center">
                  <Sparkles size={12} className="text-gold mr-2" />
                  Membership Benefits
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'AI-powered financial insights',
                    'Exclusive investment opportunities',
                    'Community wealth-building circles',
                    'Priority access to LKHN Hub spaces',
                    'TrendCrypto premium analysis'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-neutral-300">
                      <div className="h-4 w-4 bg-navy-700 border border-gold/30 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-gold"></div>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-600/20 border border-green-500/30 rounded-full mb-6">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              
              <h3 className="text-lg text-white mb-2">You're on the list!</h3>
              
              <p className="text-neutral-300 text-sm mb-6">
                Thank you for your interest in LKHN Membership.
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl text-gold font-light mb-1">{position}</div>
                  <div className="text-xs text-neutral-400">Current Position</div>
                </div>
                
                <div className="h-10 w-px bg-navy-800"></div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-neutral-300 mb-1">
                    <Clock size={16} className="mr-1 text-gold" />
                    <span>Soon</span>
                  </div>
                  <div className="text-xs text-neutral-400">Estimated Wait</div>
                </div>
                
                <div className="h-10 w-px bg-navy-800"></div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-neutral-300 mb-1">
                    <Gift size={16} className="mr-1 text-gold" />
                    <span>5</span>
                  </div>
                  <div className="text-xs text-neutral-400">Early Perks</div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <div className="text-xs text-neutral-400 mb-2">
                  Skip the waitlist by getting invited by an existing member
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={onClose}
                >
                  Explore LKHN
                </Button>
              </div>
              
              <div className="text-center text-xs text-neutral-500">
                We'll notify you at {email} when a space becomes available.
              </div>
            </div>
          )}
        </div>
        
        {/* Animated particle background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full animate-particle-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;