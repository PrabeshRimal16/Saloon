'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SalonService, CreateBookingPayload } from '@/types';
import { Toast, Spinner } from './AuthGuard';

// All available salon services with pricing
const SERVICES: { name: SalonService; price: string; duration: string }[] = [
  { name: 'Haircut & Styling',       price: '$45',  duration: '60 min' },
  { name: 'Hair Coloring',           price: '$85',  duration: '90 min' },
  { name: 'Highlights & Balayage',   price: '$120', duration: '150 min' },
  { name: 'Keratin Treatment',       price: '$160', duration: '180 min' },
  { name: 'Bridal Package',          price: '$250', duration: '240 min' },
  { name: 'Facial & Skincare',       price: '$70',  duration: '75 min' },
  { name: 'Manicure & Pedicure',     price: '$55',  duration: '60 min' },
  { name: 'Eyebrow Shaping',         price: '$25',  duration: '30 min' },
  { name: 'Waxing',                  price: '$40',  duration: '45 min' },
  { name: 'Makeup Application',      price: '$80',  duration: '60 min' },
];

// Available time slots
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

interface FormErrors {
  service?: string;
  date?: string;
  time?: string;
}

/**
 * BookingForm — multi-step form for creating a new appointment.
 * Validates inputs client-side then sends POST /api/bookings.
 */
export default function BookingForm() {
  const router = useRouter();

  const [service, setService] = useState<SalonService | ''>('');
  const [date, setDate]       = useState('');
  const [time, setTime]       = useState('');
  const [notes, setNotes]     = useState('');
  const [errors, setErrors]   = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Minimum date = tomorrow (can't book in the past)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!service)    newErrors.service = 'Please select a service.';
    if (!date)       newErrors.date    = 'Please choose a date.';
    if (!time)       newErrors.time    = 'Please choose a time slot.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: CreateBookingPayload = {
        service: service as SalonService,
        date,
        time,
        notes: notes.trim() || undefined,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setToast({ message: json.error ?? 'Failed to create booking.', type: 'error' });
        return;
      }

      setToast({ message: 'Booking confirmed! Redirecting…', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1800);
    } catch {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const selectedService = SERVICES.find(s => s.name === service);

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        {/* ── Service Selection ─────────────────────────────────────────── */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#b25a5a',
            marginBottom: '1rem',
          }}>
            1. Choose a Service
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}>
            {SERVICES.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => { setService(s.name); setErrors(e => ({ ...e, service: undefined })); }}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 12,
                  border: service === s.name ? '2px solid #f9a99a' : '1.5px solid #e2e8f0',
                  background: service === s.name ? '#fff5f4' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  boxShadow: service === s.name ? '0 0 0 3px rgba(249,169,154,0.18)' : 'none',
                }}
              >
                <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.88rem', marginBottom: 2 }}>{s.name}</p>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <span>{s.price}</span>
                  <span>·</span>
                  <span>{s.duration}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.service && <p style={{ color: '#e11d48', fontSize: '0.8rem', marginTop: 6 }}>{errors.service}</p>}
        </section>

        {/* ── Date & Time ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#b25a5a',
            marginBottom: '1rem',
          }}>
            2. Pick Date & Time
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                min={minDateStr}
                onChange={e => { setDate(e.target.value); setErrors(err => ({ ...err, date: undefined })); }}
                className="input-field"
              />
              {errors.date && <p style={{ color: '#e11d48', fontSize: '0.8rem', marginTop: 4 }}>{errors.date}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Time Slot
              </label>
              <select
                value={time}
                onChange={e => { setTime(e.target.value); setErrors(err => ({ ...err, time: undefined })); }}
                className="input-field"
              >
                <option value="">— Select time —</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.time && <p style={{ color: '#e11d48', fontSize: '0.8rem', marginTop: 4 }}>{errors.time}</p>}
            </div>
          </div>
        </section>

        {/* ── Notes ─────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#b25a5a',
            marginBottom: '1rem',
          }}>
            3. Additional Notes <span style={{ fontSize: '1rem', color: '#94a3b8' }}>(optional)</span>
          </h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special requests, allergies, or preferences…"
            rows={3}
            className="input-field"
            style={{ resize: 'vertical' }}
          />
        </section>

        {/* ── Summary & Submit ──────────────────────────────────────────── */}
        {selectedService && date && time && (
          <div style={{
            background: '#fff5f4',
            border: '1.5px solid #fecdd3',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 2 }}>Service</p>
              <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>{selectedService.name}</p>
            </div>
            <div style={{ color: '#e2e8f0' }}>|</div>
            <div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 2 }}>Date</p>
              <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ color: '#e2e8f0' }}>|</div>
            <div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 2 }}>Time</p>
              <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>{time}</p>
            </div>
            <div style={{ color: '#e2e8f0' }}>|</div>
            <div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 2 }}>Price</p>
              <p style={{ fontWeight: 700, color: '#b25a5a', fontSize: '0.9rem' }}>{selectedService.price}</p>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
          {loading ? <><Spinner size={18} /> Booking…</> : 'Confirm Appointment'}
        </button>
      </form>

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
