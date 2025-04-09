import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getPerformance } from 'firebase/performance';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  // Removed databaseURL since we're not using Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
// Realtime Database disabled - using Firestore for all data storage including presence
const performance = getPerformance(app);

// App Check for security (when in production)
if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

// Initialize analytics conditionally
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Create a mock database object for compatibility
const database = {
  // Mock functions that don't do anything but prevent errors
  ref: () => ({
    set: () => Promise.resolve(),
    onDisconnect: () => ({
      set: () => Promise.resolve()
    })
  }),
  onValue: (ref, callback) => {
    // Call the callback with a mock snapshot
    callback({
      val: () => null,
      exists: () => false
    });
    // Return a no-op unsubscribe function
    return () => {};
  }
};

export { 
  auth, 
  firestore, 
  storage, 
  database, // Now it's a mock object
  performance, 
  analytics 
};
export default app;