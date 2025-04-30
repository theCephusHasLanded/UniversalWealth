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
import { auth, SafeGoogleAuthProvider, mockSignInWithPopup } from '../config/firebase';

// Use safe versions that won't break if Firebase isn't initialized
const GoogleAuthProvider = typeof FirebaseGoogleAuthProvider === 'function' 
  ? FirebaseGoogleAuthProvider 
  : SafeGoogleAuthProvider;

const signInWithPopup = typeof firebaseSignInWithPopup === 'function'
  ? firebaseSignInWithPopup
  : mockSignInWithPopup;

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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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