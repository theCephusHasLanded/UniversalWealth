// Vercel entry point
const express = require('express');
const path = require('path');
const apiRoutes = require('./server/api-routes');

const app = express();

// For API routes
app.use('/api', apiRoutes);

// For static files
app.use(express.static(path.join(__dirname, 'dist')));

// For all other routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Export the Express app for Vercel
module.exports = app;