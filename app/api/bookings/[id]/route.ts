/**
 * /api/bookings/[id]
 *
 * PUT    → update a booking (status, date, time, service, notes)
 * DELETE → delete a booking
 *
 * Rules:
 *  - Customers can only cancel (status=cancelled) their own bookings
 *  - Admins can update any field and delete any booking
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase.server';
import type { UpdateBookingPayload } from '@/types';

// ── PUT /api/bookings/[id] ────────────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateBookingPayload = await request.json();

    // Fetch the booking to verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ data: null, error: 'Booking not found' }, { status: 404 });
    }

    // Determine if the caller is an admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = booking.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 });
    }

    // Customers may only cancel their own bookings (no other field changes)
    if (!isAdmin) {
      if (Object.keys(body).some(k => k !== 'status') || body.status !== 'cancelled') {
        return NextResponse.json(
          { data: null, error: 'Customers may only cancel their bookings.' },
          { status: 403 }
        );
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({ ...body, ...(body.status ? {} : {}) })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ data: null, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    console.error('[PUT /api/bookings/[id]]', err);
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE /api/bookings/[id] ─────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can hard-delete bookings; customers use cancel (PUT)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    // Allow owner to also delete their own booking (soft-delete alternative)
    const { data: booking } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = booking?.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ data: null, error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error('[DELETE /api/bookings/[id]]', err);
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
