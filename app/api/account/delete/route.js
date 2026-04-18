import { createClient } from '../../../utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  // 1. Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse and validate request
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { password, confirmText } = body;

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'كلمة المرور مطلوبة' }, { status: 400 });
  }

  if (confirmText !== 'حذف حسابي') {
    return NextResponse.json({ error: 'نص التأكيد غير صحيح' }, { status: 400 });
  }

  // 3. Re-authenticate with password to confirm identity
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password,
  });

  if (signInError) {
    return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
  }

  // 4. Create admin client with service role
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const userId = user.id;

  try {
    // 5. Delete all related data (order matters for foreign keys)

    // Delete children records
    await supabaseAdmin
      .from('children')
      .delete()
      .eq('parent_id', userId);

    // Delete notifications
    await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    // Delete activity registrations
    await supabaseAdmin
      .from('activity_registrations')
      .delete()
      .eq('user_id', userId);

    // Delete likes
    await supabaseAdmin
      .from('likes')
      .delete()
      .eq('user_id', userId);

    // Delete attendance records (where they're the parent)
    await supabaseAdmin
      .from('attendance')
      .delete()
      .eq('parent_id', userId);

    // Delete contact messages
    await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('user_id', userId);

    // 6. Delete avatar from storage if exists
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (profile?.avatar_url && profile.avatar_url.includes('avatars')) {
      const path = profile.avatar_url.split('/avatars/')[1];
      if (path) {
        await supabaseAdmin.storage.from('avatars').remove([path]);
      }
    }

    // 7. Delete profile
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    // 8. Delete the auth user completely
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Auth user deletion error:', deleteError);
      return NextResponse.json(
        { error: 'فشل حذف الحساب. يرجى التواصل مع الإدارة.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الحساب' },
      { status: 500 }
    );
  }
}