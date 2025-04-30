// Simple build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

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