# Firebase Hosting Deployment Guide for LKHN Universal Wealth

This guide will help you deploy the LKHN Universal Wealth platform to Firebase Hosting with proper configuration including Firebase Authentication and email functionality.

## Prerequisites

1. Firebase project set up (see FIREBASE_SETUP.md)
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Node.js and npm installed
4. Mailtrap account (or other SMTP service) for email functionality

## Step 1: Initialize Firebase in Your Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

During initialization:
- Select Hosting and Functions
- Choose your Firebase project
- Use `dist` as your public directory
- Configure as a single-page app (yes)
- Set up automatic builds and deploys (optional)

This will create:
- `firebase.json`
- `.firebaserc`
- `functions/` directory

## Step 2: Set Up Firebase Configuration

Make sure your Firebase configuration is set up correctly in `src/config/firebase.ts`. Your configuration should match the Firebase project you're deploying to.

You can run the helper script to set this up:
```bash
npm run setup:firebase
```

## Step 3: Configure Email Functionality with Mailtrap

### 3.1. Install Required Packages in Functions

```bash
cd functions
npm install nodemailer dotenv
```

### 3.2. Create Email Sending Function

Create a file named `functions/src/mailer.js`:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create a transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: functions.config().mailtrap.host,
  port: functions.config().mailtrap.port,
  auth: {
    user: functions.config().mailtrap.user,
    pass: functions.config().mailtrap.pass,
  },
});

// Function to send waitlist confirmation emails
exports.sendWaitlistConfirmation = functions.https.onCall(async (data, context) => {
  const { email, name } = data;
  
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }
  
  const mailOptions = {
    from: '"LKHN Universal Wealth" <notifications@universalwealth.com>',
    to: email,
    subject: 'Welcome to the LKHN Universal Wealth Waitlist!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://universalwealth.vercel.app/images/logo.svg" alt="LKHN Universal Wealth" style="width: 120px;">
        </div>
        
        <h2 style="color: #C9A861; margin-bottom: 20px;">Welcome to the Exclusive Waitlist!</h2>
        
        <p>Hello ${name || 'there'},</p>
        
        <p>Thank you for joining the LKHN Universal Wealth waitlist. We're thrilled to have you as part of our growing community of forward-thinking individuals.</p>
        
        <p>As a waitlist member, you'll be among the first to:</p>
        
        <ul>
          <li>Receive early access to our platform features</li>
          <li>Get exclusive offers and opportunities</li>
          <li>Be invited to special events and webinars</li>
        </ul>
        
        <p>We're working hard to create a revolutionary wealth building platform that serves everyone, and we can't wait to share it with you.</p>
        
        <p>Stay tuned for updates!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>LKHN Universal Wealth</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  };
  
  // Also send a notification to the admin
  const adminNotification = {
    from: '"LKHN Waitlist System" <notifications@universalwealth.com>',
    to: 'christinacephus@pursuit.org',
    subject: 'New Waitlist Signup',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h3>New Waitlist Signup</h3>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  };
  
  try {
    // Send email to user
    await transporter.sendMail(mailOptions);
    
    // Send notification to admin
    await transporter.sendMail(adminNotification);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending email');
  }
});

// Function to send feedback emails
exports.sendFeedback = functions.https.onCall(async (data, context) => {
  const { message, rating, email } = data;
  
  if (!message) {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required');
  }
  
  const mailOptions = {
    from: '"LKHN Feedback System" <feedback@universalwealth.com>',
    to: 'christinacephus@pursuit.org',
    subject: `New Feedback (Rating: ${rating || 'N/A'})`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h3>New Feedback Submission</h3>
        <p><strong>Rating:</strong> ${rating || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 15px; background: #f7f7f7; border-left: 4px solid #C9A861; margin-top: 10px;">
          ${message}
        </div>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending feedback');
  }
});
```

### 3.3. Create index.js for Functions

Create a file named `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mailer = require('./src/mailer');

admin.initializeApp();

// Export email functions
exports.sendWaitlistConfirmation = mailer.sendWaitlistConfirmation;
exports.sendFeedback = mailer.sendFeedback;
```

## Step 4: Update WaitlistContext to Use Firebase Functions

Update your waitlist context to call the Cloud Function:

```tsx
// src/contexts/WaitlistContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import WaitlistModal from '../components/common/WaitlistModal';

interface WaitlistContextType {
  showWaitlistModal: () => void;
  hideWaitlistModal: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return context;
};

export const WaitlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const showWaitlistModal = () => setIsOpen(true);
  const hideWaitlistModal = () => setIsOpen(false);
  
  const handleWaitlistSubmit = async (email: string, name: string) => {
    try {
      console.log(`Waitlist request submitted: ${name} (${email})`);
      
      // Call the Firebase function to send email
      const functions = getFunctions();
      const sendWaitlistEmail = httpsCallable(functions, 'sendWaitlistConfirmation');
      
      await sendWaitlistEmail({ email, name });
      console.log('Waitlist confirmation email sent');
      
      // Analytics event could be tracked here
    } catch (error) {
      console.error('Error submitting waitlist request:', error);
      // Handle error - maybe show a message to the user
    }
  };
  
  return (
    <WaitlistContext.Provider value={{ showWaitlistModal, hideWaitlistModal }}>
      <WaitlistModal 
        isOpen={isOpen}
        onClose={hideWaitlistModal}
        onSubmit={handleWaitlistSubmit}
      />
      {children}
    </WaitlistContext.Provider>
  );
};

export default WaitlistContext;
```

## Step 5: Set Mailtrap Environment Variables

Set your Mailtrap credentials as Firebase environment variables:

```bash
firebase functions:config:set mailtrap.host="sandbox.smtp.mailtrap.io"
firebase functions:config:set mailtrap.port="587"
firebase functions:config:set mailtrap.user="8ea15bd2635fa8"
firebase functions:config:set mailtrap.pass="YOUR_PASSWORD_HERE"
```

## Step 6: Build and Deploy

### 6.1. Build the React Application

```bash
npm run build
```

### 6.2. Deploy to Firebase

```bash
firebase deploy
```

This command deploys both your hosting content and your Firebase Functions.

## Step 7: Enable Firebase Services in the Console

Make sure the following are enabled in your Firebase Console:
- Authentication (with Email/Password and Google providers)
- Firestore
- Storage
- Functions

## Step 8: Set Up Custom Domain (Optional)

1. Go to Firebase Hosting in the Firebase Console
2. Click on "Connect custom domain"
3. Follow the steps to verify and connect your domain

## Troubleshooting

### Email Sending Issues

- Check Firebase Functions logs for errors
- Verify Mailtrap credentials
- Make sure your Firebase project is on a paid (Blaze) plan for external network requests

### Authentication Errors

- Check Firebase Authentication settings in the console
- Ensure your domain is in the authorized domains list
- Verify that you're using the correct Firebase configuration

### CORS Issues

If you experience CORS issues, update your Firebase storage rules:

```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
      
      // Add CORS configuration
      options {
        cors: ['*'];
      }
    }
  }
}
```

## Monitoring and Maintenance

- Check Firebase Console for errors and usage
- Set up Firebase Alerts for critical issues
- Regularly update your Firebase CLI and dependencies

## Contact Support

If you encounter any issues, contact:
- Email: christinacephus@pursuit.org
- GitHub: https://github.com/theCephusHasLanded/UniversalWealth