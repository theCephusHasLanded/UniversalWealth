// Run this script with: node scripts/convert-favicons.js
const fs = require('fs');
const path = require('path');

console.log('To convert SVGs to PNG and ICO formats, run the following commands after installing sharp:');
console.log('\nnpm install -D sharp');
console.log('\nAlternatively, you can use online converters like:');
console.log('- https://svgtopng.com/');
console.log('- https://convertio.co/svg-ico/');
console.log('- https://realfavicongenerator.net/');
console.log('\nUpload the SVG files we created in the public directory:');
console.log('- /public/favicon.svg');
console.log('- /public/favicon-16x16.svg');
console.log('- /public/favicon-32x32.svg');
console.log('- /public/safari-pinned-tab.svg');
console.log('- /public/apple-touch-icon.svg');
console.log('\nThen download and place the converted files in the same directory.');
console.log('Update the paths in index.html if necessary.\n');

// Create a site.webmanifest file for PWA support
const manifest = {
  name: 'LKHN Universal Wealth',
  short_name: 'LKHN',
  icons: [
    {
      src: '/favicon-16x16.svg',
      sizes: '16x16',
      type: 'image/svg+xml'
    },
    {
      src: '/favicon-32x32.svg',
      sizes: '32x32',
      type: 'image/svg+xml'
    },
    {
      src: '/favicon.svg',
      sizes: '64x64',
      type: 'image/svg+xml'
    },
    {
      src: '/apple-touch-icon.svg',
      sizes: '180x180',
      type: 'image/svg+xml'
    }
  ],
  theme_color: '#0f1729',
  background_color: '#0f1729',
  display: 'standalone'
};

// Write the manifest file
fs.writeFileSync(
  path.join(__dirname, '../public/site.webmanifest'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);

console.log('Created site.webmanifest file for PWA support');
console.log('After converting SVGs, add the following to your HTML:');
console.log('<link rel="manifest" href="/site.webmanifest">');