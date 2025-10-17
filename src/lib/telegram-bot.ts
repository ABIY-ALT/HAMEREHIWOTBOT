
import TelegramBot from 'node-telegram-bot-api';
import { adminDb } from './firebase-admin';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// Initialize the bot, but don't set up listeners yet.
export const bot = token ? new TelegramBot(token) : {} as TelegramBot;

// A simple in-memory store for conversations
const userState: { [key: number]: { step: string, data: any } } = {};

if (token) {
    // These commands DON'T need a database connection.
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Welcome! Use /register to create your profile or /help to see commands.");
    });

    bot.onText(/\/help/, (msg) => {
        const helpText = `
Available commands:
/start - Welcome message
/register - Create your profile
/myinfo - View your profile
/updateinfo - Update your profile
/attend - Mark your attendance
/mylocation - Update your location
/attendance_status - Check today's attendance
/attendance_history - View your past attendance
/help - Show this help message
        `;
        bot.sendMessage(msg.chat.id, helpText.trim());
    });

    // These commands DO need a database connection.
    bot.onText(/\/register/, async (msg) => {
        const userId = msg.from?.id;
        if (!userId) return;

        // Check if database is connected.
        if (!adminDb) {
            bot.sendMessage(userId, "Sorry, I can't register users right now. The database connection is not available. Please contact an admin.");
            console.error("Attempted to register user, but adminDb is not initialized.");
            return;
        }

        const userDoc = await adminDb.collection('users').doc(String(userId)).get();

        if (userDoc.exists) {
            bot.sendMessage(userId, "You are already registered! Use /myinfo to see your details.");
        } else {
            userState[userId] = { step: 'name', data: {} };
            bot.sendMessage(userId, "Let's get you registered. What is your full name?");
        }
    });

    bot.on('message', async (msg) => {
        const userId = msg.from?.id;
        const text = msg.text;

        // Ignore commands or messages from users not in a registration flow
        if (!userId || !text || text.startsWith('/') || !userState[userId]) {
            // Check if it's a non-command message we should respond to
            if (text && !text.startsWith('/') && !userState[userId]) {
                 bot.sendMessage(userId, `I'm not sure how to respond to that. Please use /help to see a list of available commands.`);
            }
            return;
        }

        const state = userState[userId];
        if (!state) return;

        switch (state.step) {
            case 'name':
                state.data.name = text;
                state.step = 'phone';
                bot.sendMessage(userId, "Great. Now, what's your phone number?");
                break;
            case 'phone':
                state.data.phone = text;
                state.step = 'email';
                bot.sendMessage(userId, "Got it. What's your email address?");
                break;
            case 'email':
                state.data.email = text;
                
                if (!adminDb) {
                    bot.sendMessage(userId, "Something went wrong during registration. The database is not connected. Please try again later.");
                    console.error("Attempted to save user, but adminDb is not initialized.");
                    delete userState[userId];
                    return;
                }
                // Save to Firestore
                try {
                    await adminDb.collection('users').doc(String(userId)).set({
                        ...state.data,
                        role: 'user', // Default role
                        telegramId: userId,
                    });
                    bot.sendMessage(userId, "You are registered successfully! Use /attend to mark attendance.");
                } catch (error) {
                    console.error("Error saving user to Firestore:", error);
                    bot.sendMessage(userId, "Something went wrong during registration. Please try again later.");
                }

                // Clean up state
                delete userState[userId];
                break;
        }
    });
}
