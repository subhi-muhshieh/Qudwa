import { createClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userIds, type, title, message, link, activityId } = await request.json();

  // Create notifications for multiple users
  const notifications = userIds.map(userId => ({
    user_id: userId,
    type,
    title,
    message,
    link,
    activity_id: activityId || null
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}