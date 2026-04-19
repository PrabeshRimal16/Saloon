/**
 * /api/bookings
 *
 * GET  ?userId=xxx  → fetch bookings for a specific user (must be that user or admin)
 * POST             → create a new booking for the authenticated user
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase.server';
import type { CreateBookingPayload } from '@/types';

// ── GET /api/bookings?userId=xxx ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ data: null, error: 'userId query param is required' }, { status: 400 });
    }

    // Users can only read their own bookings; admins can read any
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userId !== user.id && profile?.role !== 'admin') {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: bookings, error: null });
  } catch (err) {
    console.error('[GET /api/bookings]', err);
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}

// ── POST /api/bookings ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateBookingPayload = await request.json();
    const { service, date, time, notes } = body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!service || !date || !time) {
      return NextResponse.json(
        { data: null, error: 'service, date, and time are required' },
        { status: 400 }
      );
    }

    // Prevent bookings in the past
    const bookingDate = new Date(`${date}T${time}:00`);
    if (bookingDate <= new Date()) {
      return NextResponse.json(
        { data: null, error: 'Booking date must be in the future' },
        { status: 400 }
      );
    }

    // Check for duplicate booking at same slot
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { data: null, error: 'This time slot is already booked. Please choose another.' },
        { status: 409 }
      );
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service,
        date,
        time,
        notes: notes ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: booking, error: null }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
