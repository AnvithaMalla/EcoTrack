import { createContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, firebaseReady } from '../firebase';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const token = await currentUser.getIdToken();
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        token,
      });
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async ({ email, password, name }) => {
    if (!firebaseReady) {
      throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables to enable authentication.');
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    return credential.user;
  };

  const login = async ({ email, password }) => {
    if (!firebaseReady) {
      throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables to enable authentication.');
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const logout = () => (firebaseReady ? signOut(auth) : Promise.resolve());

  const resetPassword = (email) => {
    if (!firebaseReady) {
      throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables to enable password reset.');
    }
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (profile) => {
    if (!firebaseReady) {
      throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables to enable profile updates.');
    }
    if (!auth.currentUser) return null;
    await updateProfile(auth.currentUser, profile);
    setUser((current) => ({ ...current, ...profile }));
    await api.put('/api/profile', {
      name: profile.displayName ?? auth.currentUser.displayName ?? 'EcoTrack User',
      photo_url: profile.photoURL ?? auth.currentUser.photoURL ?? '',
    });
    return auth.currentUser;
  };

  const value = useMemo(() => ({ user, loading, register, login, logout, resetPassword, updateUserProfile }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
