import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfxzypc2mqyQwPx9WqOsttvGScJOfUHSw",
  authDomain: "punetrail.firebaseapp.com",
  projectId: "punetrail",
  storageBucket: "punetrail.firebasestorage.app",
  messagingSenderId: "783087382799",
  appId: "1:783087382799:web:ac5de4e4e481863bf44e7a",
  measurementId: "G-FWL0E1R99L",
};

// Prevent re-initializing on hot-reload in development
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
