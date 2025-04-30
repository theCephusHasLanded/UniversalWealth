// Simple build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

// Check Firebase configuration
console.log('Checking Firebase configuration...');
const hasFirebaseConfig = 
  process.env.VITE_FIREBASE_API_KEY && 
  process.env.VITE_FIREBASE_AUTH_DOMAIN &&
  process.env.VITE_FIREBASE_PROJECT_ID;

if (hasFirebaseConfig) {
  console.log('Firebase configuration found in environment variables.');
} else {
  console.warn('Firebase configuration not found in environment variables. Using fallback configuration.');
  
  // Use the Vercel-specific Firebase configuration
  console.log('Using firebase.vercel.ts for deployment...');
  if (fs.existsSync('./src/config/firebase.vercel.ts')) {
    fs.copyFileSync('./src/config/firebase.vercel.ts', './src/config/firebase.ts');
    console.log('Copied firebase.vercel.ts to firebase.ts');
  }
}

// Check if vite is installed
try {
  console.log('Checking for Vite installation...');
  execSync('npx vite --version', { stdio: 'inherit' });
  console.log('Vite is installed properly!');
} catch (error) {
  console.log('Vite not found, installing directly...');
  execSync('npm install -g vite@4.3.9', { stdio: 'inherit' });
}

// Run the build command
console.log('Building the application...');
try {
  // Try to build using global vite
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
}

// Verify the build output
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('Build output verified - dist directory and index.html exist');
} else {
  console.error('Build verification failed - dist directory or index.html missing');
  process.exit(1);
}