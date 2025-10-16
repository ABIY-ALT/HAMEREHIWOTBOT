import admin from 'firebase-admin';

// This ensures we only initialize the app once, which is important in serverless environments.
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    console.error("Firebase Admin SDK environment variables are not set.");
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } catch (error) {
        console.error("Firebase Admin SDK initialization error:", error);
    }
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : undefined;
