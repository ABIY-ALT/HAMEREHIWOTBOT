import { NextRequest, NextResponse } from 'next/server';
import { bot, userState } from '@/lib/telegram-bot';
import { adminDb } from '@/lib/firebase-admin';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.message || !body.message.from || !body.message.text) {
      return NextResponse.json({ status: 200, message: "Not a message to process" });
    }

    const msg = body.message;
    const userId = msg.from.id;
    const text = msg.text;
    const chatId = msg.chat.id;

    if (userState[userId]) {
        const state = userState[userId];

        switch (state.step) {
            case 'name':
                state.data.name = text;
                state.step = 'phone';
                await bot.sendMessage(chatId, "Great. Now, what's your phone number?");
                break;
            case 'phone':
                state.data.phone = text;
                state.step = 'email';
                await bot.sendMessage(chatId, "Got it. What's your email address?");
                break;
            case 'email':
                state.data.email = text;
                if (!adminDb) {
                    await bot.sendMessage(chatId, "Something went wrong during registration. The database is not connected. Please try again later.");
                    delete userState[userId];
                    break;
                }

                try {
                    await adminDb.collection('users').doc(String(userId)).set({
                        ...state.data,
                        role: 'user',
                        telegramId: userId,
                    });
                    await bot.sendMessage(chatId, 'You are registered successfully! Use /attend to mark attendance.');
                } catch (error) {
                    console.error('Error saving user to Firestore:', error);
                    await bot.sendMessage(chatId, 'Something went wrong during registration. Please try again later.');
                }
                delete userState[userId];
                break;
        }
    } 
    else if (text.startsWith('/')) {
        const command = text.split(' ')[0];

        switch(command) {
            case '/start':
                await bot.sendMessage(chatId, "Welcome! Use /register to create your profile or /help to see commands.");
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
                `.trim();
                await bot.sendMessage(chatId, helpText);
                break;
            
            case '/register':
                if (!adminDb) {
                    await bot.sendMessage(chatId, "Sorry, the registration service is temporarily unavailable. Please try again later.");
                    break;
                }
                try {
                    const userDoc = await adminDb.collection('users').doc(String(userId)).get();
                    if (userDoc.exists) {
                        await bot.sendMessage(chatId, 'You are already registered! Use /myinfo to see your details.');
                    } else {
                        userState[userId] = { step: 'name', data: {} };
                        await bot.sendMessage(chatId, "Let's get you registered. What is your full name?");
                    }
                } catch (error) {
                    console.error("Error checking user registration:", error);
                    await bot.sendMessage(chatId, "Sorry, something went wrong. Please try again later.");
                }
                break;

            default:
                await bot.sendMessage(chatId, "I don't recognize that command. Please use /help to see a list of available commands.");
                break;
        }
    } 
    else {
        await bot.sendMessage(chatId, "I'm not sure how to respond to that. Please use /help to see a list of available commands.");
    }

    return NextResponse.json({ status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

export async function GET() {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const baseUrl = process.env.WEBHOOK_BASE_URL;

    if (!token || !baseUrl) {
      throw new Error("TELEGRAM_BOT_TOKEN or WEBHOOK_BASE_URL not set.");
    }

    const webhookUrl = `${baseUrl}/api/webhook`;
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);
    const result = await response.json();

    if (!result.ok) {
        throw new Error(`Failed to set webhook: ${result.description}`);
    }

    return NextResponse.json({ status: 200, message: `Webhook set to ${webhookUrl}` });
  } catch (error) {
    console.error('Error setting webhook:', error);
    const message = error instanceof Error ? error.message : 'Error setting webhook';
    return NextResponse.json({ status: 500, message });
  }
}