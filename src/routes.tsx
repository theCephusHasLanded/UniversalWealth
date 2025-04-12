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
import { useUser } from './contexts/UserContext';
import { WealthProvider } from './contexts/WealthContext';
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
  const LoginFallback = () => (
    <Navigate to="/landing" replace />
  );
  
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/landing" 
        element={<LandingPage onGetStarted={() => {}} />} 
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
    </Routes>
  );
};

export default AppRoutes;