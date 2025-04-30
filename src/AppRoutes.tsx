import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './auth/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { TranslationProvider } from './contexts/TranslationContext';
import { WaitlistProvider } from './contexts/WaitlistContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      {/* Translation provider wrapping the entire app */}
      <TranslationProvider>
        <AuthProvider>
          <UserProvider>
            <WaitlistProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsConditionsPage />} />
                
                {/* Protected profile route */}
                <Route element={<ProtectedRoute fallback={<App />} />}>
                  <Route element={<Layout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                  </Route>
                </Route>
                
                {/* Main app */}
                <Route path="/*" element={<App />} />
              </Routes>
            </WaitlistProvider>
          </UserProvider>
        </AuthProvider>
      </TranslationProvider>
    </Router>
  );
};

export default AppRoutes;