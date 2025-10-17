import { NextRequest, NextResponse } from 'next/server';
import { bot, userState } from '@/lib/telegram-bot';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const msg = body.message;

    if (!msg || !msg.from || !msg.text) {
        return NextResponse.json({ status: 200 });
    }

    const userId = msg.from.id;
    const text = msg.text;
    const chatId = msg.chat.id;

    // Handle commands
    if (text.startsWith('/')) {
        const command = text.split(' ')[0];

        switch(command) {
            case '/start':
                bot.sendMessage(chatId, "Welcome! Use /register to create your profile or /help to see commands.");
                break;
            
            case '/help':
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
                bot.sendMessage(chatId, helpText.trim());
                break;
            
            case '/register':
                if (!adminDb) {
                    bot.sendMessage(chatId, "Sorry, the registration service is temporarily unavailable. Please try again later.");
                    return NextResponse.json({ status: 200 });
                }
                try {
                    const userDoc = await adminDb.collection('users').doc(String(userId)).get();
                    if (userDoc.exists) {
                        bot.sendMessage(chatId, 'You are already registered! Use /myinfo to see your details.');
                    } else {
                        userState[userId] = { step: 'name', data: {} };
                        bot.sendMessage(chatId, "Let's get you registered. What is your full name?");
                    }
                } catch (error) {
                    console.error("Error checking user registration:", error);
                    bot.sendMessage(chatId, "Sorry, something went wrong. Please try again later.");
                }
                break;

            default:
                bot.sendMessage(chatId, "I don't recognize that command. Please use /help to see a list of available commands.");
                break;
        }

    } else if (userState[userId]) { // Handle conversational replies for registration
        const state = userState[userId];

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
                    delete userState[userId];
                    return NextResponse.json({ status: 200 });
                }

                try {
                    await adminDb.collection('users').doc(String(userId)).set({
                        ...state.data,
                        role: 'user',
                        telegramId: userId,
                    });
                    bot.sendMessage(userId, 'You are registered successfully! Use /attend to mark attendance.');
                } catch (error) {
                    console.error('Error saving user to Firestore:', error);
                    bot.sendMessage(userId, 'Something went wrong during registration. Please try again later.');
                }
                delete userState[userId]; // Clean up state
                break;
        }
    } else {
        // Default response for non-commands if not in a conversation
        bot.sendMessage(chatId, "I'm not sure how to respond to that. Please use /help to see a list of available commands.");
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

// The webhook needs to be set up only once.
// A GET request to this endpoint will set the webhook.
export async function GET() {
  try {
    const baseUrl = process.env.WEBHOOK_BASE_URL;
    if (!baseUrl) {
        return NextResponse.json({
            status: 500,
            message: "WEBHOOK_BASE_URL not set in environment variables.",
        });
    }
    const webhookUrl = `${baseUrl}/api/webhook`;
    await bot.setWebHook(webhookUrl);
    return NextResponse.json({ status: 200, message: `Webhook set to ${webhookUrl}` });
  } catch (error) {
    console.error('Error setting webhook:', error);
    return NextResponse.json({ status: 500, message: 'Error setting webhook' });
  }
}
