# Vercel Deployment Notes

This file contains notes about deploying this project to Vercel.

## Custom Build Process

We use a custom build process defined in `vercel-build.js` to ensure proper dependency resolution.

## Installation

The installation process uses `--legacy-peer-deps` to avoid React version conflicts with Three.js dependencies.

## Environment Variables

Make sure to set the following environment variables in your Vercel project:
- `RECIPIENT_EMAIL`: Email address to receive feedback submissions
- `NODE_ENV`: Should be set to "production" for production deployments

## API Routes

API routes are handled by our Express server in `server/api-server.js`.