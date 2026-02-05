import { render } from '@react-email/render';
import NewActivityEmail from '../../components/emails/NewActivityEmail';

export const runtime = 'edge';

export async function GET() {
  const emailHtml = render(
    NewActivityEmail({
      parentName: 'أحمد محمد',
      activityTitle: 'ورشة الرسم الإبداعي',
      activityDescription: 'ورشة تعليمية لتنمية مهارات الرسم والإبداع الفني لدى الأطفال من عمر 6 إلى 12 سنة. سنتعلم تقنيات مختلفة للرسم والتلوين.',
      activityDate: '2024-02-15',
      activityImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
      isUpcoming: true,
    })
  );

  return new Response(emailHtml, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}