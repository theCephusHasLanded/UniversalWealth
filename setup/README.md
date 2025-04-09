# Firebase Setup for LKHN Universal Wealth

This directory contains scripts to set up Firebase for the LKHN Universal Wealth application.

## Firebase Configuration

The application uses both Firebase Firestore and Realtime Database. 

### Prerequisites

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in Firebase Authentication
3. Enable Firestore and Realtime Database
4. Generate a service account key from Project Settings > Service Accounts 

### Setup Instructions

1. Place your service account key file in this directory as `service-account.json`

2. Install required npm packages:
   ```bash
   npm install firebase-admin
   ```

3. Run the Firestore collections setup script:
   ```bash
   node firestore-collections.js
   ```

### Required Firebase Services

The application uses:

1. **Firestore** - To store:
   - User profiles
   - Forum posts and categories
   - User notifications
   - Activity logs
   - Presence information

2. **Realtime Database** - To track online presence in real-time

3. **Firebase Authentication** - For user login

4. **Firebase Storage** - For profile images and other uploads

## Troubleshooting

If you see the warning: `Firebase error. Please ensure that you have the URL of your Firebase Realtime Database instance configured correctly`, make sure:

1. Realtime Database is enabled in your Firebase project
2. The database URL is correctly set in your .env file (VITE_FIREBASE_DATABASE_URL)
3. Security rules are properly configured in the Firebase Console