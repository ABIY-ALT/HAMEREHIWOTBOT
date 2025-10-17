
import TelegramBot from 'node-telegram-bot-api';
import { adminDb } from './firebase-admin';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// Initialize the bot without polling.
// Polling will be disabled to use the webhook method, which is better for serverless environments.
export const bot = token ? new TelegramBot(token) : ({} as TelegramBot);

// A simple in-memory store for conversations during registration
export const userState: { [key: number]: { step: string; data: any } } = {};

if (token && !adminDb) {
    console.error("Firebase Admin SDK is not initialized. Database operations will fail.");
}
