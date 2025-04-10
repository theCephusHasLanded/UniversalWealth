import React from 'react';
import { useAuth } from './AuthContext';
import EyeLogo from '../components/common/EyeLogo';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900">
        <div className="relative h-20 w-20 mb-4">
          <div className="absolute inset-0 animate-pulse opacity-50 rounded-full bg-navy-700 border border-gold/20"></div>
          <EyeLogo size={80} variant="gold" expressiveness="high" />
        </div>
        <div className="text-xs uppercase tracking-widest text-gold/80 mt-3">
          Loading LKHN Experience
        </div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <>{fallback}</>;
};

export default ProtectedRoute;