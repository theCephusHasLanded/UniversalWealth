![20250406_0056_Retro Macintosh Interface Nostalgia_simple_compose_01jr4q9bnce4fb0hc5nnn0apws](https://github.com/user-attachments/assets/37a7af3b-cdd2-4242-8fc2-f5b29d0bea85)

# LKHN Universal Wealth Platform

A comprehensive ecosystem integrating digital finance, physical spaces, AI-driven insights, and membership services to create universal access to prosperity.

## Features

- **Multi-language Support**: Includes English, Spanish, French, Chinese, Japanese, Russian, Xhosa, and Arabic with full RTL support.
- **Responsive Design**: Mobile-first interface built with Tailwind CSS.
- **Component Ecosystem**: Various pillars of the LKHN platform within a unified interface.
- **Enterprise-Grade Security**: End-to-end encryption, multi-factor authentication, and role-based access control.

![20250409_2350_Skyline Office View_remix_01jrex41cgfrt8xs77pm57d36c](https://github.com/user-attachments/assets/aeb8d879-f4ee-409d-b0a5-4d1f1eb03e11)

### Core Modules

1. **WEALTH BY LKHN**
   - Financial inclusion platform with AI assistant
   - Pay-in-4 credit building system
   - Community investment pools

2. **LKHN HUB**
   - Physical spaces for community, creation, and financial education
   - Events calendar and booking system
   - Local business integration

3. **LKHN TRENDCRYPTO**
   - AI-powered crypto analysis
   - Focus on XRP and emerging coins
   - 5% Premium model

4. **LIFICOSM Membership**
   - Community-powered membership platform
   - Loyalty program with points (Lificredits)
   - Digital receipts and analytics
   - Hyperlocal economic empowerment

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Firebase Auth, Firestore
- Web Crypto API for end-to-end encryption

## Security Architecture

LKHN Universal Wealth implements enterprise-grade security:

- **End-to-End Encryption (E2EE)**: Client-side AES-256-GCM encryption for sensitive financial data
- **Multi-Factor Authentication (MFA)**: TOTP and WebAuthn support beyond basic password authentication
- **Role-Based Access Control (RBAC)**: Least-privilege principle implementation
- **API Security**: OAuth 2.0 with PKCE and short-lived JWTs for API authentication
- **Data Privacy**: Minimized data collection with GDPR/CCPA compliance by design

See our [security architecture documentation](/setup/security-architecture.md) for details.

## Getting Started

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in the `.env` file

3. Set up Firebase Service Account for API Server:
   ```bash
   # Copy the example service account file
   cp setup/service-account-example.json setup/service-account.json
   
   # Then edit setup/service-account.json with your Firebase Admin SDK credentials
   # You can download this file from Firebase Console > Project Settings > Service Accounts
   ```

4. The project no longer requires Firebase Realtime Database - all functionality has been migrated to Firestore.

### Vercel Deployment

For proper production deployment to Vercel:

1. **Configure Environment Variables**:
   - Set all Firebase environment variables in your Vercel project settings:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     VITE_FIREBASE_MEASUREMENT_ID
     ```
   - Add `RECIPIENT_EMAIL` for feedback functionality
   - Set `NODE_ENV=production`

2. **Authentication**:
   - The platform supports email/password and Google authentication
   - The code includes fallback mechanisms for when Firebase isn't properly initialized

See `vercel-env-setup.md` for detailed instructions.

```bash
# Install dependencies
npm install

# Initialize Firestore collections (only needed once)
node setup/firestore-collections.js

# Start API server (in one terminal)
node server/api-routes.js

# Start development server (in another terminal)
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/components/`: UI components organized by feature
- `src/contexts/`: React context providers
- `src/pages/`: Main page components
- `src/types/`: TypeScript interfaces and types
- `src/utils/`: Helper functions and utilities
- `src/auth/`: Authentication and security-related components
- `src/services/security/`: Security services and utilities

## Universal Wealth Vision

A new paradigm for wealth that is distributed rather than concentrated, communal rather than individualistic, and inclusive by design rather than as an afterthought.

## Screenshots
<img width="458" alt="Screenshot 2025-04-09 at 11 55 24 PM" src="https://github.com/user-attachments/assets/e115cb3a-3ad6-4086-ac21-b7f506cee700" />

---

© 2025 LKHN