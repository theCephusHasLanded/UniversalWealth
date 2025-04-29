const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting custom Vercel build script...');

// Use the special Vercel package.json
if (fs.existsSync('./vercel-package.json')) {
  console.log('Using special Vercel package.json...');
  // Backup original package.json if it exists
  if (fs.existsSync('./package.json')) {
    fs.copyFileSync('./package.json', './package.json.backup');
  }
  // Replace with Vercel version
  fs.copyFileSync('./vercel-package.json', './package.json');
}

// Clean installation
console.log('Cleaning node_modules...');
try {
  fs.rmSync('./node_modules', { recursive: true, force: true });
} catch (e) {
  console.log('No node_modules to clean or error removing:', e);
}

// Install dependencies with the special flag
console.log('Installing dependencies with legacy-peer-deps...');
execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

// Run the build command
console.log('Building the application...');
console.log('Current directory contents:', fs.readdirSync('.').join(', '));
console.log('Package.json content:', fs.readFileSync('./package.json', 'utf8'));
console.log('Node.js version:', process.version);
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!');
console.log('Build timestamp:', new Date().toISOString());