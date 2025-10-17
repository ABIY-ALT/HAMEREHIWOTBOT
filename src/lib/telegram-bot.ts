import TelegramBot from 'node-telegram-bot-api';
import { adminDb } from './firebase-admin';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// We initialize the bot here but without polling.
// The bot object will be used to send messages.
export const bot = new TelegramBot(token || '');

// A simple in-memory store for conversations during registration
// Note: This will not persist across different serverless function invocations.
// For a robust solution in a stateless environment, a database like Redis or Firestore
// should be used to store conversation state. For this tutorial, we accept this limitation.
export const userState: { [key: number]: { step: string; data: any } } = {};

if (!adminDb) {
    console.warn("Firebase Admin SDK is not initialized. Database operations will fail.");
}
