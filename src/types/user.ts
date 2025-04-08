import { Timestamp } from 'firebase/firestore';

export enum UserRole {
  USER = 'user',
  COMMUNITY_LEADER = 'community_leader',
  BUSINESS_OWNER = 'business_owner',
  ADMIN = 'admin'
}

export enum OnlineStatus {
  ONLINE = 'online',
  AWAY = 'away',
  OFFLINE = 'offline'
}

export enum NotificationType {
  MESSAGE = 'message',
  COMMUNITY_UPDATE = 'community_update',
  INVESTMENT_OPPORTUNITY = 'investment_opportunity',
  HUB_EVENT = 'hub_event',
  WEALTH_MILESTONE = 'wealth_milestone',
  MARKET_ALERT = 'market_alert',
  LIFICOSM_REWARD = 'lificosm_reward'
}

export interface UserSettings {
  language: string;
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  timezone: string;
  privacySettings: {
    showProfile: boolean;
    showOnlineStatus: boolean;
    showActivity: boolean;
    allowMessages: boolean;
  };
}

export interface OnlinePresence {
  status: OnlineStatus;
  lastActive: Timestamp;
  currentlyViewing?: string;
  device?: string;
}

export interface UserNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  data?: any;
  link?: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Timestamp;
  category: string;
}

export interface UserConnection {
  userId: string;
  status: 'pending' | 'connected' | 'blocked';
  since: Timestamp;
  notes?: string;
}

export interface UserActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Timestamp;
  metadata?: any;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  coverPhotoURL?: string;
  bio?: string;
  location?: string;
  roles: UserRole[];
  badges?: string[];
  phoneNumber?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  lastLogin?: Timestamp;
  invitedBy?: string;
  // Stats and tracking
  wealthScore?: number;
  communityContributions?: number;
  eventAttendance?: number;
  creditScore?: number;
  connections?: UserConnection[];
  settings: UserSettings;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  edited: boolean;
  replyTo?: string;
  attachments?: {
    type: 'image' | 'file' | 'audio' | 'video';
    url: string;
    name: string;
    size?: number;
  }[];
  reactions?: Record<string, string[]>; // emoji -> array of userIds
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'community' | 'event';
  participants: string[]; // user IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Timestamp;
  };
  metadata?: {
    description?: string;
    icon?: string;
    createdBy?: string;
    topic?: string;
    pinned?: boolean;
  };
  conversationStatus?: 'active' | 'archived';
}

export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: string[]; // user IDs
  commentCount: number;
  viewCount: number;
  category: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  featured?: boolean;
  status: 'published' | 'draft' | 'removed';
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: string[]; // user IDs
  replyTo?: string; // parent comment ID for nested comments
  depth: number; // 0 for top-level comments
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  status: 'active' | 'removed';
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  parentCategory?: string;
  moderators: string[]; // user IDs
  postCount: number;
  lastPostAt?: Timestamp;
}