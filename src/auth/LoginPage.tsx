import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTranslation } from '../contexts/TranslationContext';
import { ArrowRight, Mail, Lock, AlertCircle, User } from 'lucide-react';
import EyeLogo from '../components/common/EyeLogo';

type AuthMode = 'login' | 'signup' | 'forgot';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToLanding?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToLanding }) => {
  const { t } = useTranslation();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      await signup(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to create an account.');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google.');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!email) {
      return setError('Please enter your email');
    }
    
    setLoading(true);
    
    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full p-6 bg-gray-900 border border-gray-800 rounded-sm">
        {/* Back button - if available */}
        {onBackToLanding && (
          <button 
            onClick={onBackToLanding}
            className="mb-4 text-sm text-gray-400 hover:text-white flex items-center"
          >
            <ArrowRight className="mr-1 transform rotate-180" size={14} />
            Back to landing page
          </button>
        )}
        
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="h-12 w-12 mr-4 bg-navy-800 border border-gold/50 rounded-full flex items-center justify-center overflow-hidden">
            <EyeLogo size={40} variant="gold" expressiveness="high" />
          </div>
          <div>
            <div className="flex items-center mb-1">
              <div className="h-0.5 w-6 bg-gold mr-2"></div>
              <span className="text-xs uppercase tracking-widest text-white">LKHN</span>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-normal tracking-widest uppercase text-white">
                Universal Wealth
              </h1>
            </div>
          </div>
        </div>
        
        {/* Auth Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <h2 className="text-xl mb-6">{t('auth.login')}</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-sm flex items-start">
                <AlertCircle size={16} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">{t('auth.password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-sm mb-4 flex items-center justify-center"
            >
              {loading ? 'Signing in...' : t('auth.login')} 
              {!loading && <ArrowRight size={16} className="ml-2" />}
            </button>
            
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-gray-800"></div>
              <span className="px-3 text-sm text-gray-500">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-gray-800"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-gray-700 text-white py-2 rounded-sm mb-6 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              {t('auth.googleLogin')}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-sm text-blue-400 hover:underline mr-4"
              >
                {t('auth.needAccount')}
              </button>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-blue-400 hover:underline"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          </form>
        )}
        
        {mode === 'signup' && (
          <form onSubmit={handleSignup}>
            <h2 className="text-xl mb-6">{t('auth.createAccount')}</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-sm flex items-start">
                <AlertCircle size={16} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">{t('auth.password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-sm mb-4 flex items-center justify-center"
            >
              {loading ? 'Creating Account...' : t('auth.signup')}
              {!loading && <User size={16} className="ml-2" />}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-blue-400 hover:underline"
              >
                {t('auth.haveAccount')}
              </button>
            </div>
          </form>
        )}
        
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-xl mb-6">{t('auth.resetPassword')}</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-sm flex items-start">
                <AlertCircle size={16} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 rounded-sm flex items-start">
                <AlertCircle size={16} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-400">{message}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-sm py-2 pl-10 pr-3"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-sm mb-4 flex items-center justify-center"
            >
              {loading ? 'Sending...' : t('auth.sendResetLink')}
              {!loading && <ArrowRight size={16} className="ml-2" />}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-blue-400 hover:underline"
              >
                {t('auth.backToLogin')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;