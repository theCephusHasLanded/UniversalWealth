import React, { useEffect, useState } from 'react';
import { firestore, auth, storage } from '../../config/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({
    firestore: { status: 'pending', message: 'Testing Firestore...' },
    auth: { status: 'pending', message: 'Testing Auth...' },
    storage: { status: 'pending', message: 'Testing Storage...' },
    cors: { status: 'pending', message: 'Testing CORS...' }
  });

  useEffect(() => {
    // Test Firestore
    const testFirestore = async () => {
      try {
        const q = query(collection(firestore, 'forumCategories'), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setTestResults(prev => ({
            ...prev,
            firestore: { 
              status: 'warning', 
              message: 'Connected to Firestore, but no documents found in forumCategories collection.' 
            }
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            firestore: { 
              status: 'success', 
              message: 'Successfully connected to Firestore and retrieved documents.' 
            }
          }));
        }
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          firestore: { 
            status: 'error', 
            message: `Firestore error: ${error.message}` 
          }
        }));
      }
    };

    // Test Auth
    const testAuth = async () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setTestResults(prev => ({
              ...prev,
              auth: { 
                status: 'success', 
                message: `Successfully connected to Auth. User: ${user.email}` 
              }
            }));
          } else {
            setTestResults(prev => ({
              ...prev,
              auth: { 
                status: 'warning', 
                message: 'Connected to Auth, but no user is signed in.' 
              }
            }));
          }
        });
        
        // Cleanup
        return () => unsubscribe();
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          auth: { 
            status: 'error', 
            message: `Auth error: ${error.message}` 
          }
        }));
      }
    };

    // Test Storage
    const testStorage = async () => {
      try {
        const storageRef = ref(storage);
        await listAll(storageRef);
        
        setTestResults(prev => ({
          ...prev,
          storage: { 
            status: 'success', 
            message: 'Successfully connected to Storage.' 
          }
        }));
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          storage: { 
            status: 'error', 
            message: `Storage error: ${error.message}` 
          }
        }));
      }
    };

    // Test CORS
    const testCORS = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/forum/categories');
        
        if (response.ok) {
          const data = await response.json();
          setTestResults(prev => ({
            ...prev,
            cors: { 
              status: 'success', 
              message: 'Successfully made CORS request to local API.' 
            }
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            cors: { 
              status: 'warning', 
              message: `CORS request failed with status: ${response.status}` 
            }
          }));
        }
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          cors: { 
            status: 'error', 
            message: `CORS error: ${error.message}` 
          }
        }));
      }
    };

    // Run all tests
    testFirestore();
    testAuth();
    testStorage();
    testCORS();
  }, []);

  return (
    <div className="p-6 bg-navy-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gold">Firebase Connectivity Test</h2>
      
      <div className="space-y-4">
        {Object.entries(testResults).map(([service, result]) => (
          <div 
            key={service}
            className={`p-4 rounded-md ${
              result.status === 'success' ? 'bg-green-900/30 border border-green-700' :
              result.status === 'warning' ? 'bg-yellow-900/30 border border-yellow-700' :
              result.status === 'error' ? 'bg-red-900/30 border border-red-700' :
              'bg-gray-800/30 border border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium capitalize">{service}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                result.status === 'success' ? 'bg-green-800 text-green-200' :
                result.status === 'warning' ? 'bg-yellow-800 text-yellow-200' :
                result.status === 'error' ? 'bg-red-800 text-red-200' :
                'bg-gray-700 text-gray-300'
              }`}>
                {result.status}
              </span>
            </div>
            <p className="mt-2 text-sm opacity-80">{result.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-navy-700 rounded-md">
        <h3 className="text-sm font-medium mb-2">Debugging Information</h3>
        <pre className="text-xs overflow-auto p-2 bg-navy-800 rounded">
          {JSON.stringify({
            environment: {
              NODE_ENV: process.env.NODE_ENV,
              hostname: window.location.hostname,
              apiUrl: 'http://localhost:3001/api',
            },
            firebase: {
              projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
              authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
              databaseUrl: import.meta.env.VITE_FIREBASE_DATABASE_URL,
              emulatorMode: window.location.hostname === 'localhost',
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FirebaseTest;