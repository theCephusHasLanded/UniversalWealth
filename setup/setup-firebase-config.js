#!/usr/bin/env node

/**
 * Firebase Configuration Setup Helper
 * 
 * This script helps set up Firebase configuration for the LKHN Universal Wealth platform.
 * It creates or updates the firebase.ts config file with provided environment variables.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CONFIG_PATH = path.join(__dirname, '..', 'src', 'config', 'firebase.ts');
const ENV_PATH = path.join(__dirname, '..', '.env');
const VERCEL_ENV_PATH = path.join(__dirname, '..', '.vercel.env');

// Check if .env file exists
const envExists = fs.existsSync(ENV_PATH);
const vercelEnvExists = fs.existsSync(VERCEL_ENV_PATH);

console.log('\n🔥 LKHN Universal Wealth - Firebase Setup Helper 🔥\n');

// Function to prompt for Firebase config values
async function promptForConfig() {
  return new Promise((resolve) => {
    const config = {};
    
    console.log('Please enter your Firebase configuration values:');
    
    rl.question('Firebase API Key: ', (apiKey) => {
      config.apiKey = apiKey;
      
      rl.question('Firebase Auth Domain: ', (authDomain) => {
        config.authDomain = authDomain;
        
        rl.question('Firebase Project ID: ', (projectId) => {
          config.projectId = projectId;
          
          rl.question('Firebase Storage Bucket: ', (storageBucket) => {
            config.storageBucket = storageBucket;
            
            rl.question('Firebase Messaging Sender ID: ', (messagingSenderId) => {
              config.messagingSenderId = messagingSenderId;
              
              rl.question('Firebase App ID: ', (appId) => {
                config.appId = appId;
                
                rl.question('Firebase Measurement ID (optional): ', (measurementId) => {
                  config.measurementId = measurementId;
                  
                  resolve(config);
                });
              });
            });
          });
        });
      });
    });
  });
}

// Function to write Firebase config to .env file
function writeEnvFile(config) {
  const envContent = `# Firebase Configuration
VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
VITE_FIREBASE_APP_ID=${config.appId}
VITE_FIREBASE_MEASUREMENT_ID=${config.measurementId || ''}

# Feedback Email
RECIPIENT_EMAIL=Christinacephus@pursuit.org
`;

  fs.writeFileSync(ENV_PATH, envContent);
  console.log(`✅ Environment variables written to .env file`);
}

// Function to generate firebase.ts config file
function writeFirebaseConfig(config) {
  const firebaseConfig = `import { initializeApp } from 'firebase/app';
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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}",
  measurementId: "${config.measurementId || ''}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
// Realtime Database disabled - using Firestore for all data storage including presence
const performance = getPerformance(app);

// We're using the actual Firebase services, not emulators
console.log('Using real Firebase services instead of emulators');

// App Check for security (when in production)
if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
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
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
    // Set analytics consent settings for third-party cookies
    setConsent({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });
  }
}).catch(err => {
  console.warn('Firebase Analytics support check failed:', err);
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

// Provide fallback implementations for auth functions in case the real ones fail
const MockGoogleAuthProvider = function() {
  // Empty constructor
};

// These are only used as fallbacks in case Firebase auth fails to initialize
const SafeGoogleAuthProvider = GoogleAuthProvider;
const mockSignInWithPopup = signInWithPopup;

export { 
  auth, 
  firestore, 
  storage, 
  database, // Now it's a mock object
  performance, 
  analytics,
  SafeGoogleAuthProvider,
  mockSignInWithPopup
};
export default app;
`;

  fs.writeFileSync(CONFIG_PATH, firebaseConfig);
  console.log(`✅ Firebase configuration written to ${CONFIG_PATH}`);
}

// Main function
async function main() {
  let config = {};
  
  if (envExists) {
    console.log('📂 Found existing .env file. Loading Firebase configuration...');
    
    // Try to parse existing .env file
    const envFile = fs.readFileSync(ENV_PATH, 'utf8');
    const envLines = envFile.split('\n');
    
    // Extract Firebase config values
    for (const line of envLines) {
      if (line.startsWith('VITE_FIREBASE_API_KEY=')) {
        config.apiKey = line.split('=')[1];
      } else if (line.startsWith('VITE_FIREBASE_AUTH_DOMAIN=')) {
        config.authDomain = line.split('=')[1];
      } else if (line.startsWith('VITE_FIREBASE_PROJECT_ID=')) {
        config.projectId = line.split('=')[1];
      } else if (line.startsWith('VITE_FIREBASE_STORAGE_BUCKET=')) {
        config.storageBucket = line.split('=')[1];
      } else if (line.startsWith('VITE_FIREBASE_MESSAGING_SENDER_ID=')) {
        config.messagingSenderId = line.split('=')[1];
      } else if (line.startsWith('VITE_FIREBASE_APP_ID=')) {
        config.appId = line.split('=')[1];
      } else if (line.startsWith('VITE_FIREBASE_MEASUREMENT_ID=')) {
        config.measurementId = line.split('=')[1];
      }
    }
    
    // Check if we have all required values
    const hasAllValues = config.apiKey && config.authDomain && config.projectId && 
                         config.storageBucket && config.messagingSenderId && config.appId;
    
    if (hasAllValues) {
      console.log('📝 Found Firebase configuration in .env file.');
      rl.question('Do you want to use this configuration? (Y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'n') {
          // Get new config values
          config = await promptForConfig();
          // Write to .env file
          writeEnvFile(config);
        }
        
        // Write firebase.ts config file
        writeFirebaseConfig(config);
        console.log('\n✨ Firebase configuration setup complete!');
        console.log('\n🚀 You can now run the application with Firebase support!\n');
        rl.close();
      });
    } else {
      console.log('⚠️ Incomplete Firebase configuration in .env file.');
      config = await promptForConfig();
      writeEnvFile(config);
      writeFirebaseConfig(config);
      console.log('\n✨ Firebase configuration setup complete!');
      console.log('\n🚀 You can now run the application with Firebase support!\n');
      rl.close();
    }
  } else {
    console.log('⚠️ No .env file found. Creating a new one...');
    config = await promptForConfig();
    writeEnvFile(config);
    writeFirebaseConfig(config);
    console.log('\n✨ Firebase configuration setup complete!');
    console.log('\n🚀 You can now run the application with Firebase support!\n');
    rl.close();
  }
}

// Run the main function
main().catch(error => {
  console.error('Error setting up Firebase configuration:', error);
  rl.close();
});