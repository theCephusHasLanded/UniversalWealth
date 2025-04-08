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

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('setActiveTab', handleSetActiveTab as EventListener);

    return () => {
      window.removeEventListener('setActiveTab', handleSetActiveTab as EventListener);
    };
  }, []);

  const [showLogin, setShowLogin] = useState(false);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleSignIn = () => {
    setShowLanding(false);
    setShowLogin(true);
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
        {showLanding ? (
          <LandingPage 
            onGetStarted={handleGetStarted} 
            onSignIn={handleSignIn} 
          />
        ) : showLogin ? (
          <LoginPage 
            onSuccess={() => setShowLogin(false)}
            onBackToLanding={() => {
              setShowLogin(false);
              setShowLanding(true);
            }}
          />
        ) : (
          <ProtectedRoute 
            fallback={<LoginPage onSuccess={() => setShowLogin(false)} />}
          >
            <AuthenticatedApp />
          </ProtectedRoute>
        )}
      </UserProvider>
    </AuthProvider>
  );
}

export default App;