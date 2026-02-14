import { NextResponse } from 'next/server';
export const runtime = 'edge';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const userTypeLabels = {
  'parent': 'ولي أمر',
  'member': 'عضو جمعية',
  'volunteer': 'متطوع',
  'donor': 'داعم/مانح',
  'follower': 'متابع'
};

export async function POST(request) {
  try {
    const { message, userEmail, userName, userPhone, userType, children,
            // Backward compatibility with old field names
            parentName, parentPhone } = await request.json();

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram environment variables');
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 10) {
      return NextResponse.json({ error: 'الرسالة قصيرة جداً' }, { status: 400 });
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json({ error: 'الرسالة طويلة جداً (الحد الأقصى 5000 حرف)' }, { status: 400 });
    }

    if (!userEmail || typeof userEmail !== 'string') {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    // Use new field names, fall back to old ones for backward compat
    const finalName = userName || parentName || 'غير متوفر';
    const finalPhone = userPhone || parentPhone || 'غير متوفر';
    const finalType = userType || 'parent';
    const typeLabel = userTypeLabels[finalType] || 'مستخدم';
    const isParent = finalType === 'parent';

    // Build children section only for parents
    let childrenSection = '';
    if (isParent) {
      if (children && Array.isArray(children) && children.length > 0) {
        const childrenText = children.map((child, index) => 
          `   ${index + 1}. ${escapeHtml(child.name || 'غير محدد')} (${escapeHtml(String(child.age || '?'))} سنة)`
        ).join('\n');
        childrenSection = `\n👶 <b>الأبناء المسجلين:</b>\n${childrenText}\n`;
      } else {
        childrenSection = `\n👶 <b>الأبناء المسجلين:</b>\n   لا توجد بيانات\n`;
      }
    }

    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 16)} UTC`;

    const text = `📩 <b>رسالة جديدة من الموقع</b>

👤 <b>الاسم:</b> ${escapeHtml(finalName)}
🏷 <b>نوع الحساب:</b> ${escapeHtml(typeLabel)}
📧 <b>البريد:</b> ${escapeHtml(userEmail)}
📱 <b>رقم الهاتف:</b> ${escapeHtml(finalPhone)}
${childrenSection}
💬 <b>الرسالة:</b>
${escapeHtml(trimmedMessage)}

⏰ <b>التوقيت:</b> ${timeStr}`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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