# Vercel Deployment Guide for LKHN Universal Wealth

This guide walks you through deploying the LKHN Universal Wealth platform on Vercel with proper Firebase integration.

## Prerequisites

Before you begin, you'll need:

1. A Vercel account (https://vercel.com)
2. A Firebase project (see FIREBASE_SETUP.md)
3. Your Firebase configuration values
4. Git repository with your LKHN Universal Wealth code

## Step 1: Connect Your Repository to Vercel

1. Log in to your Vercel dashboard
2. Click "Add New" → "Project"
3. Select your Git repository
4. Configure project settings:
   - **Framework Preset**: Choose "Vite"
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`

## Step 2: Set Environment Variables

In the Vercel project settings, add the following environment variables:

### Required Firebase Variables

All these variables must be set for Firebase auth to work correctly:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key | `AIzaSyA1BCDeFgHiJkLmNoPQRstUVWxyz12345` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain | `your-project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket | `your-project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Your Firebase app ID | `1:123456789012:web:abcdef1234567890` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Your Firebase measurement ID | `G-ABCDEF1234` |

### Other Required Variables

| Variable Name | Description | Value |
|---------------|-------------|-------|
| `NODE_ENV` | Environment mode | `production` |
| `RECIPIENT_EMAIL` | Email for receiving feedback | `your-email@example.com` |

## Step 3: Deploy

1. Click "Deploy" to start the deployment process
2. Vercel will clone your repository, install dependencies, and build the project
3. Once complete, you'll receive a deployment URL (e.g., `https://your-project.vercel.app`)

## Step 4: Test Your Deployment

1. Visit your deployment URL
2. Test authentication features:
   - Sign up with email
   - Sign in with email
   - Sign in with Google
3. Verify that the waitlist modal works correctly
4. Test other Firebase-dependent features

## Troubleshooting

### Firebase Authentication Issues

If you see errors like "Firebase: Error (auth/invalid-api-key)":

1. Double-check that ALL required Firebase environment variables are set correctly
2. Verify your Firebase project settings in the Firebase console
3. Ensure your deployment domain is added to the authorized domains in Firebase Authentication settings

### CORS Issues

If you encounter CORS errors with Firebase:

1. Go to Firebase console → Authentication → Settings → Authorized domains
2. Add your Vercel deployment domain (e.g., `your-project.vercel.app`)

### Deployment Failing

If your deployment fails:

1. Check the build logs in Vercel for specific errors
2. Verify that your repository includes all necessary files
3. Check that you've set `--legacy-peer-deps` in the install command
4. Ensure your `vercel-build` script is set up correctly

### Firebase Fallback Mechanism

If your app is using fallback Firebase implementations:

1. Check the console logs - you should see "Using MOCK Firebase configuration"
2. This means the Firebase environment variables are missing or incorrect
3. Add or fix the Firebase environment variables in Vercel

## Monitoring and Maintenance

1. Set up Vercel Analytics to monitor usage and errors
2. Configure automatic deployment from your main branch
3. Regularly check Firebase console for auth issues or security alerts

## Need Help?

If you encounter issues with your Vercel deployment:

1. Check Vercel documentation: https://vercel.com/docs
2. Review Firebase documentation: https://firebase.google.com/docs
3. Reach out to LKHN development team for assistance