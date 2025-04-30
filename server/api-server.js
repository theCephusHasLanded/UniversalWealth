const express = require('express');
const apiRoutes = require('./api-routes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// For Vercel, ensure we have environment variables set up
const setupEnv = () => {
  // Output environment details for debugging
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Feedback recipient:', process.env.RECIPIENT_EMAIL || 'Not set');
  
  // Check if we're running in Vercel and need to create a service account file
  if (process.env.FIREBASE_SERVICE_ACCOUNT && !fs.existsSync('./server/service-account.json')) {
    try {
      console.log('Creating service account file from environment variable...');
      fs.writeFileSync('./server/service-account.json', process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('Service account file created successfully');
    } catch (error) {
      console.error('Error creating service account file:', error);
    }
  }
};

// Run environment setup
setupEnv();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes with detailed configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://lkhn-universal-wealth.vercel.app', 'https://lkhn-universal-wealth-christinacephus.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Use API routes
app.use('/api', apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server if not running as a serverless function
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`);
    console.log(`CORS enabled for: http://localhost:3000, http://localhost:5173, http://localhost:4173`);
  });
} else {
  console.log('Running in production mode as serverless function');
}

// Export the Express API
module.exports = app;