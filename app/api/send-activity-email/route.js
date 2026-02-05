import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import NewActivityEmail from '../../components/emails/NewActivityEmail';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { activity, recipients } = await request.json();

    // Send emails in batches (Resend allows up to 50 per request)
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }

    const results = [];
    
    for (const batch of batches) {
      const emailPromises = batch.map(recipient => 
        resend.emails.send({
          from: 'جمعية قدوة <onboarding@resend.dev>',
          to: recipient.email,
          subject: `نشاط جديد: ${activity.title}`,
          react: NewActivityEmail({
            parentName: recipient.parent_name || 'ولي الأمر الكريم',
            activityTitle: activity.title,
            activityDescription: activity.short_description,
            activityDate: activity.activity_date,
            activityImage: activity.image_url,
            isUpcoming: activity.is_upcoming,
          }),
        })
      );

      const batchResults = await Promise.allSettled(emailPromises);
      results.push(...batchResults);
    }

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({ 
      success: true, 
      sent: successful, 
      failed: failed 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}