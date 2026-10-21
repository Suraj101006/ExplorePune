import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK for server-side operations (API routes).
// Uses Application Default Credentials or GOOGLE_APPLICATION_CREDENTIALS env var.
// In production, set GOOGLE_APPLICATION_CREDENTIALS to the path of a service account JSON file,
// or deploy on a Google Cloud environment where default credentials are available.
function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    try {
      const parsed = JSON.parse(serviceAccount);
      return initializeApp({ credential: cert(parsed), projectId: 'punetrail' });
    } catch {
      // Fall through to default credentials
    }
  }

  return initializeApp({ projectId: 'punetrail' });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export { adminApp };
