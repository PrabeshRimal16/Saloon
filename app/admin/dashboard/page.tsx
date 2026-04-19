import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase.server';
import { redirect } from 'next/navigation';
import AdminBookingTable from '@/components/AdminBookingTable';
import type { Booking } from '@/types';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

/**
 * Admin dashboard — Server Component that:
 * 1. Verifies admin role (safety net on top of middleware)
 * 2. Fetches all bookings with customer details
 * 3. Passes data to the interactive AdminBookingTable client component
 */
export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  // Fetch all bookings with joined user info
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, users(full_name, email, phone)')
    .order('date', { ascending: false });

  // Booking counts by status
  const counts = {
    total:     (bookings ?? []).length,
    pending:   (bookings ?? []).filter(b => b.status === 'pending').length,
    confirmed: (bookings ?? []).filter(b => b.status === 'confirmed').length,
    completed: (bookings ?? []).filter(b => b.status === 'completed').length,
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1 className="heading-display" style={{ fontSize: '2.5rem', color: '#334155' }}>
            Admin Dashboard
          </h1>
          <span style={{
            background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 700,
            padding: '0.2rem 0.65rem', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Admin
          </span>
        </div>
        <p style={{ color: '#64748b', marginTop: 4 }}>
          Logged in as <strong style={{ color: '#b25a5a' }}>{profile.full_name ?? user.email}</strong>
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {[
          { label: 'Total',     value: counts.total,     color: '#6366f1', icon: '📋' },
          { label: 'Pending',   value: counts.pending,   color: '#f59e0b', icon: '⏳' },
          { label: 'Confirmed', value: counts.confirmed, color: '#10b981', icon: '✅' },
          { label: 'Completed', value: counts.completed, color: '#3b82f6', icon: '🏆' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ borderRadius: 16, padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bookings table */}
      <div className="glass-card" style={{ borderRadius: 20, padding: '1.5rem', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#334155', marginBottom: '1.25rem' }}>
          All Bookings
        </h2>
        <AdminBookingTable initialBookings={(bookings ?? []) as Booking[]} />
      </div>
    </div>
  );
}
