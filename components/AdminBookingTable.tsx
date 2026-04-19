'use client';

import { useState } from 'react';
import type { Booking, BookingStatus } from '@/types';
import { Toast, Spinner } from './AuthGuard';

// Status badge styling helper
function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`badge-${status}`}
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.7rem',
        borderRadius: 9999,
        fontSize: '0.76rem',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  );
}

interface AdminBookingTableProps {
  initialBookings: Booking[];
}

/**
 * AdminBookingTable — displays all bookings with:
 * - Status update dropdown (pending → confirmed → completed)
 * - Delete with confirmation
 * - Customer details (name, email, phone)
 * - Sorted by date desc
 */
export default function AdminBookingTable({ initialBookings }: AdminBookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [updating, setUpdating] = useState<string | null>(null); // booking id being updated
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  // ── Update booking status ─────────────────────────────────────────────────
  async function handleStatusUpdate(id: string, newStatus: BookingStatus) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        setToast({ message: json.error ?? 'Update failed.', type: 'error' });
        return;
      }
      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
      );
      setToast({ message: `Booking marked as ${newStatus}.`, type: 'success' });
    } catch {
      setToast({ message: 'Network error.', type: 'error' });
    } finally {
      setUpdating(null);
    }
  }

  // ── Delete booking ────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Delete this booking permanently?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        setToast({ message: json.error ?? 'Delete failed.', type: 'error' });
        return;
      }
      setBookings(prev => prev.filter(b => b.id !== id));
      setToast({ message: 'Booking deleted.', type: 'success' });
    } catch {
      setToast({ message: 'Network error.', type: 'error' });
    } finally {
      setDeleting(null);
    }
  }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (b.users?.full_name ?? '').toLowerCase().includes(q) ||
        (b.users?.email ?? '').toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const STATUS_OPTIONS: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        alignItems: 'center',
      }}>
        <input
          type="search"
          placeholder="Search by name, email, or service…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field"
          style={{ maxWidth: 320 }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as BookingStatus | 'all')}
          className="input-field"
          style={{ maxWidth: 160 }}
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
          ))}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#94a3b8' }}>
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Desktop Table ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          color: '#94a3b8',
          background: 'white',
          borderRadius: 16,
          border: '1.5px dashed #e2e8f0',
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: 4 }}>No bookings found</p>
          <p style={{ fontSize: '0.85rem' }}>Try changing the filter or search term.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Customer', 'Service', 'Date & Time', 'Status', 'Notes', 'Actions'].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#475569',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking, i) => (
                <tr
                  key={booking.id}
                  style={{
                    background: i % 2 === 0 ? 'white' : '#fdfaf7',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background 0.1s',
                  }}
                >
                  {/* Customer */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <p style={{ fontWeight: 600, color: '#334155' }}>
                      {booking.users?.full_name ?? 'Unknown'}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{booking.users?.email}</p>
                    {booking.users?.phone && (
                      <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{booking.users.phone}</p>
                    )}
                  </td>

                  {/* Service */}
                  <td style={{ padding: '0.9rem 1rem', color: '#334155', fontWeight: 500 }}>
                    {booking.service}
                  </td>

                  {/* Date & Time */}
                  <td style={{ padding: '0.9rem 1rem', whiteSpace: 'nowrap' }}>
                    <p style={{ fontWeight: 500, color: '#334155' }}>
                      {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.82rem' }}>{booking.time}</p>
                  </td>

                  {/* Status with dropdown */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {updating === booking.id ? (
                        <Spinner size={16} />
                      ) : (
                        <select
                          value={booking.status}
                          onChange={e => handleStatusUpdate(booking.id, e.target.value as BookingStatus)}
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 6,
                            border: '1.5px solid #e2e8f0',
                            cursor: 'pointer',
                            background: 'white',
                          }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                      <StatusBadge status={booking.status} />
                    </div>
                  </td>

                  {/* Notes */}
                  <td style={{ padding: '0.9rem 1rem', color: '#64748b', maxWidth: 180 }}>
                    <p style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.82rem',
                    }}>
                      {booking.notes ?? '—'}
                    </p>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={deleting === booking.id}
                      className="btn-danger"
                    >
                      {deleting === booking.id ? <Spinner size={14} /> : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
