import React, { useState, useEffect, useCallback } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import ConfirmModal from '../../components/ConfirmModal';

const API_BASE = process.env.REACT_APP_API_URL || '';

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .appt-page { background: #FAFAF8; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* ── Page header ── */
  .appt-header { max-width: 1200px; margin: 0 auto; padding: 56px 40px 32px; }
  @media (max-width:700px) { .appt-header { padding: 40px 24px 24px; } }
  .appt-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 10px; }
  .appt-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 52px; font-weight: 300; color: #1C1C1E; margin: 0; letter-spacing: -0.5px; }
  @media (max-width:600px) { .appt-h1 { font-size: 36px; } }
  .appt-sub { font-size: 15px; color: #6B6B6B; margin: 8px 0 0; }

  /* ── Two-column layout ── */
  .appt-grid { max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  @media (max-width: 960px) { .appt-grid { grid-template-columns: 1fr; } }
  @media (max-width: 700px) { .appt-grid { padding: 0 24px 60px; } }

  /* ── Card shared ── */
  .card { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden; }
  .card-header { padding: 24px 28px 16px; border-bottom: 1px solid #F0EBE0; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: #1C1C1E; margin: 0 0 4px; }
  .card-subtitle { font-size: 13px; color: #AAAAAA; }
  .card-body { padding: 24px 28px; }

  /* ── Form ── */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
  .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .field label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #6B6B6B; }
  .field input, .field select, .field textarea {
    padding: 12px 14px; border-radius: 10px; border: 1.5px solid #E8E0D5;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1C1C1E;
    background: #FDFCFA; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: #B8960C; box-shadow: 0 0 0 3px rgba(184,150,12,0.12);
  }
  .field input.err, .field select.err { border-color: #C0392B; }
  .field-error { font-size: 12px; color: #C0392B; margin-top: 2px; }

  /* ── Submit button ── */
  .btn-submit {
    width: 100%; padding: 15px; border-radius: 50px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px; color: white;
    background: linear-gradient(90deg, #B8960C 0%, #D4AF37 50%, #B8960C 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    box-shadow: 0 4px 20px rgba(184,150,12,0.35);
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    margin-top: 8px;
  }
  .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,150,12,0.45); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; animation: none; background-position: 0; }

  /* ── Success card ── */
  .success-card { text-align: center; padding: 40px 28px; }
  .success-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(45,122,79,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .success-icon .mat-icon { font-size: 32px; color: #2D7A4F; }
  .success-h2 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #1C1C1E; margin: 0 0 8px; }
  .success-sub { font-size: 14px; color: #6B6B6B; margin: 0 0 24px; line-height: 1.6; }
  .success-details { background: #F8F7F5; border-radius: 12px; padding: 16px 20px; text-align: left; margin-bottom: 24px; }
  .success-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #EEE; font-size: 13px; }
  .success-row:last-child { border-bottom: none; }
  .success-row span:first-child { color: #AAAAAA; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; }
  .success-row span:last-child { color: #1C1C1E; font-weight: 500; }
  .btn-book-another { padding: 12px 32px; border-radius: 50px; border: 2px solid #B8960C; background: transparent; color: #B8960C; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: background 0.2s, color 0.2s; }
  .btn-book-another:hover { background: #B8960C; color: white; }

  /* ── Past bookings section ── */
  .lookup-section { margin-top: 16px; }
  .lookup-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: #1C1C1E; margin: 0 0 4px; }
  .lookup-sub { font-size: 13px; color: #AAAAAA; margin-bottom: 16px; }
  .lookup-row { display: flex; gap: 10px; }
  .lookup-input { flex: 1; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #E8E0D5; font-family: 'DM Sans', sans-serif; font-size: 14px; background: #FDFCFA; outline: none; transition: border-color 0.2s; }
  .lookup-input:focus { border-color: #B8960C; box-shadow: 0 0 0 3px rgba(184,150,12,0.12); }
  .btn-lookup { padding: 12px 20px; border-radius: 10px; border: none; background: #1C1C1E; color: white; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; transition: background 0.2s; white-space: nowrap; }
  .btn-lookup:hover { background: #B8960C; }
  .btn-lookup:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Appointment list cards ── */
  .appt-list { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
  .appt-item { background: #FDFCFA; border: 1px solid #F0EBE0; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; transition: box-shadow 0.2s; }
  .appt-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .appt-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(145deg,#2A2A2A,#1C1C1E); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .appt-icon .mat-icon { font-size: 22px; color: rgba(184,150,12,0.85); }
  .appt-info { flex: 1; min-width: 0; }
  .appt-svc { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 600; color: #1C1C1E; }
  .appt-meta { font-size: 12px; color: #AAAAAA; margin-top: 2px; }
  .appt-cancel-btn { padding: 7px 16px; border-radius: 50px; background: transparent; border: 1.5px solid #C0392B; color: #C0392B; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s, color 0.2s; white-space: nowrap; flex-shrink: 0; }
  .appt-cancel-btn:hover { background: #C0392B; color: white; }

  /* ── Status badges ── */
  .badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  .badge-approved  { background: rgba(45,122,79,0.12); color: #1E6B40; }
  .badge-pending   { background: rgba(184,150,12,0.12); color: #8B7209; }
  .badge-cancelled { background: rgba(192,57,43,0.1);  color: #A63020; }
  .badge-default   { background: #F0EBE0; color: #6B6B6B; }

  /* ── Empty state ── */
  .empty-state { text-align: center; padding: 48px 24px; color: #AAAAAA; }
  .empty-state .mat-icon { font-size: 48px; color: rgba(184,150,12,0.25); display: block; margin-bottom: 12px; }

  /* ── Animations ── */
  @keyframes shimmer { to { background-position: 200% center; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig = (s) => {
  switch (s?.toLowerCase()) {
    case 'approved':  return { cls: 'badge badge-approved',  label: 'Approved'  };
    case 'pending':   return { cls: 'badge badge-pending',   label: 'Pending'   };
    case 'cancelled': return { cls: 'badge badge-cancelled', label: 'Cancelled' };
    default:          return { cls: 'badge badge-default',   label: 'Unknown'   };
  }
};

const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const todayISO = () => new Date().toISOString().split('T')[0];

// ─── Booking Form ─────────────────────────────────────────────────────────────
const initialForm = {
  name: '', email: '', phone: '',
  service_id: '', appointment_date: '', appointment_time: '',
};

function BookingForm({ services, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim())             errs.name             = 'Name is required';
    if (!form.email.trim())            errs.email            = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email   = 'Enter a valid email';
    if (!form.service_id)              errs.service_id       = 'Please select a service';
    if (!form.appointment_date)        errs.appointment_date = 'Please choose a date';
    if (!form.appointment_time)        errs.appointment_time = 'Please choose a time';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name:             form.name.trim(),
          email:            form.email.trim(),
          phone:            form.phone.trim(),
          service_id:       form.service_id,
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      const svc = services.find(s => String(s.id) === String(form.service_id));
      onSuccess({ ...data, service_name: svc?.name || 'Service', guest_name: form.name, guest_email: form.email });
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card fade-up">
      <div className="card-header">
        <p className="card-title">Book an Appointment</p>
        <p className="card-subtitle">No account needed — just fill in your details</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>

          {/* Guest info */}
          <div className="form-row">
            <div className="field">
              <label htmlFor="book-name">Full Name *</label>
              <input
                id="book-name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={set('name')}
                className={errors.name ? 'err' : ''}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="book-email">Email *</label>
              <input
                id="book-email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={set('email')}
                className={errors.email ? 'err' : ''}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="book-phone">Phone Number</label>
            <input
              id="book-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={set('phone')}
              autoComplete="tel"
            />
          </div>

          {/* Service */}
          <div className="field">
            <label htmlFor="book-service">Service *</label>
            <select
              id="book-service"
              value={form.service_id}
              onChange={set('service_id')}
              className={errors.service_id ? 'err' : ''}
            >
              <option value="">— Select a service —</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.duration ? ` (${s.duration} min)` : ''}{s.price ? ` — $${Number(s.price).toFixed(2)}` : ''}
                </option>
              ))}
            </select>
            {errors.service_id && <span className="field-error">{errors.service_id}</span>}
          </div>

          {/* Date & time */}
          <div className="form-row">
            <div className="field">
              <label htmlFor="book-date">Date *</label>
              <input
                id="book-date"
                type="date"
                value={form.appointment_date}
                min={todayISO()}
                onChange={set('appointment_date')}
                className={errors.appointment_date ? 'err' : ''}
              />
              {errors.appointment_date && <span className="field-error">{errors.appointment_date}</span>}
            </div>
            <div className="field">
              <label htmlFor="book-time">Time *</label>
              <input
                id="book-time"
                type="time"
                value={form.appointment_time}
                onChange={set('appointment_time')}
                className={errors.appointment_time ? 'err' : ''}
              />
              {errors.appointment_time && <span className="field-error">{errors.appointment_time}</span>}
            </div>
          </div>

          {serverError && (
            <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#A63020' }}>
              {serverError}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting
              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Booking...
                </span>
              : '✦ Confirm Booking'
            }
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Success card ─────────────────────────────────────────────────────────────
function SuccessCard({ booking, onReset }) {
  return (
    <div className="card fade-up">
      <div className="success-card">
        <div className="success-icon">
          <span className="material-symbols-outlined mat-icon">check_circle</span>
        </div>
        <h2 className="success-h2">Booking Confirmed!</h2>
        <p className="success-sub">
          Your appointment has been received and is pending confirmation.<br />
          We'll reach out to <strong>{booking.guest_email}</strong> shortly.
        </p>
        <div className="success-details">
          <div className="success-row">
            <span>Booking ID</span>
            <span>#{booking.id}</span>
          </div>
          <div className="success-row">
            <span>Name</span>
            <span>{booking.guest_name}</span>
          </div>
          <div className="success-row">
            <span>Service</span>
            <span>{booking.service_name}</span>
          </div>
          <div className="success-row">
            <span>Date</span>
            <span>{fmtDate(booking.appointment_date)}</span>
          </div>
          <div className="success-row">
            <span>Time</span>
            <span>{booking.appointment_time || '—'}</span>
          </div>
          <div className="success-row">
            <span>Status</span>
            <span className="badge badge-pending">Pending</span>
          </div>
        </div>
        <button className="btn-book-another" onClick={onReset}>
          Book Another Appointment
        </button>
      </div>
    </div>
  );
}

// ─── Past bookings lookup (by email) ─────────────────────────────────────────
function BookingLookup() {
  const [email, setEmail]           = useState('');
  const [results, setResults]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [confirmProps, setConfirmProps] = useState({});
  const [cancellingId, setCancellingId] = useState(null);

  const lookup = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/appointments/by-email/${encodeURIComponent(email.trim())}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lookup failed');
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id) => {
    setCancellingId(id);
    setConfirmProps({
      title: 'Cancel your appointment?',
      message: 'This action cannot be undone.',
      confirmText: 'Cancel Appointment',
      confirmColor: '#C0392B',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: 'cancelled', cancelled_by: 'user' }),
          });
          if (!res.ok) throw new Error();
          const updated = await res.json();
          setResults(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a));
        } catch {
          alert('Failed to cancel appointment. Please try again.');
        } finally {
          setConfirmOpen(false);
          setCancellingId(null);
        }
      },
    });
    setConfirmOpen(true);
  };

  return (
    <div className="card fade-up">
      <div className="card-header">
        <p className="card-title">My Bookings</p>
        <p className="card-subtitle">Enter your email to view past appointments</p>
      </div>
      <div className="card-body">
        <form onSubmit={lookup}>
          <div className="lookup-row">
            <input
              id="lookup-email"
              type="email"
              className="lookup-input"
              placeholder="Your booking email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <button type="submit" className="btn-lookup" disabled={loading}>
              {loading
                ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                : 'Search'
              }
            </button>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(192,57,43,0.08)', borderRadius: 10, fontSize: 13, color: '#A63020' }}>
            {error}
          </div>
        )}

        {results !== null && (
          <div className="appt-list" style={{ marginTop: 20 }}>
            {results.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined mat-icon">calendar_month</span>
                <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18 }}>No bookings found</p>
                <p style={{ fontSize: 13 }}>No appointments found for <strong>{email}</strong></p>
              </div>
            ) : results.map(a => {
              const st = statusConfig(a.status);
              const isCancelled = a.status?.toLowerCase() === 'cancelled';
              return (
                <div key={a.id} className="appt-item" style={{ opacity: isCancelled ? 0.65 : 1 }}>
                  <div className="appt-icon">
                    <span className="material-symbols-outlined mat-icon">content_cut</span>
                  </div>
                  <div className="appt-info">
                    <div className="appt-svc">{a.service_name || 'Service'}</div>
                    <div className="appt-meta">
                      {fmtDate(a.appointment_date)}
                      {a.appointment_time ? ` · ${a.appointment_time}` : ''}
                      {a.service_duration ? ` · ${a.service_duration} min` : ''}
                    </div>
                    <span className={st.cls} style={{ marginTop: 6, display: 'inline-flex' }}>{st.label}</span>
                  </div>
                  {!isCancelled && (
                    <button
                      className="appt-cancel-btn"
                      onClick={() => handleCancel(a.id)}
                      disabled={cancellingId === a.id}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmProps.title}
        message={confirmProps.message}
        confirmText={confirmProps.confirmText}
        confirmColor={confirmProps.confirmColor}
        onConfirm={() => confirmProps.onConfirm && confirmProps.onConfirm()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const AppointmentsPage = () => {
  const [services, setServices]       = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [confirmed, setConfirmed]     = useState(null); // booking confirmation data

  // Fetch available services for the dropdown
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/services`, { credentials: 'include' });
        const data = await res.json();
        if (mounted) setServices(Array.isArray(data) ? data : []);
      } catch {
        // silently ignore — form still shows, dropdown just empty
      } finally {
        if (mounted) setServicesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSuccess = useCallback((booking) => {
    setConfirmed(booking);
    // Scroll to top of main area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => setConfirmed(null), []);

  return (
    <>
      <style>{CSS}</style>
      <div className="appt-page">
        <CustomerNavbar />

        <main style={{ paddingTop: 72 }}>

          {/* ── Page header ── */}
          <div className="appt-header">
            <p className="appt-eyebrow">Reserve Your Experience</p>
            <h1 className="appt-h1">Book an Appointment</h1>
            <p className="appt-sub">No account required — book instantly as a guest</p>
          </div>

          {/* ── Two-column grid ── */}
          <div className="appt-grid">

            {/* Left: booking form / confirmation */}
            {servicesLoading ? (
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <div style={{ width: 36, height: 36, border: '3px solid #B8960C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : confirmed ? (
              <SuccessCard booking={confirmed} onReset={handleReset} />
            ) : (
              <BookingForm services={services} onSuccess={handleSuccess} />
            )}

            {/* Right: email lookup for past bookings */}
            <BookingLookup />

          </div>
        </main>
      </div>
    </>
  );
};

export default AppointmentsPage;