
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  // We can't initialize the bot without a token.
  // This will be a server-side error, but it's better than a runtime crash.
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// We only initialize the bot if the token is available.
export const bot = token ? new TelegramBot(token) : {} as TelegramBot;

if (token) {
    // Handler for the /start command
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Welcome! Use /register to create your profile or /help to see commands.");
    });

    // Handler for the /help command
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

    // A catch-all for any other message
    bot.on('message', (msg) => {
        // If the message is not a command (doesn't start with /), respond with a default message.
        if (msg.text && !msg.text.startsWith('/')) {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, `I'm not sure how to respond to that. Please use /help to see a list of available commands.`);
        }
    });
}
