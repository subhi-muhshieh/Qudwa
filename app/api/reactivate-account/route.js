import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/client';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Update the profile to mark as not deleted
    const { error } = await supabase
      .from('profiles')
      .update({ 
        deleted: false, 
        deleted_at: null 
      })
      .eq('id', userId);

    if (error) {
      console.error('Reactivation error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}