import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Lock, LogIn, Award, Calendar, Sparkles } from 'lucide-react';
import Card from '../components/common/Card';
import FeatureCard from '../components/common/FeatureCard';
import ExclusiveButton from '../components/common/ExclusiveButton';
import InteractiveBackground from '../components/animations/InteractiveBackground';
import Testimonial from '../components/common/Testimonial';
import MembersOnlyTeaser from '../components/common/MembersOnlyTeaser';
import EyeLogo from '../components/common/EyeLogo';
import Logo from '../components/common/Logo';
import SignInButton from '../components/common/SignInButton';
import CookieConsent from '../components/common/CookieConsent';
import { useWaitlist } from '../contexts/WaitlistContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn?: () => void; // Optional, will use onGetStarted if not provided
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const { t } = useTranslation();
  const { showWaitlistModal } = useWaitlist();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [invitationCode, setInvitationCode] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Background image URLs - would be imported from public/images in a real app
  const backgroundImages = [
    '/images/landing-bg-1.jpg', 
    '/images/landing-bg-2.jpg',
    '/images/landing-bg-3.jpg',
  ];

  // Placeholder for real images - in a real app, these would be actual paths
  const placeholderImages = [
    'linear-gradient(45deg, #0F1A2A, #2C2C2C)',
    'linear-gradient(45deg, #233650, #0F1A2A)',
    'linear-gradient(45deg, #0F1A2A, #8A6D2F)',
  ];

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate background every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % placeholderImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-white">
      {/* Hero Section with interactive exclusive background */}
      <div className="h-screen relative flex items-center overflow-hidden">
        <InteractiveBackground variant="exclusive" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/10 via-navy-800/40 to-navy-900/90 z-10"></div>
        
        {/* Top navigation bar with elegant styling */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-800/90 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Logo size="sm" showText={true} variant="dark" expressiveness="high" />
              
              
              <div className="hidden md:flex items-center space-x-8">
                <button className="text-xs uppercase tracking-widest text-neutral-300 hover:text-gold transition-colors">
                  About
                </button>
                <button className="text-xs uppercase tracking-widest text-neutral-300 hover:text-gold transition-colors">
                  Ecosystem
                </button>
                <button 
                  className="text-xs uppercase tracking-widest text-neutral-300 hover:text-gold transition-colors"
                  onClick={showWaitlistModal}
                >
                  Membership
                </button>
                <SignInButton 
                  variant="outline" 
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="mb-6">
              <div className="inline-block mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-px w-8 bg-gold mr-2"></div>
                  <span className="text-xs uppercase tracking-widest text-gold">{t('app.exclusive.heading')}</span>
                  <div className="h-px w-8 bg-gold ml-2"></div>
                </div>
                <h2 className="text-base font-normal uppercase tracking-widest text-neutral-300 mb-2">
                  {t('app.exclusive.subheading')}
                </h2>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif mb-6">
                {t('app.name')}
              </h1>
              <p className="text-lg text-neutral-200 max-w-xl mx-auto">
                {t('app.overview')}
              </p>
            </div>
            
            {/* Feature points with gold accents */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 mb-10">
              <div className="flex items-center">
                <div className="h-1 w-1 bg-gold rounded-full mr-2"></div>
                <span className="text-sm text-neutral-300">{t('app.exclusive.feature1')}</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-gold rounded-full mr-2"></div>
                <span className="text-sm text-neutral-300">{t('app.exclusive.feature2')}</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-gold rounded-full mr-2"></div>
                <span className="text-sm text-neutral-300">{t('app.exclusive.feature3')}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <ExclusiveButton 
                variant="primary"
                size="lg"
                icon={<ArrowRight size={16} />}
                onClick={showWaitlistModal}
              >
                {t('app.join')}
              </ExclusiveButton>
              
              <SignInButton 
                variant="outline" 
                size="lg"
                className="min-w-32"
              />
            </div>
            
            {/* Invitation code input with elegant styling */}
            <div className="mt-12 max-w-sm mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-xs uppercase tracking-widest text-gold mb-3">{t('app.invitecode.heading')}</p>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter your invitation code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="bg-navy-700 border border-navy-500 text-neutral-200 px-4 py-3 w-full focus:outline-none focus:border-gold/50 placeholder:text-neutral-500 text-sm"
                />
                <button 
                  className="bg-gold hover:bg-gold-600 text-navy-900 px-4 py-3 text-sm uppercase tracking-wider"
                  onClick={() => {
                    if (!invitationCode.trim()) {
                      showWaitlistModal();
                    }
                  }}
                >
                  {invitationCode.trim() ? "Verify" : "Join Waitlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <div className="animate-bounce">
            <div className="w-px h-10 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gold bg-opacity-20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gold rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-navy-800 py-16 relative">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-xl uppercase tracking-widest mb-2 text-neutral-100">{t('app.testimonials.heading')}</h2>
            <div className="h-px w-16 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Testimonial
              quote={t('app.testimonial1.quote')}
              name={t('app.testimonial1.name')}
              title={t('app.testimonial1.title')}
              className="transform hover:-translate-y-1 transition-transform"
            />
            
            <Testimonial
              quote={t('app.testimonial2.quote')}
              name={t('app.testimonial2.name')}
              title={t('app.testimonial2.title')}
              className="transform hover:-translate-y-1 transition-transform md:mt-12"
            />
          </div>
        </div>
      </div>
      
      {/* Three Pillars Section - Enhanced with subtle animations */}
      <div className="bg-navy-900 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-xl uppercase tracking-widest mb-2 text-neutral-100">{t('dashboard.pillars')}</h2>
            <div className="h-px w-16 bg-gold"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              color="#C9A861"
              title={t('wealth.name')}
              description={t('wealth.description')}
              onClick={() => {}}
              className="transform hover:-translate-y-1 transition-transform"
            />
            
            <FeatureCard
              color="#6E56CF"
              title={t('hub.name')}
              description={t('hub.description')}
              onClick={() => {}}
              className="transform hover:-translate-y-1 transition-transform"
            />
            
            <FeatureCard
              color="#2D81FF"
              title={t('trendcrypto.name')}
              description={t('trendcrypto.description')}
              onClick={() => {}}
              className="transform hover:-translate-y-1 transition-transform"
            />
          </div>
        </div>
      </div>
      
      {/* Lificosm Section */}
      <div className="bg-navy-800 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div 
                className="relative aspect-video w-full overflow-hidden border border-navy-600"
                style={{ background: 'linear-gradient(45deg, #0F1A2A, #C9A861)' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-gold bg-opacity-20 flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all">
                    <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
                      <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0L12 8L0 16V0Z" fill="#0F1A2A"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="h-px w-10 bg-gold mb-6"></div>
              <h3 className="text-xl uppercase tracking-widest mb-3">{t('lificosm.name')}</h3>
              <p className="text-neutral-300 mb-6">{t('lificosm.description')}</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-navy-700 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <div className="h-1.5 w-1.5 bg-gold"></div>
                  </div>
                  <span className="text-neutral-200">Membership Program with Points</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-navy-700 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <div className="h-1.5 w-1.5 bg-gold"></div>
                  </div>
                  <span className="text-neutral-200">Local Business Integration</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-navy-700 border border-gold flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <div className="h-1.5 w-1.5 bg-gold"></div>
                  </div>
                  <span className="text-neutral-200">Community Marketplace</span>
                </li>
              </ul>
              
              <ExclusiveButton 
                variant="outline"
                size="md"
                icon={<ChevronRight size={16} />}
              >
                Explore Lificosm
              </ExclusiveButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* Members-Only Section */}
      <div className="bg-navy-900 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-xl uppercase tracking-widest mb-2 text-neutral-100">{t('app.members.heading')}</h2>
            <div className="h-px w-16 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MembersOnlyTeaser
              title={t('app.members.feature1.title')}
              description={t('app.members.feature1.desc')}
              image="/images/investment-circles.jpg"
              className="aspect-square md:aspect-auto md:h-80"
            />
            
            <MembersOnlyTeaser
              title={t('app.members.feature2.title')}
              description={t('app.members.feature2.desc')}
              image="/images/events.jpg"
              className="aspect-square md:aspect-auto md:h-80"
            />
            
            <MembersOnlyTeaser
              title={t('app.members.feature3.title')}
              description={t('app.members.feature3.desc')}
              image="/images/ai-analysis.jpg"
              className="aspect-square md:aspect-auto md:h-80"
            />
          </div>
        </div>
      </div>
      
      {/* Universal Wealth Vision - CTA Section */}
      <div className="bg-navy-800 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mx-auto mb-6">
              <div className="mx-auto w-10 h-10 mb-4 flex items-center justify-center">
                <EyeLogo size={40} variant="gold" expressiveness="medium" />
              </div>
              <h2 className="text-xl uppercase tracking-widest mb-2 text-neutral-100">{t('dashboard.universal')}</h2>
            </div>
            
            <p className="text-neutral-300 text-lg mb-10 leading-relaxed font-serif">
              A new paradigm for wealth that integrates technological innovation with human connection, 
              curated experiences with democratized access, and exclusive insights with collective benefit.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0">
              <ExclusiveButton 
                variant="primary"
                size="lg"
                icon={<ArrowRight size={16} />}
                onClick={showWaitlistModal}
              >
                {t('app.join')}
              </ExclusiveButton>
              
              <SignInButton 
                variant="outline" 
                size="lg"
                className="min-w-32"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-navy-900 border-t border-navy-700 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo size="xs" showText={true} variant="default" expressiveness="low" className="opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex space-x-6 text-neutral-400">
              <Link to="/privacy" className="text-xs uppercase tracking-widest hover:text-gold cursor-pointer transition-colors">Privacy</Link>
              <Link to="/terms" className="text-xs uppercase tracking-widest hover:text-gold cursor-pointer transition-colors">Terms</Link>
              <span className="text-xs uppercase tracking-widest hover:text-gold cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent only shown after login - moved to App.tsx */}
    </div>
  );
};

export default LandingPage;