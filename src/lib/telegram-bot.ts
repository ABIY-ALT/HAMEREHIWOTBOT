import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// We don't use polling because we are using a webhook
export const bot = new TelegramBot(token);

// Simple message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // Simple echo
  bot.sendMessage(chatId, `Hi! Your Firebase bot is active 🚀 Received: "${msg.text}"`);
});

// You can define more command handlers here based on your plan
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
    bot.sendMessage(msg.chat.id, helpText);
});
