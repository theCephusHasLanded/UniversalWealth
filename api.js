// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./server/api-routes');
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

// Set up CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Use API routes
app.use(apiRoutes);

// Handle errors
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export the Express API for Vercel
module.exports = app;