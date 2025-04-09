import { firestore } from '../config/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { OnlineStatus } from '../types/user';

// API endpoint to handle offline status updates when page unloads
// This will be called via navigator.sendBeacon for reliable offline status updates
export const updateOfflineStatus = async (userId: string): Promise<void> => {
  if (!userId) return;
  
  try {
    const userStatusFirestoreRef = doc(firestore, 'presence', userId);
    await setDoc(userStatusFirestoreRef, {
      status: OnlineStatus.OFFLINE,
      lastActive: Timestamp.now(),
      device: navigator.userAgent
    }, { merge: true });
  } catch (error) {
    console.error('Failed to update offline status:', error);
  }
};

// Mock API endpoints to match potential backend functionality
export const API_ENDPOINTS = {
  // User-related endpoints
  USER: {
    PROFILE: '/api/user/profile',
    PRESENCE: '/api/offline-status',
    NOTIFICATIONS: '/api/user/notifications',
    ACTIVITY: '/api/user/activity',
  },
  
  // Forum-related endpoints
  FORUM: {
    CATEGORIES: '/api/forum/categories',
    POSTS: '/api/forum/posts',
    COMMENTS: '/api/forum/comments',
  },
  
  // Wealth-related endpoints
  WEALTH: {
    CREDIT_SCORE: '/api/wealth/credit-score',
    PAYMENT_PLANS: '/api/wealth/payment-plans',
    COMMUNITY_INVESTMENTS: '/api/wealth/community-investments',
  },
  
  // Hub-related endpoints
  HUB: {
    EVENTS: '/api/hub/events',
    BOOKINGS: '/api/hub/bookings',
    LOCATIONS: '/api/hub/locations',
  },
  
  // TrendCrypto-related endpoints
  TREND_CRYPTO: {
    MARKET_DATA: '/api/trend-crypto/market-data',
    AI_PREDICTIONS: '/api/trend-crypto/ai-predictions',
    PORTFOLIO_ANALYSIS: '/api/trend-crypto/portfolio-analysis',
  },
  
  // Agent-related endpoints
  AGENT: {
    TASKS: '/api/agent/tasks',
    TRADES: '/api/agent/trades',
    SCHEDULE: '/api/agent/schedule',
  },
};