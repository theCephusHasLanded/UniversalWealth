const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firebase Admin (assuming serviceAccount is available)
try {
  admin.initializeApp({
    credential: admin.credential.cert(require('./service-account.json'))
  });
} catch (error) {
  console.warn('Firebase Admin SDK initialization failed:', error.message);
  console.warn('API routes will not function properly without Firebase Admin SDK');
}

const app = express();
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint for handling offline status
app.post('/api/offline-status', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }
  
  try {
    // Update presence status in Firestore
    await db.collection('presence').doc(userId).set({
      status: 'offline',
      lastActive: admin.firestore.Timestamp.now(),
      device: req.body.device || 'Unknown device'
    }, { merge: true });
    
    return res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating offline status:', error);
    return res.status(500).json({ error: 'Failed to update status' });
  }
});

// API endpoint for forum categories
app.get('/api/forum/categories', async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection('forumCategories').get();
    const categories = [];
    
    categoriesSnapshot.forEach(doc => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return res.status(500).json({ error: 'Failed to fetch forum categories' });
  }
});

// API endpoint for forum posts
app.get('/api/forum/posts', async (req, res) => {
  try {
    const { category } = req.query;
    let postsQuery = db.collection('forumPosts');
    
    if (category) {
      postsQuery = postsQuery.where('category', '==', category);
    }
    
    const postsSnapshot = await postsQuery.get();
    const posts = [];
    
    postsSnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { feedback, rating, email } = req.body;
    
    if (!feedback || !rating) {
      return res.status(400).json({ error: 'Feedback and rating are required' });
    }
    
    // Store feedback in Firestore
    await db.collection('feedback').add({
      feedback,
      rating,
      email: email || null,
      createdAt: admin.firestore.Timestamp.now(),
      recipientEmail: process.env.RECIPIENT_EMAIL || 'Christinacephus@pursuit.org'
    });
    
    // Here you would typically send an email notification
    // This could be implemented using a Firebase Cloud Function
    // or a third-party email service like SendGrid
    console.log(`New feedback received (${rating}/5): ${feedback}`);
    
    return res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Add other API endpoints as needed

// Default error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server when this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

// Export the app for potential serverless function usage
module.exports = app;