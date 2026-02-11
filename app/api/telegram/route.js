import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(request) {
  try {
    const { message, userEmail, parentName, parentPhone, children } = await request.json();

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram environment variables');
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    // --- Validation ---
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 10) {
      return NextResponse.json(
        { error: 'الرسالة قصيرة جداً' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { error: 'الرسالة طويلة جداً (الحد الأقصى 5000 حرف)' },
        { status: 400 }
      );
    }

    if (!userEmail || typeof userEmail !== 'string') {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // --- Format message ---
    let childrenText = '';
    if (children && Array.isArray(children) && children.length > 0) {
      childrenText = children.map((child, index) => 
        `   ${index + 1}. ${child.name || 'غير محدد'} (${child.age || '?'} سنة)`
      ).join('\n');
    } else {
      childrenText = '   لا توجد بيانات';
    }

    const text = `
📩 <b>رسالة جديدة من الموقع</b>

👤 <b>ولي الأمر:</b> ${parentName || 'غير متوفر'}
📧 <b>البريد:</b> ${userEmail}
📱 <b>رقم الهاتف:</b> ${parentPhone || 'غير متوفر'}

👶 <b>الأبناء المسجلين:</b>
${childrenText}

💬 <b>الرسالة:</b>
${trimmedMessage}

⏰ <b>التوقيت:</b> ${new Date().toLocaleString('ar-SA')}
    `;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}