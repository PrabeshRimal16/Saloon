/**
 * GET /api/admin/bookings
 *
 * Returns ALL bookings with joined customer profile data.
 * Requires admin role — enforced both here and in middleware.
 */
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase.server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ data: null, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all bookings with joined user details
    // Supabase foreign key join: bookings.user_id → users.id
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (
          full_name,
          email,
          phone
        )
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: bookings, error: null });
  } catch (err) {
    console.error('[GET /api/admin/bookings]', err);
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
