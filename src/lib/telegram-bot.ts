import { adminDb } from './firebase-admin';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// A simple in-memory store for conversations during registration
// Note: This will not persist across different serverless function invocations.
// For a robust solution in a stateless environment, a database like Redis or Firestore
// should be used to store conversation state. For this tutorial, we accept this limitation.
export const userState: { [key: number]: { step: string; data: any } } = {};

if (!adminDb) {
    console.warn("Firebase Admin SDK is not initialized. Database operations will fail.");
}
