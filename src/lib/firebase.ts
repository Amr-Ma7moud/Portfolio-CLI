import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove, onValue } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, browserSessionPersistence, setPersistence } from 'firebase/auth';

// Firebase configuration - Replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://YOUR_PROJECT.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Set session persistence (clears on browser/tab close)
setPersistence(auth, browserSessionPersistence).catch(console.error);

// Database references
export const portfolioRef = ref(database, 'portfolio');

// Auth helpers
export const loginWithEmail = async (email: string, password: string) => {
  // Ensure session persistence before login
  await setPersistence(auth, browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Database helpers
export const getPortfolioData = async () => {
  const snapshot = await get(portfolioRef);
  return snapshot.val();
};

export const updatePortfolioField = async (path: string, value: any) => {
  const fieldRef = ref(database, `portfolio/${path}`);
  await set(fieldRef, value);
};

export const updateMultipleFields = async (updates: Record<string, any>) => {
  const prefixedUpdates: Record<string, any> = {};
  Object.keys(updates).forEach(key => {
    prefixedUpdates[`portfolio/${key}`] = updates[key];
  });
  await update(ref(database), prefixedUpdates);
};

export const subscribeToPortfolio = (callback: (data: any) => void) => {
  return onValue(portfolioRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export { ref, get, set, update, remove };
