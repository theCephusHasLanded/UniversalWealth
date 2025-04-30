# Firebase Setup Guide for LKHN Universal Wealth

This guide will help you create and configure a Firebase project for the LKHN Universal Wealth platform.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics if desired

## Step 2: Register Your Web App

1. In the Firebase console, click on the project you created
2. Click the web icon (</>) to add a web app
3. Give your app a nickname (e.g., "LKHN Universal Wealth")
4. Check the "Also set up Firebase Hosting for this app" option if desired
5. Click "Register app"
6. Firebase will provide your configuration keys - **SAVE THESE VALUES**

## Step 3: Set Up Authentication

1. In the Firebase console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. In the "Sign-in method" tab, enable the following providers:
   - Email/Password
   - Google
   - (Optional) Any other providers you want to support

## Step 4: Create Firestore Database

1. In the Firebase console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose either "Start in production mode" or "Start in test mode" (you can change this later)
   - For development, "test mode" is easier (but less secure)
   - For production, use "production mode" with proper security rules
4. Select a location for your database (choose one close to your target users)
5. Click "Enable"

## Step 5: Set Up Storage (for user uploads)

1. In the Firebase console, go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose either "Start in production mode" or "Start in test mode"
4. Click "Next" and then "Done"

## Step 6: Configure Environment Variables

Add these Firebase configuration values to your environment variables in your development environment and deployment platform:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add each variable above with its corresponding value
4. Also add:
   - `RECIPIENT_EMAIL=your-email@example.com` (for feedback system)
   - `NODE_ENV=production`
5. Click "Save" and redeploy your application

## Step 7: Service Account for Server Functions (Optional)

If you need server-side Firebase access (for API routes, functions, etc.):

1. In the Firebase console, go to "Project settings" → "Service accounts"
2. Click "Generate new private key"
3. Save the JSON file securely
4. In Vercel, add a `FIREBASE_SERVICE_ACCOUNT` environment variable with the entire JSON content

## Step 8: Configure Security Rules

For Firestore Database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

If you encounter authentication errors:

1. Ensure all environment variables are correctly set
2. Check that authentication providers are enabled in Firebase console
3. Verify that your app's domain is authorized in Firebase Authentication settings
4. Check for any security rule restrictions

For "Firebase: Error (auth/invalid-api-key)" errors:
- Double-check that your API key is correctly copied
- Ensure the API key is set as `VITE_FIREBASE_API_KEY` in your environment variables
- Verify that your Firebase project is properly set up and active

## Important Notes

- Keep your Firebase API keys and service account private
- For production, set up proper security rules
- Consider enabling App Check for additional security
- Monitor your Firebase usage to avoid unexpected billing