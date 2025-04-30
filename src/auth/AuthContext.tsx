import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
  signInWithPopup as firebaseSignInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Import directly from Firebase auth and handle any possible errors at runtime
try {
  // Check if Firebase auth is properly initialized
  if (auth === undefined || auth === null) {
    console.warn('Firebase auth not initialized properly');
  }
} catch (e) {
  console.error('Error checking Firebase auth initialization:', e);
}

// Simple wrappers to make auth provider creation more resilient
const GoogleAuthProvider = FirebaseGoogleAuthProvider || 
  function() { 
    console.warn('Using mock GoogleAuthProvider');
    return {}; 
  };

// Wrapper around signInWithPopup to handle possible errors
const signInWithPopup = function(auth, provider) {
  try {
    if (typeof firebaseSignInWithPopup === 'function') {
      return firebaseSignInWithPopup(auth, provider);
    } else {
      console.warn('signInWithPopup not available, using fallback');
      return Promise.reject(new Error('Firebase signInWithPopup not available'));
    }
  } catch (e) {
    console.error('Error in signInWithPopup:', e);
    return Promise.reject(e);
  }
};

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string): Promise<User> => {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return response.user;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response.user;
  };

  const logout = () => {
    return signOut(auth);
  };

  const loginWithGoogle = async (): Promise<User> => {
    try {
      console.log('Starting Google login process');
      
      // Create provider with error handling
      let provider;
      try {
        provider = new GoogleAuthProvider();
      } catch (e) {
        console.error('Error creating GoogleAuthProvider:', e);
        throw new Error('Could not initialize Google sign-in. Please try another method.');
      }
      
      // Try to sign in with popup
      if (!auth) {
        console.error('Auth is not initialized');
        throw new Error('Authentication service is not available');
      }
      
      console.log('Attempting signInWithPopup');
      const result = await signInWithPopup(auth, provider);
      
      if (!result || !result.user) {
        throw new Error('Failed to get user data from Google sign-in');
      }
      
      console.log('Google sign-in successful');
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextProps = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;