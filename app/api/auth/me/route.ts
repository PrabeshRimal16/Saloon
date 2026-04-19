/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile from public.users.
 * Used by client components to verify auth state server-side.
 */
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase.server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify the session — getUser() validates the JWT server-side
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's profile from the public users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role, full_name, phone, created_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ data: null, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ data: profile, error: null });
  } catch (err) {
    console.error('[GET /api/auth/me]', err);
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
