import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Choose your service, pick a date and time, and confirm your Luxe Salon appointment.',
};

/**
 * Booking page — requires auth (enforced by middleware).
 * Renders the BookingForm client component inside a styled layout.
 */
export default function BookingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '2.5rem 1.25rem 4rem',
      background: 'linear-gradient(160deg, #fff6f4 0%, #fdf9f7 40%, #f9f5ff 100%)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#c96e38', marginBottom: '0.5rem',
          }}>
            Luxe Salon
          </p>
          <h1 className="heading-display" style={{ fontSize: '3rem', color: '#334155' }}>
            Book an Appointment
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.75rem', maxWidth: 480, margin: '0.75rem auto 0' }}>
            Choose your service, select a convenient time, and we&apos;ll take care of the rest.
          </p>
        </div>

        {/* Form card */}
        <div
          className="glass-card"
          style={{ borderRadius: 24, padding: '2.5rem 2rem' }}
        >
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
