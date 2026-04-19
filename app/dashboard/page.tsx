'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { Booking, BookingStatus, UserProfile } from '@/types';
import { Toast, Spinner } from '@/components/AuthGuard';

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`badge-${status}`}
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.75rem',
        borderRadius: 9999,
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  );
}

/**
 * Customer dashboard — shows the user's own bookings with cancel functionality.
 */
export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [toast, setToast]       = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data: prof } = await supabase.from('users').select('*').eq('id', user.id).single();
    setProfile(prof);

    const res = await fetch(`/api/bookings?userId=${user.id}`);
    const json = await res.json();
    setBookings(json.data ?? []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleCancel(id: string) {
    if (!confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (!res.ok) {
        const json = await res.json();
        setToast({ message: json.error ?? 'Cancel failed.', type: 'error' });
        return;
      }
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ message: 'Appointment cancelled.', type: 'success' });
    } catch {
      setToast({ message: 'Network error.', type: 'error' });
    } finally {
      setCancelling(null);
    }
  }

  // Stats
  const stats = {
    total:     bookings.length,
    upcoming:  bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-display" style={{ fontSize: '2.5rem', color: '#334155' }}>
          My Dashboard
        </h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>
          Welcome back, <strong style={{ color: '#b25a5a' }}>{profile?.full_name ?? profile?.email}</strong>
        </p>
      </div>

      {/* Stats cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {[
          { label: 'Total Bookings',  value: stats.total,     icon: '📋', color: '#6366f1' },
          { label: 'Upcoming',        value: stats.upcoming,  icon: '📅', color: '#f59e0b' },
          { label: 'Completed',       value: stats.completed, icon: '✅', color: '#10b981' },
        ].map(s => (
          <div
            key={s.label}
            className="glass-card animate-fade-in-up"
            style={{ borderRadius: 16, padding: '1.25rem 1.5rem' }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bookings list */}
      <div className="glass-card" style={{ borderRadius: 20, padding: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155' }}>Your Appointments</h2>
          <button onClick={() => router.push('/booking')} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            + Book New
          </button>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem', color: '#94a3b8',
            border: '2px dashed #e2e8f0', borderRadius: 16,
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗓️</p>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No appointments yet</p>
            <p style={{ fontSize: '0.88rem' }}>Book your first salon service!</p>
            <button onClick={() => router.push('/booking')} className="btn-primary" style={{ marginTop: '1.25rem' }}>
              Book Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {bookings.map(booking => (
              <div
                key={booking.id}
                style={{
                  border: '1.5px solid #f1f5f9',
                  borderRadius: 14,
                  padding: '1.1rem 1.25rem',
                  background: 'white',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Service + date */}
                <div style={{ flex: '1 1 200px' }}>
                  <p style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>{booking.service}</p>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: 2 }}>
                    {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })} at {booking.time}
                  </p>
                  {booking.notes && (
                    <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 4, fontStyle: 'italic' }}>
                      "{booking.notes}"
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <StatusBadge status={booking.status} />

                {/* Cancel button — only for pending/confirmed */}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancelling === booking.id}
                    className="btn-danger"
                  >
                    {cancelling === booking.id ? <Spinner size={14} /> : 'Cancel'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
