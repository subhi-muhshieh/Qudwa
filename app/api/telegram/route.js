export const runtime = 'edge'; // <--- CRITICAL FOR CLOUDFLARE

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, userEmail } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
       return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }

    const text = `
📩 *New Qudwa Message*
------------------------
From: ${userEmail || 'Anonymous'}
Message: ${message}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Telegram Error:", data);
      throw new Error('Telegram API failed');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}