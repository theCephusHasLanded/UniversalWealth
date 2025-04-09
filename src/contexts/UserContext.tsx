import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
// Realtime Database import removed - using Firestore only
import { 
  uploadBytesResumable, 
  getDownloadURL, 
  ref as storageRef 
} from 'firebase/storage';
import { useAuth } from '../auth/AuthContext';
import { firestore, database, storage } from '../config/firebase';
import { 
  UserProfile, 
  OnlinePresence, 
  UserRole, 
  OnlineStatus,
  UserSettings,
  UserNotification,
  UserActivity,
  ChatRoom
} from '../types/user';

interface UserContextProps {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  onlineUsers: Record<string, OnlinePresence>;
  notifications: UserNotification[];
  unreadNotifications: number;
  recentActivity: UserActivity[];
  chatRooms: ChatRoom[];
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  uploadCoverImage: (file: File) => Promise<string>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updatePresence: (status: OnlineStatus) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  searchUsers: (query: string) => Promise<UserProfile[]>;
  connectWithUser: (userId: string) => Promise<void>;
  createChatRoom: (name: string, participants: string[], type: 'private' | 'group') => Promise<string>;
}

const UserContext = createContext<UserContextProps | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const DEFAULT_USER_SETTINGS: UserSettings = {
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
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, OnlinePresence>>({});
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  // Get unread notifications count
  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  // Initialize and load user profile data
  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userDocRef = doc(firestore, 'users', currentUser.uid);

    // First check if the user document exists
    getDoc(userDocRef).then(async (docSnap) => {
      if (docSnap.exists()) {
        // User exists, set profile from document
        const userData = docSnap.data() as UserProfile;
        setUserProfile(userData);
      } else {
        // User does not exist, create a new profile
        try {
          const newUser: UserProfile = {
            userId: currentUser.uid,
            displayName: currentUser.displayName || 'User',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || undefined,
            roles: [UserRole.USER],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            accountStatus: 'active',
            settings: DEFAULT_USER_SETTINGS
          };
          
          await setDoc(userDocRef, newUser);
          setUserProfile(newUser);
        } catch (err: any) {
          setError('Failed to create user profile: ' + err.message);
        }
      }
      setLoading(false);
    }).catch(err => {
      setError('Failed to load user profile: ' + err.message);
      setLoading(false);
    });

    // Setup real-time listeners once user is authenticated
    if (currentUser) {
      // Listen for user profile changes
      const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        }
      }, (err) => {
        setError('Error listening to profile changes: ' + err.message);
      });

      // Listen for notifications
      const notificationsRef = collection(firestore, 'users', currentUser.uid, 'notifications');
      const notificationsQuery = query(notificationsRef);
      
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const notifs: UserNotification[] = [];
        snapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() } as UserNotification);
        });
        // Sort by date, newest first
        notifs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setNotifications(notifs);
      }, (err) => {
        setError('Error listening to notifications: ' + err.message);
      });

      // Listen for user activity
      const activityRef = collection(firestore, 'users', currentUser.uid, 'activity');
      const activityQuery = query(activityRef);
      
      const unsubscribeActivity = onSnapshot(activityQuery, (snapshot) => {
        const activities: UserActivity[] = [];
        snapshot.forEach((doc) => {
          activities.push({ id: doc.id, ...doc.data() } as UserActivity);
        });
        // Sort by date, newest first
        activities.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setRecentActivity(activities);
      }, (err) => {
        setError('Error listening to activity: ' + err.message);
      });

      // Listen for chat rooms
      const chatRoomsRef = collection(firestore, 'chatRooms');
      const chatRoomsQuery = query(chatRoomsRef, where('participants', 'array-contains', currentUser.uid));
      
      const unsubscribeChatRooms = onSnapshot(chatRoomsQuery, (snapshot) => {
        const rooms: ChatRoom[] = [];
        snapshot.forEach((doc) => {
          rooms.push({ id: doc.id, ...doc.data() } as ChatRoom);
        });
        // Sort by last message timestamp, newest first
        rooms.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp?.toMillis() || a.updatedAt.toMillis();
          const bTime = b.lastMessage?.timestamp?.toMillis() || b.updatedAt.toMillis();
          return bTime - aTime;
        });
        setChatRooms(rooms);
      }, (err) => {
        setError('Error listening to chat rooms: ' + err.message);
      });

      // Setup online presence tracking
      setupOnlinePresence(currentUser.uid);

      // Listen for online users using Firestore
      const presenceQuery = query(collection(firestore, 'presence'));
      const unsubscribeOnlineUsers = onSnapshot(presenceQuery, (snapshot) => {
        const users: Record<string, OnlinePresence> = {};
        snapshot.forEach(doc => {
          users[doc.id] = doc.data() as OnlinePresence;
        });
        setOnlineUsers(users);
      });

      // Cleanup listeners when unmounted
      return () => {
        unsubscribeProfile();
        unsubscribeNotifications();
        unsubscribeActivity();
        unsubscribeChatRooms();
        unsubscribeOnlineUsers();
      };
    }
  }, [currentUser]);

  // Setup user online presence monitoring using only Firestore
  const setupOnlinePresence = (userId: string) => {
    if (!userId) return;

    // Create Firestore reference
    const userStatusFirestoreRef = doc(firestore, 'presence', userId);

    // Set online status in Firestore
    const onlineStatus: OnlinePresence = {
      status: OnlineStatus.ONLINE,
      lastActive: Timestamp.now(),
      device: navigator.userAgent
    };
    
    // Update presence when user is online
    setDoc(userStatusFirestoreRef, onlineStatus, { merge: true })
      .catch(err => {
        console.warn('Error updating presence in Firestore:', err.message);
      });
    
    // Set up a periodic update for presence in Firestore
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setDoc(userStatusFirestoreRef, {
          status: OnlineStatus.ONLINE,
          lastActive: Timestamp.now(),
          device: navigator.userAgent
        }, { merge: true });
      }
    }, 60000); // Update every minute
    
    // Handle page visibility changes to update status
    const handleVisibilityChange = () => {
      const newStatus = document.visibilityState === 'visible' 
        ? OnlineStatus.ONLINE 
        : OnlineStatus.AWAY;
      
      setDoc(userStatusFirestoreRef, {
        status: newStatus,
        lastActive: Timestamp.now(),
        device: navigator.userAgent
      }, { merge: true });
    };
    
    // Update status on visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle page unload to set offline status
    const handleUnload = () => {
      const offlineStatus = {
        status: OnlineStatus.OFFLINE,
        lastActive: Timestamp.now(),
        device: navigator.userAgent
      };
      
      // Use navigator.sendBeacon for more reliable offline status
      try {
        navigator.sendBeacon(
          `https://firestore.googleapis.com/v1/projects/lkhn-wealth/databases/(default)/documents/presence/${userId}`,
          JSON.stringify({
            fields: {
              status: { stringValue: OnlineStatus.OFFLINE },
              lastActive: { timestampValue: new Date().toISOString() },
              device: { stringValue: navigator.userAgent }
            }
          })
        );
      } catch (e) {
        // Fallback to synchronous XHR if sendBeacon is not supported
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `/api/offline-status?userId=${userId}`, false);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(offlineStatus));
        } catch (err) {
          console.warn('Failed to send offline status');
        }
      }
    };
    
    // Update status on page unload
    window.addEventListener('beforeunload', handleUnload);
    
    // Return cleanup function
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
    };
  };

  // Update user profile information
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      const userRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      // Log activity for profile update
      const activityRef = collection(firestore, 'users', currentUser.uid, 'activity');
      const activityData: UserActivity = {
        id: Date.now().toString(),
        type: 'profile_update',
        title: 'Profile Updated',
        description: 'You updated your profile information',
        timestamp: Timestamp.now(),
        metadata: {
          updatedFields: Object.keys(data)
        }
      };
      
      await setDoc(doc(activityRef, activityData.id), activityData);

      return Promise.resolve();
    } catch (err: any) {
      setError('Failed to update profile: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Upload a profile image to Firebase Storage
  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!currentUser) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      const storageReference = storageRef(storage, `users/${currentUser.uid}/profile_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Progress tracking if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            // Handle unsuccessful uploads
            setError('Failed to upload image: ' + error.message);
            reject(error);
          },
          async () => {
            // Handle successful uploads
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Update the user profile with the new image URL
            const userRef = doc(firestore, 'users', currentUser.uid);
            await updateDoc(userRef, {
              photoURL: downloadURL,
              updatedAt: serverTimestamp()
            });
            
            resolve(downloadURL);
          }
        );
      });
    } catch (err: any) {
      setError('Failed to upload image: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Upload a cover image to Firebase Storage
  const uploadCoverImage = async (file: File): Promise<string> => {
    if (!currentUser) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      const storageReference = storageRef(storage, `users/${currentUser.uid}/cover_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Progress tracking if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            // Handle unsuccessful uploads
            setError('Failed to upload cover image: ' + error.message);
            reject(error);
          },
          async () => {
            // Handle successful uploads
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Update the user profile with the new cover image URL
            const userRef = doc(firestore, 'users', currentUser.uid);
            await updateDoc(userRef, {
              coverPhotoURL: downloadURL,
              updatedAt: serverTimestamp()
            });
            
            resolve(downloadURL);
          }
        );
      });
    } catch (err: any) {
      setError('Failed to upload cover image: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!currentUser || !userProfile) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      const userRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'settings': {
          ...userProfile.settings,
          ...settings
        },
        updatedAt: serverTimestamp()
      });

      return Promise.resolve();
    } catch (err: any) {
      setError('Failed to update settings: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Update user online status
  const updatePresence = async (status: OnlineStatus) => {
    if (!currentUser) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      // Update in Realtime Database
      const userStatusDatabaseRef = ref(database, `status/${currentUser.uid}`);
      await set(userStatusDatabaseRef, {
        status,
        lastActive: rtdbServerTimestamp(),
        device: navigator.userAgent
      });

      // Update in Firestore
      const userStatusFirestoreRef = doc(firestore, 'presence', currentUser.uid);
      await setDoc(userStatusFirestoreRef, {
        status,
        lastActive: Timestamp.now(),
        device: navigator.userAgent
      }, { merge: true });

      return Promise.resolve();
    } catch (err: any) {
      setError('Failed to update presence: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    if (!currentUser) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      const notificationRef = doc(firestore, 'users', currentUser.uid, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });

      return Promise.resolve();
    } catch (err: any) {
      setError('Failed to mark notification as read: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    if (!currentUser) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      const batch = firestore.batch();
      
      // Get all unread notifications
      const notificationsRef = collection(firestore, 'users', currentUser.uid, 'notifications');
      const unreadQuery = query(notificationsRef, where('read', '==', false));
      const unreadDocs = await getDocs(unreadQuery);
      
      // Update each one
      unreadDocs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      
      await batch.commit();
      return Promise.resolve();
    } catch (err: any) {
      setError('Failed to mark all notifications as read: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Fetch a user profile by ID
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else {
        return null;
      }
    } catch (err: any) {
      setError('Failed to fetch user profile: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Search for users by name or email
  const searchUsers = async (searchQuery: string): Promise<UserProfile[]> => {
    try {
      const usersRef = collection(firestore, 'users');
      
      // This is a simple implementation. In a real app, you would use
      // Firebase's search capabilities or a third-party service like Algolia
      const nameQuery = query(usersRef, where('displayName', '>=', searchQuery), where('displayName', '<=', searchQuery + '\uf8ff'));
      const emailQuery = query(usersRef, where('email', '>=', searchQuery), where('email', '<=', searchQuery + '\uf8ff'));
      
      const [nameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(emailQuery)
      ]);
      
      const results: UserProfile[] = [];
      
      // Combine and deduplicate results
      const addedIds = new Set<string>();
      
      nameSnapshot.forEach(doc => {
        if (!addedIds.has(doc.id)) {
          results.push(doc.data() as UserProfile);
          addedIds.add(doc.id);
        }
      });
      
      emailSnapshot.forEach(doc => {
        if (!addedIds.has(doc.id)) {
          results.push(doc.data() as UserProfile);
          addedIds.add(doc.id);
        }
      });
      
      return results;
    } catch (err: any) {
      setError('Failed to search users: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Connect with another user
  const connectWithUser = async (userId: string) => {
    if (!currentUser || !userProfile) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    if (userId === currentUser.uid) {
      setError('Cannot connect with yourself');
      return Promise.reject('Cannot connect with yourself');
    }

    try {
      // Check if the connection already exists
      const userRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const connections = userData.connections || [];
        
        // Check if already connected
        const existingConnection = connections.find(conn => conn.userId === userId);
        
        if (existingConnection) {
          if (existingConnection.status === 'connected') {
            setError('Already connected with this user');
            return Promise.reject('Already connected with this user');
          } else if (existingConnection.status === 'pending') {
            setError('Connection request already pending');
            return Promise.reject('Connection request already pending');
          } else if (existingConnection.status === 'blocked') {
            setError('User is blocked');
            return Promise.reject('User is blocked');
          }
        }
        
        // Add the connection
        const newConnection = {
          userId,
          status: 'pending',
          since: Timestamp.now()
        };
        
        const updatedConnections = [...connections, newConnection];
        
        await updateDoc(userRef, {
          connections: updatedConnections,
          updatedAt: serverTimestamp()
        });
        
        // Also add a notification for the other user
        const otherUserNotifRef = doc(collection(firestore, 'users', userId, 'notifications'));
        
        await setDoc(otherUserNotifRef, {
          type: 'CONNECTION_REQUEST',
          title: 'New Connection Request',
          message: `${userProfile.displayName} wants to connect with you`,
          read: false,
          createdAt: serverTimestamp(),
          data: {
            senderId: currentUser.uid,
            senderName: userProfile.displayName,
            senderPhoto: userProfile.photoURL
          }
        });
        
        return Promise.resolve();
      } else {
        setError('User profile not found');
        return Promise.reject('User profile not found');
      }
    } catch (err: any) {
      setError('Failed to connect with user: ' + err.message);
      return Promise.reject(err);
    }
  };

  // Create a new chat room
  const createChatRoom = async (name: string, participants: string[], type: 'private' | 'group'): Promise<string> => {
    if (!currentUser) {
      setError('No authenticated user');
      return Promise.reject('No authenticated user');
    }

    try {
      // For private chats, check if a chat room already exists
      if (type === 'private' && participants.length === 1) {
        const otherUserId = participants[0];
        
        // Check existing chat rooms
        const chatRoomsRef = collection(firestore, 'chatRooms');
        const privateChatsQuery = query(
          chatRoomsRef, 
          where('type', '==', 'private'),
          where('participants', 'array-contains', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(privateChatsQuery);
        
        // Find a room with just these two participants
        const existingRoom = querySnapshot.docs.find(doc => {
          const roomData = doc.data() as ChatRoom;
          return roomData.participants.length === 2 && 
                 roomData.participants.includes(otherUserId);
        });
        
        if (existingRoom) {
          return existingRoom.id;
        }
      }
      
      // Create a new chat room
      const chatRoomRef = doc(collection(firestore, 'chatRooms'));
      
      const chatRoomData: ChatRoom = {
        id: chatRoomRef.id,
        name,
        type,
        participants: [currentUser.uid, ...participants],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        metadata: {
          createdBy: currentUser.uid
        }
      };
      
      await setDoc(chatRoomRef, chatRoomData);
      
      return chatRoomRef.id;
    } catch (err: any) {
      setError('Failed to create chat room: ' + err.message);
      return Promise.reject(err);
    }
  };

  const value = {
    userProfile,
    loading,
    error,
    onlineUsers,
    notifications,
    unreadNotifications,
    recentActivity,
    chatRooms,
    updateProfile,
    uploadProfileImage,
    uploadCoverImage,
    updateUserSettings,
    updatePresence,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchUserProfile,
    searchUsers,
    connectWithUser,
    createChatRoom
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;