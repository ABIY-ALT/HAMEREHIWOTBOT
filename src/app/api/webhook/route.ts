import { NextRequest, NextResponse } from 'next/server';
import { bot } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    bot.processUpdate(body);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

// The webhook needs to be set up only once.
// A GET request to this endpoint will set the webhook.
// You should run this once after deploying your application.
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
