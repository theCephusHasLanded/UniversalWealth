import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getPerformance } from 'firebase/performance';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuLmTTeM3vPr1kvP3UqZsy1uzCwwAzeHE",
  authDomain: "lkhn-wealth.firebaseapp.com",
  projectId: "lkhn-wealth",
  storageBucket: "lkhn-wealth.firebasestorage.app",
  messagingSenderId: "293959860420",
  appId: "1:293959860420:web:5dc7fb3b368a207b25c991",
  measurementId: "G-HDSE6VGKR2",
  databaseURL: "https://lkhn-wealth.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app); // For real-time presence
const performance = getPerformance(app);

// App Check for security (when in production)
if (process.env.NODE_ENV === 'production') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
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

export { 
  auth, 
  firestore, 
  storage, 
  database, 
  performance, 
  analytics 
};
export default app;