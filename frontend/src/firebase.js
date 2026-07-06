import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const createFallbackAuth = () => ({
  currentUser: null,
});

const createFallbackDb = () => null;

const app = isConfigured ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;

export const firebaseReady = isConfigured;
export const auth = app ? getAuth(app) : createFallbackAuth();
export const db = app ? getFirestore(app) : createFallbackDb();

if (app) {
  setPersistence(auth, browserLocalPersistence).catch(() => undefined);
}
