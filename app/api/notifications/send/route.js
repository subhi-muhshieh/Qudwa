import { createClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';


export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { userIds, type, title, message, link, activityId } = body;

  // --- Validation ---
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: 'userIds must be a non-empty array' }, { status: 400 });
  }
  if (userIds.length > 1000) {
    return NextResponse.json({ error: 'Too many recipients (max 1000)' }, { status: 400 });
  }
  if (!type || typeof type !== 'string') {
    return NextResponse.json({ error: 'type is required' }, { status: 400 });
  }
  if (!title || typeof title !== 'string' || title.length > 200) {
    return NextResponse.json({ error: 'title is required (max 200 chars)' }, { status: 400 });
  }
  if (!message || typeof message !== 'string' || message.length > 2000) {
    return NextResponse.json({ error: 'message is required (max 2000 chars)' }, { status: 400 });
  }

  const notifications = userIds.map(userId => ({
    user_id: userId,
    type,
    title: title.slice(0, 200),
    message: message.slice(0, 2000),
    link: link || null,
    activity_id: activityId || null
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: notifications.length });
}