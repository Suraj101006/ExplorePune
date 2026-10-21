'use client';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type Role = 'member' | 'moderator' | 'admin';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch role from Firestore profiles collection
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
          const r = profileDoc.exists() ? (profileDoc.data().role as Role) ?? 'member' : 'member';
          setRole(r);
        } catch {
          setRole('member');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  return {
    user,
    role,
    ready,
    isStaff: role === 'admin' || role === 'moderator',
    isAdmin: role === 'admin',
    logout,
  };
}
