import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, userEmail } = await request.json();
    
    // DEBUG LOG 1: Check if keys exist
    console.log("--- TELEGRAM DEBUG START ---");
    console.log("Token exists?", !!process.env.TELEGRAM_BOT_TOKEN);
    console.log("Chat ID exists?", !!process.env.TELEGRAM_CHAT_ID);

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error("ERROR: Missing Environment Variables");
      return NextResponse.json({ error: 'Server config missing' }, { status: 500 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const text = `From: ${userEmail || 'Anonymous'}\nMessage: ${message}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // DEBUG LOG 2: Attempting fetch
    console.log("Sending to Telegram URL...");

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      })
    });

    const data = await response.json();
    
    // DEBUG LOG 3: Telegram Response
    console.log("Telegram API Response:", data);

    if (!data.ok) {
      console.error("Telegram Error Description:", data.description);
      throw new Error(data.description);
    }

    console.log("--- TELEGRAM DEBUG SUCCESS ---");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("--- TELEGRAM DEBUG ERROR ---");
    console.error(error); // This prints the exact crash reason
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}