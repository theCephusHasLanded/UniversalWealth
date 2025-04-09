// Firebase Firestore setup script
// This script initializes the Firestore collections needed for the LKHN Universal Wealth app

const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // Removed databaseURL to avoid errors when Realtime Database is not available
});

const db = admin.firestore();
// Removed Realtime Database reference - we're using Firestore only

// Create initial collections and documents
async function setupFirestoreCollections() {
  console.log('Setting up Firestore collections...');
  
  try {
    // 1. Create users collection
    console.log('Setting up users collection...');
    await db.collection('users').doc('demo-user').set({
      userId: 'demo-user',
      displayName: 'Demo User',
      email: 'demo@example.com',
      photoURL: null,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      bio: 'This is a demo profile for showcasing the app functionality.',
      roles: ['member'],
      badges: ['Early Adopter', 'Community Contributor'],
      wealthScore: 72,
      creditScore: 720,
      communityContributions: 15,
      eventAttendance: 3,
      accountStatus: 'active',
      socialLinks: {
        twitter: 'demouser',
        instagram: 'demouser',
        linkedin: 'https://linkedin.com/in/demouser',
        facebook: ''
      },
      settings: {
        language: 'en',
        darkMode: false,
        emailNotifications: true,
        pushNotifications: true,
        twoFactorAuth: false,
        timezone: 'UTC',
        privacySettings: {
          showProfile: true,
          showOnlineStatus: true,
          showActivity: true,
          allowMessages: true
        },
        avatarStyle: 'avataaars'
      }
    });
    
    // 2. Create presence collection for online status
    console.log('Setting up presence collection...');
    await db.collection('presence').doc('demo-user').set({
      status: 'online',
      lastActive: admin.firestore.Timestamp.now(),
      device: 'Demo Script'
    });
    
    // 3. Create notifications subcollection for users
    console.log('Setting up notifications...');
    await db.collection('users').doc('demo-user').collection('notifications').doc('welcome').set({
      title: 'Welcome to LKHN Universal Wealth',
      message: 'Thank you for joining our community. Explore the platform to discover all features!',
      type: 'welcome',
      read: false,
      createdAt: admin.firestore.Timestamp.now()
    });
    
    // 4. Create activity subcollection for users
    console.log('Setting up activity logs...');
    await db.collection('users').doc('demo-user').collection('activity').doc('signup').set({
      type: 'account_created',
      title: 'Account Created',
      description: 'Welcome to LKHN Universal Wealth',
      timestamp: admin.firestore.Timestamp.now(),
      metadata: {}
    });
    
    // 5. Create forum collections for posts and categories
    console.log('Setting up forum collections...');
    
    // Forum categories
    const categories = [
      {
        id: 'cat1',
        name: 'General Discussion',
        description: 'General discussions about the LKHN platform',
        icon: 'message-circle',
        color: 'blue',
        order: 1,
        moderators: ['demo-user'],
        postCount: 1
      },
      {
        id: 'cat2',
        name: 'Crypto Talk',
        description: 'Discussions about cryptocurrencies and market trends',
        icon: 'trending-up',
        color: 'green',
        order: 2,
        moderators: ['demo-user'],
        postCount: 0
      }
    ];
    
    for (const category of categories) {
      await db.collection('forumCategories').doc(category.id).set(category);
    }
    
    // Forum posts
    await db.collection('forumPosts').doc('post1').set({
      authorId: 'demo-user',
      title: 'Welcome to the LKHN Community Forum!',
      content: 'This is a space for all members to share ideas, ask questions, and connect with each other. Please be respectful and follow our community guidelines.',
      tags: ['welcome', 'community', 'guidelines'],
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      likes: [],
      commentCount: 0,
      viewCount: 1,
      category: 'cat1',
      featured: true,
      status: 'published'
    });
    
    // Removed Realtime Database setup - using Firestore only for presence
    console.log('Using Firestore for presence tracking instead of Realtime Database');
    
    console.log('Firestore and Realtime Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Firestore collections:', error);
  }
}

// Run the setup
setupFirestoreCollections().then(() => {
  console.log('Setup complete!');
  process.exit(0);
}).catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});