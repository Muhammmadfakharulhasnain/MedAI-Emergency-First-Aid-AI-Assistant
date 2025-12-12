import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Use environment variables for configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let db: any;
let auth: any;
let storage: any;

const isConfigValid = !!firebaseConfig.apiKey;

if (!isConfigValid) {
  console.warn("⚠️ Firebase API Key is missing. App is running in offline/demo mode. Backend features will not work.");
  
  // Mock services to prevent crashes
  const mockAsync = async () => { console.warn("Operation ignored: Firebase not configured."); return null; };
  const mockRef = () => ({ put: mockAsync, getDownloadURL: async () => "" });
  
  db = { 
    collection: () => ({ 
      add: async () => { console.log("Mock Firestore Add"); return { id: 'mock-id' }; } 
    }) 
  };
  
  auth = { 
    signInAnonymously: mockAsync,
    currentUser: null
  };
  
  storage = { ref: mockRef };

} else {
  // Initialize Firebase
  const app = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();

  db = firebase.firestore(app);
  auth = firebase.auth(app);
  storage = firebase.storage(app);

  // Auto-sign in
  auth.signInAnonymously().catch((err: any) => console.error('Auth error:', err));
}

// Helper for server timestamp that works with or without initialized firebase
export const serverTimestamp = () => {
  if (isConfigValid) {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  return new Date(); // Fallback for mock mode
};

export { db, auth, storage };