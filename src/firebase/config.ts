import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Use environment variables if available, otherwise fallback to the hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAza1Gtzy1NKLwUVEV0Ey879OhNQlEwvlg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nistego-c30a3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nistego-c30a3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nistego-c30a3.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "401267831237",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:401267831237:web:35d070cb21e276396b1bac",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WWSJM6WJ9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage }; 