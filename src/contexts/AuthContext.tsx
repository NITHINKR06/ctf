'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;  // Alias for signIn
  register: (email: string, password: string, name: string) => Promise<void>;  // Alias for signUp
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's display name
    await updateProfile(userCredential.user, { displayName: name });
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      // Handle specific Google sign-in errors
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled');
      }
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    login: signIn,  // Provide alias for consistency with login page
    register: signUp,  // Provide alias for consistency with register page
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
