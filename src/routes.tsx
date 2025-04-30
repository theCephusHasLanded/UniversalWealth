import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Dashboard from './pages/DashboardPage';
import WealthPage from './pages/WealthPage';
import WealthPlanningPage from './pages/WealthPlanningPage';
import ForumPage from './pages/ForumPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ErrorPage from './pages/ErrorPage';
import LandingPage from './pages/LandingPage';
import MembershipPage from './pages/MembershipPage';
import HubPage from './pages/HubPage';
import TrendCryptoPage from './pages/TrendCryptoPage';
import LificosmPage from './pages/LificosmPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { useUser } from './contexts/UserContext';
import { WealthProvider } from './contexts/WealthContext';
import { WaitlistProvider } from './contexts/WaitlistContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { userProfile } = useUser();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Update active tab based on the current path
  useEffect(() => {
    const path = location.pathname;
    const mainPath = path.split('/')[1] || 'overview';
    
    if (mainPath === '' || mainPath === 'dashboard') {
      setActiveTab('overview');
    } else {
      setActiveTab(mainPath);
    }
  }, [location.pathname]);
  
  // Fallback component for unauthorized users
  const LoginFallback = () => {
    // Clear any stale authentication data
    localStorage.removeItem('lkhn-authenticated');
    localStorage.removeItem('lkhn-terms-accepted');
    return <Navigate to="/landing" replace />;
  };
  
  return (
    <WaitlistProvider>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/landing" 
          element={<LandingPage onGetStarted={() => {}} />} 
        />
        <Route 
          path="/terms" 
          element={<TermsConditionsPage />} 
        />
        <Route 
          path="/privacy" 
          element={<PrivacyPolicyPage />} 
        />
      
      {/* Protected routes */}
      <Route 
        element={
          <ProtectedRoute 
            fallback={<LoginFallback />}
          >
            <Layout 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
            >
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Wealth routes */}
        <Route path="/wealth" element={
          <WealthProvider>
            <WealthPage />
          </WealthProvider>
        } />
        <Route path="/wealth/planning" element={
          <WealthProvider>
            <WealthPlanningPage />
          </WealthProvider>
        } />
        
        {/* Hub, TrendCrypto, and Lificosm routes */}
        <Route path="/hub" element={<HubPage />} />
        <Route path="/trendcrypto" element={<TrendCryptoPage />} />
        <Route path="/lificosm" element={<LificosmPage />} />
        
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Error handling */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Route>
      
      {/* Catch-all route - redirect to landing if not authenticated */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
    </WaitlistProvider>
  );
};

export default AppRoutes;