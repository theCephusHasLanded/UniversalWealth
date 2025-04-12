import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { WealthProvider } from './contexts/WealthContext';
import AppRoutes from './routes';
import ThreeJsLoader from './components/animations/ThreeJsLoader';
import WelcomeScreen from './components/animations/WelcomeScreen';
import CookieConsent from './components/common/CookieConsent';
import FeedbackButton from './components/common/FeedbackButton';
import HubPage from './pages/HubPage';
import TrendCryptoPage from './pages/TrendCryptoPage';
import LificosmPage from './pages/LificosmPage';
import Dashboard from './pages/DashboardPage';
import ForumPage from './pages/ForumPage';
import ProfilePage from './pages/ProfilePage';
import MembershipPage from './pages/MembershipPage';
import WealthPage from './pages/WealthPage';
import Layout from './components/layout/Layout';

function App() {
  const location = useLocation();
  const [showLanding, setShowLanding] = useState(location.pathname === '/landing');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
      
      // Reset loading state and landing screen when switching tabs via event
      setIsLoading(false);
      setShowLanding(false);
      setShowLogin(false);
      setShowWelcome(false);
    };

    window.addEventListener('setActiveTab', handleSetActiveTab as EventListener);

    return () => {
      window.removeEventListener('setActiveTab', handleSetActiveTab as EventListener);
    };
  }, []);

  useEffect(() => {
    // Simulate loading progress
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + 0.01;
          if (newProgress >= 1) {
            clearInterval(interval);
            return 1;
          }
          return newProgress;
        });
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const [showLogin, setShowLogin] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Loading animation will transition to login based on progress
  };

  const handleSignIn = () => {
    setIsLoading(true);
    // Loading animation will transition to login based on progress
  };
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowLanding(false);
    setShowLogin(true);
  };
  
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowWelcome(true);
  };
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // Application main content that requires authentication
  // Note: This component is not being used since the router handles the layout now
  // Keeping it for reference
  const AuthenticatedApp = () => (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'invite' && <MembershipPage />}
      {activeTab === 'overview' && <Dashboard />}
      {activeTab === 'wealth' && (
        <WealthProvider>
          <WealthPage />
        </WealthProvider>
      )}
      {activeTab === 'hub' && <HubPage />}
      {activeTab === 'trendcrypto' && <TrendCryptoPage />}
      {activeTab === 'lificosm' && <LificosmPage />}
      {activeTab === 'forum' && <ForumPage />}
      {activeTab === 'profile' && <ProfilePage />}
    </Layout>
  );

  // Cookie consent handling
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has consented to cookies
    const hasConsented = localStorage.getItem('lkhn-cookie-consent');
    if (!hasConsented) {
      setShowCookieConsent(true);
    }
  }, []);
  
  const handleCookieConsent = () => {
    setShowCookieConsent(false);
  };
  
  // Feedback handling
  const handleFeedbackSubmit = (feedback: string, rating: number) => {
    console.log('Feedback received:', feedback, 'Rating:', rating);
    // In a real app, you would send this to your server
  };
  
  return (
    <>
      <AuthProvider>
        <UserProvider>
          {/* Three.js loading animation overlays everything else when active */}
          {isLoading && (
            <ThreeJsLoader 
              onComplete={handleLoadingComplete} 
              progress={loadingProgress} 
            />
          )}
          
          {/* Welcome screen shown after successful login */}
          {showWelcome && (
            <WelcomeScreen onComplete={handleWelcomeComplete} />
          )}
          
          {/* Main application routes */}
          <AppRoutes />
          
          {/* Feedback button */}
          <FeedbackButton onSubmit={handleFeedbackSubmit} />
          
          {/* Cookie consent banner */}
          {showCookieConsent && (
            <CookieConsent 
              onAccept={handleCookieConsent} 
              onDecline={handleCookieConsent} 
            />
          )}
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;