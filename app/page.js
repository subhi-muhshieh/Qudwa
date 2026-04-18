export const runtime = 'edge';

import { redirect } from 'next/navigation';
import { createClient } from './utils/supabase/server';
import LandingContent from './components/LandingContent';
import JsonLd from './components/JsonLd';

const SITE_URL = 'https://qudwa.pages.dev';

// Revalidate the landing page every 5 minutes so new activities/photos appear
// without forcing each visitor to re-fetch everything from scratch.
export const revalidate = 300;

export const metadata = {
  title: 'قدوة — جيلٌ يبني... أثرٌ يبقى',
  description:
    'جمعية قدوة: برامج تربوية وتعليمية ترفيهية هادفة للأطفال والشباب. تصفح أحدث النشاطات ومعرض الصور وانضم إلينا.',
};

export default async function LandingPage() {
  const supabase = await createClient();

  // Redirect authenticated visitors straight to their dashboard.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect('/dashboard');
  }

  // Fetch landing data in parallel on the server so the first paint has content.
  const [activitiesRes, upcomingRes, photosRes] = await Promise.allSettled([
    supabase
      .from('activities')
      .select('id,title,short_description,image_url,activity_date')
      .eq('is_upcoming', false)
      .order('activity_date', { ascending: false })
      .limit(3),
    supabase
      .from('activities')
      .select('id,title,short_description,image_url,activity_date,start_time')
      .eq('is_upcoming', true)
      .order('activity_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('activity_photos')
      .select('id,image_url,caption')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const recentActivities =
    activitiesRes.status === 'fulfilled' ? activitiesRes.value.data || [] : [];
  const upcomingActivity =
    upcomingRes.status === 'fulfilled' ? upcomingRes.value.data || null : null;
  const galleryPhotos =
    photosRes.status === 'fulfilled' ? photosRes.value.data || [] : [];

  const eventSchema = upcomingActivity
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: upcomingActivity.title,
        description: upcomingActivity.short_description,
        startDate: upcomingActivity.activity_date
          ? `${upcomingActivity.activity_date}${
              upcomingActivity.start_time ? `T${upcomingActivity.start_time}` : ''
            }`
          : undefined,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: upcomingActivity.image_url
          ? [upcomingActivity.image_url]
          : [`${SITE_URL}/logo.png`],
        organizer: {
          '@type': 'NGO',
          name: 'جمعية قدوة',
          url: SITE_URL,
        },
        url: `${SITE_URL}/activities`,
      }
    : null;

  return (
    <>
      {eventSchema && <JsonLd data={eventSchema} id="ld-upcoming-event" />}
      <LandingContent
        recentActivities={recentActivities}
        upcomingActivity={upcomingActivity}
        galleryPhotos={galleryPhotos}
      />
    </>
  );
}
