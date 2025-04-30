# Vercel Environment Variables Setup

For proper functioning of the LKHN Universal Wealth platform on Vercel, you need to set up the following environment variables:

## Required Environment Variables

1. **RECIPIENT_EMAIL**
   - Value: `Christinacephus@pursuit.org`
   - Description: Email address to receive feedback form submissions
   - Purpose: Used in the feedback API endpoint to specify the recipient of feedback notifications

2. **NODE_ENV**
   - Value: `production`
   - Description: Sets the environment to production mode
   - Purpose: Enables production-specific optimizations and behaviors

## Firebase Configuration

Since the feedback system stores data in Firebase, you'll need to add your Firebase service account credentials.

You have two options for this:

### Option 1: Set up Firebase service account JSON (Recommended)

Create a `FIREBASE_SERVICE_ACCOUNT` environment variable containing the entire JSON content of your service account file.

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key (it will download a JSON file)
3. Copy the entire content of the JSON file
4. In Vercel, add an environment variable named `FIREBASE_SERVICE_ACCOUNT` with the entire JSON content as the value

### Option 2: Set individual Firebase configuration values

Alternatively, you can set up individual environment variables for each Firebase configuration value:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on the "Settings" tab
4. Select "Environment Variables" from the sidebar
5. Add each environment variable with its corresponding value
6. Click "Save" to apply the changes

## Important Notes

- Environment variables are encrypted and not exposed to the browser (except those prefixed with `NEXT_PUBLIC_` or `VITE_`)
- After adding environment variables, you'll need to redeploy your application
- The feedback system has a fallback that stores submissions in localStorage if Firebase/API is not available