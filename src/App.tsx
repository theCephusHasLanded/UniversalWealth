import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/DashboardPage';
import WealthPage from './pages/WealthPage';
import HubPage from './pages/HubPage';
import TrendCryptoPage from './pages/TrendCryptoPage';
import LificosmPage from './pages/LificosmPage';
import ForumPage from './pages/ForumPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './auth/LoginPage';
import { AuthProvider } from './auth/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './auth/ProtectedRoute';
import ThreeJsLoader from './components/animations/ThreeJsLoader';
import WelcomeScreen from './components/animations/WelcomeScreen';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
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
  const AuthenticatedApp = () => (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && <Dashboard />}
      {activeTab === 'wealth' && <WealthPage />}
      {activeTab === 'hub' && <HubPage />}
      {activeTab === 'trendcrypto' && <TrendCryptoPage />}
      {activeTab === 'lificosm' && <LificosmPage />}
      {activeTab === 'forum' && <ForumPage />}
      {activeTab === 'profile' && <ProfilePage />}
    </Layout>
  );

  return (
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
        
        {showLanding && !isLoading ? (
          <LandingPage 
            onGetStarted={handleGetStarted} 
            onSignIn={handleSignIn} 
          />
        ) : showLogin && !showWelcome ? (
          <LoginPage 
            onSuccess={handleLoginSuccess}
            onBackToLanding={() => {
              setShowLogin(false);
              setShowLanding(true);
            }}
          />
        ) : !showWelcome ? (
          <ProtectedRoute 
            fallback={<LoginPage onSuccess={handleLoginSuccess} />}
          >
            <AuthenticatedApp />
          </ProtectedRoute>
        ) : null}
      </UserProvider>
    </AuthProvider>
  );
}

export default App;