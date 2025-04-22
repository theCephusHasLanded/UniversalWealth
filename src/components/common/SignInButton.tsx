import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import LoginPage from '../../auth/LoginPage';

interface SignInButtonProps {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate('/dashboard');
  };
  
  const buttonClasses = {
    primary: 'bg-gold hover:bg-gold-600 text-navy-900 font-medium',
    outline: 'border border-gold/50 text-gold hover:bg-navy-800',
    text: 'text-gold hover:text-white'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-1.5',
    lg: 'px-5 py-2'
  };
  
  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className={`flex items-center rounded-sm transition-colors ${buttonClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        <LogIn size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="mr-2" />
        Sign In
      </button>
      
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="max-w-md w-full">
            <LoginPage 
              onSuccess={handleLoginSuccess} 
              onBackToLanding={() => setShowLoginModal(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SignInButton;