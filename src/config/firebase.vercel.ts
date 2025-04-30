import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged, 
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getPerformance } from 'firebase/performance';
import { getAnalytics, isSupported, setConsent } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Default mock Firebase configuration when no env variables are available
const defaultFirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project-id.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-project-id.appspot.com",
  messagingSenderId: "mock-messaging-sender-id",
  appId: "mock-app-id",
  measurementId: "mock-measurement-id"
};

// Check if Firebase config is available from environment variables
const hasFirebaseConfig = 
  typeof import.meta.env.VITE_FIREBASE_API_KEY === 'string' && 
  import.meta.env.VITE_FIREBASE_API_KEY !== '';

// Use actual Firebase config if available, otherwise use the mock
const firebaseConfig = hasFirebaseConfig ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
} : defaultFirebaseConfig;

// Log whether we're using real Firebase or mock
console.log(`Using ${hasFirebaseConfig ? 'REAL' : 'MOCK'} Firebase configuration`);

// If using mock config, don't actually initialize Firebase to avoid errors
let app = null;
let performance = null;
let analytics = null;

// Add deployment environment information for better debugging
console.log('Firebase initialization environment:', {
  hasEnvVars: hasFirebaseConfig,
  environment: import.meta.env.MODE || 'unknown',
  timestamp: new Date().toISOString()
});

// Initialize with default mock objects in case Firebase fails to initialize
// Provide a mock GoogleAuthProvider class
const MockGoogleAuthProvider = function() {
  // Empty constructor
};

// Create mock auth with all required methods
let auth = {
  onAuthStateChanged: (callback) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
  createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
  signOut: () => Promise.resolve(),
  sendPasswordResetEmail: () => Promise.reject(new Error('Firebase not initialized'))
};

// Define our safe versions for auth functions
// We can't reassign imports directly, but we'll handle this in AuthContext
const SafeGoogleAuthProvider = MockGoogleAuthProvider;

// Define mock signInWithPopup that will be used when auth is undefined
const mockSignInWithPopup = () => Promise.reject(new Error('Firebase not initialized'));

let firestore = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: () => false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    }),
    add: () => Promise.resolve({ id: 'mock-id' })
  })
};

let storage = {
  ref: () => ({
    put: () => ({
      on: () => {},
      then: (cb) => cb({ ref: { getDownloadURL: () => Promise.resolve('https://mock-url.com/image.jpg') } })
    })
  })
};

let database = {
  ref: () => ({
    set: () => Promise.resolve(),
    onDisconnect: () => ({
      set: () => Promise.resolve()
    })
  }),
  onValue: (ref, callback) => {
    callback({
      val: () => null,
      exists: () => false
    });
    return () => {};
  }
};

// Only initialize Firebase if we have a real config
if (hasFirebaseConfig) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize services
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    
    // Override signInWithPopup with real one when auth is initialized
    const realSignInWithPopup = signInWithPopup;
    
    // Only initialize performance in production
    if (import.meta.env.PROD) {
      try {
        performance = getPerformance(app);
      } catch (err) {
        console.warn('Firebase Performance initialization failed:', err);
      }
    }
    
    // App Check for security (when in production)
    if (import.meta.env.PROD && import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
          isTokenAutoRefreshEnabled: true
        });
      } catch (err) {
        console.warn('Firebase App Check initialization failed:', err);
      }
    }
    
    // Initialize analytics conditionally and set consent settings
    isSupported().then(supported => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
          // Set analytics consent settings for third-party cookies
          setConsent({
            analytics_storage: 'denied',
            ad_storage: 'denied',
            functionality_storage: 'granted',
            personalization_storage: 'denied',
            security_storage: 'granted'
          });
        } catch (err) {
          console.warn('Firebase Analytics initialization failed:', err);
        }
      }
    }).catch(err => {
      console.warn('Firebase Analytics support check failed:', err);
    });
  } catch (err) {
    console.error('Firebase initialization failed:', err);
    // Mock objects already defined as fallbacks
  }
}

// Export the SafeGoogleAuthProvider and mockSignInWithPopup for use in AuthContext
export { 
  auth, 
  firestore, 
  storage, 
  database,
  performance, 
  analytics,
  SafeGoogleAuthProvider,
  mockSignInWithPopup
};
export default app;