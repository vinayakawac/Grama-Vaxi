import 'server-only'

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'

let adminApp;

try {
  adminApp =
    getApps().find((a) => a.name === 'admin') ??
    initializeApp(
      {
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
            /\\n/g,
            '\n'
          ),
        }),
      },
      'admin'
    );
} catch (error) {
  console.error('Firebase Admin Initialization Error', error);
  // We initialize a default app if cert fails during build time so `next build` doesn't crash
  // However, this default app will fail if you try to use its services without proper credentials
  adminApp = getApps().find((a) => a.name === 'admin') ?? initializeApp({ projectId: 'dummy-project-id' }, 'admin');
}

export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
export const messaging = getMessaging(adminApp)
