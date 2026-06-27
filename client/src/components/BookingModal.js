import React, { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '';

const todayISO = () => new Date().toISOString().split('T')[0];

// ─── Styles ──────────────────────────────────────────────────────────────────
const MODAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* Overlay */
  .bm-overlay {
    position: fixed; inset: 0;
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9000; padding: 24px;
    animation: bm-fade-in 0.2s ease;
  }
  @keyframes bm-fade-in { from { opacity:0 } to { opacity:1 } }

  /* Box */
  .bm-box {
    background: #FDFCFA; border-radius: 24px;
    width: 100%; max-width: 540px;
    max-height: calc(100vh - 48px); overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.25);
    animation: bm-slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes bm-slide-up { from { opacity:0; transform:translateY(28px) scale(0.97) } to { opacity:1; transform:none } }

  /* Header */
  .bm-header {
    padding: 28px 32px 22px; border-bottom: 1px solid #F0EBE0;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    position: sticky; top: 0; background: #FDFCFA; z-index: 1;
    border-radius: 24px 24px 0 0;
  }
  .bm-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 600; color: #1C1C1E; margin: 0 0 3px; line-height: 1.1; }
  .bm-subtitle { font-size: 13px; color: #999; margin: 0; }
  .bm-close {
    width: 34px; height: 34px; border-radius: 50%; border: none;
    background: #F0EBE0; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #6B6B6B; flex-shrink: 0; transition: background 0.2s, color 0.2s;
  }
  .bm-close:hover { background: #E8DDD0; color: #1C1C1E; }

  /* Body */
  .bm-body { padding: 24px 32px 32px; display: flex; flex-direction: column; gap: 18px; }

  /* Field */
  .bm-field { display: flex; flex-direction: column; gap: 6px; }
  .bm-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #888; }
  .bm-input {
    padding: 12px 14px; border-radius: 12px; border: 1.5px solid #E8E0D5;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1C1C1E;
    background: white; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .bm-input:focus { border-color: #B8960C; box-shadow: 0 0 0 3px rgba(184,150,12,0.12); }
  .bm-input.bm-err { border-color: #C0392B; }
  .bm-field-error { font-size: 12px; color: #C0392B; }
  .bm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 480px) { .bm-row { grid-template-columns: 1fr; } }

  /* ── Multi-select dropdown ── */
  .bm-svc-trigger {
    padding: 12px 14px; border-radius: 12px; border: 1.5px solid #E8E0D5;
    background: white; cursor: pointer; display: flex; align-items: center;
    justify-content: space-between; gap: 8px; user-select: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1C1C1E;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bm-svc-trigger:hover, .bm-svc-trigger.open { border-color: #B8960C; box-shadow: 0 0 0 3px rgba(184,150,12,0.12); }
  .bm-svc-trigger.bm-err { border-color: #C0392B; }
  .bm-svc-trigger-text { flex: 1; color: #1C1C1E; }
  .bm-svc-trigger-text.placeholder { color: #AAAAAA; }
  .bm-chevron { font-size: 18px; color: #999; transition: transform 0.2s; flex-shrink: 0; }
  .bm-chevron.open { transform: rotate(180deg); }

  .bm-dropdown {
    background: white; border: 1.5px solid #E8E0D5; border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12); overflow: hidden;
    animation: bm-fade-in 0.15s ease;
    max-height: 240px; overflow-y: auto;
  }
  .bm-svc-opt {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; cursor: pointer;
    border-bottom: 1px solid #F5F0EB; transition: background 0.15s;
  }
  .bm-svc-opt:last-child { border-bottom: none; }
  .bm-svc-opt:hover { background: #FBF9F5; }
  .bm-svc-opt.checked { background: rgba(184,150,12,0.06); }
  .bm-checkbox {
    width: 18px; height: 18px; border-radius: 5px; border: 2px solid #D5C9B0;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.15s, border-color 0.15s;
  }
  .bm-checkbox.checked { background: #B8960C; border-color: #B8960C; }
  .bm-checkbox .check-mark { font-size: 12px; color: white; font-weight: 700; line-height: 1; }
  .bm-opt-info { flex: 1; min-width: 0; }
  .bm-opt-name { font-size: 14px; font-weight: 500; color: #1C1C1E; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bm-opt-meta { font-size: 12px; color: #AAAAAA; }

  /* Chips */
  .bm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .bm-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px 5px 12px; border-radius: 50px;
    background: rgba(184,150,12,0.1); border: 1px solid rgba(184,150,12,0.25);
    font-size: 13px; font-weight: 500; color: #6B4C00;
    animation: bm-fade-in 0.15s ease;
  }
  .bm-chip-remove {
    width: 18px; height: 18px; border-radius: 50%; border: none;
    background: rgba(184,150,12,0.2); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: #6B4C00;
    font-size: 14px; line-height: 1; padding: 0; transition: background 0.15s;
    font-family: inherit;
  }
  .bm-chip-remove:hover { background: rgba(184,150,12,0.4); }

  /* Price breakdown */
  .bm-price-box {
    background: white; border: 1.5px solid #F0EBE0; border-radius: 14px; overflow: hidden;
    animation: bm-fade-in 0.2s ease;
  }
  .bm-price-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #F5F0EB;
  }
  .bm-price-row:last-child { border-bottom: none; }
  .bm-price-svc-name { color: #444; }
  .bm-price-svc-amount { color: #888; }
  .bm-price-total { background: #F8F5EE; border-top: 2px solid #E8DDD0; }
  .bm-price-total-label { font-weight: 700; font-size: 14px; color: #1C1C1E; }
  .bm-price-total-amount { font-weight: 700; font-size: 16px; color: #B8960C; }

  /* Error alert */
  .bm-server-error {
    background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.2);
    border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #A63020;
  }

  /* Submit */
  .bm-submit {
    width: 100%; padding: 15px; border-radius: 50px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; color: white;
    background: linear-gradient(90deg, #B8960C 0%, #D4AF37 50%, #B8960C 100%);
    background-size: 200% auto; animation: bm-shimmer 3s linear infinite;
    box-shadow: 0 4px 20px rgba(184,150,12,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .bm-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,150,12,0.45); }
  .bm-submit:disabled { opacity: 0.6; cursor: not-allowed; animation: none; background-position: 0; }
  @keyframes bm-shimmer { to { background-position: 200% center; } }

  /* Spinner */
  .bm-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; display: inline-block; animation: bm-spin 0.7s linear infinite; }
  @keyframes bm-spin { to { transform: rotate(360deg); } }

  /* Divider */
  .bm-divider { display: flex; align-items: center; gap: 12px; }
  .bm-divider::before, .bm-divider::after { content: ''; flex: 1; height: 1px; background: #F0EBE0; }
  .bm-divider-text { font-size: 11px; color: #BBBBBB; text-transform: uppercase; letter-spacing: 1.5px; white-space: nowrap; }
`;

// ─── Multi-Select Dropdown ────────────────────────────────────────────────────
function ServiceMultiSelect({ services, selectedIds, onChange, error }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = useCallback((id) => {
    onChange(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, [onChange]);

  const selectedServices = services.filter(s => selectedIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);

  const triggerLabel = selectedIds.length === 0
    ? null
    : selectedIds.length === 1
      ? selectedServices[0]?.name
      : `${selectedIds.length} services selected`;

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Trigger */}
      <div
        id="bm-svc-trigger"
        className={`bm-svc-trigger${open ? ' open' : ''}${error ? ' bm-err' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)}
      >
        <span className={`bm-svc-trigger-text${!triggerLabel ? ' placeholder' : ''}`}>
          {triggerLabel || '— Select services —'}
        </span>
        <span className="material-symbols-outlined bm-chevron" style={open ? { transform: 'rotate(180deg)' } : {}}>
          expand_more
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="bm-dropdown" role="listbox" aria-multiselectable="true">
          {services.map(s => {
            const checked = selectedIds.includes(s.id);
            return (
              <div
                key={s.id}
                className={`bm-svc-opt${checked ? ' checked' : ''}`}
                onClick={() => toggle(s.id)}
                role="option"
                aria-selected={checked}
              >
                <div className={`bm-checkbox${checked ? ' checked' : ''}`}>
                  {checked && <span className="check-mark">✓</span>}
                </div>
                <div className="bm-opt-info">
                  <div className="bm-opt-name">{s.name}</div>
                  <div className="bm-opt-meta">
                    {s.duration ? `${s.duration} min` : ''}
                    {s.duration && s.price ? ' · ' : ''}
                    {s.price ? `$${Number(s.price).toFixed(2)}` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chips */}
      {selectedServices.length > 0 && (
        <div className="bm-chips">
          {selectedServices.map(s => (
            <span key={s.id} className="bm-chip">
              {s.name}
              <button
                type="button"
                className="bm-chip-remove"
                onClick={() => toggle(s.id)}
                aria-label={`Remove ${s.name}`}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Price breakdown */}
      {selectedServices.length > 0 && (
        <div className="bm-price-box">
          {selectedServices.map(s => (
            <div key={s.id} className="bm-price-row">
              <span className="bm-price-svc-name">{s.name}</span>
              <span className="bm-price-svc-amount">${Number(s.price || 0).toFixed(2)}</span>
            </div>
          ))}
          <div className="bm-price-row bm-price-total">
            <span className="bm-price-total-label">Total</span>
            <span className="bm-price-total-amount">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BookingModal ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   isOpen          boolean
 *   onClose         () => void
 *   services        Service[]          — all available services
 *   preSelectedIds  number[]           — IDs to pre-check when opening (e.g. from "Book Now")
 *   onSuccess       (booking) => void  — called after successful POST
 */
export default function BookingModal({ isOpen, onClose, services = [], preSelectedIds = [], onSuccess }) {
  const [selectedIds, setSelectedIds]       = useState([]);
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [phone, setPhone]                   = useState('');
  const [date, setDate]                     = useState('');
  const [time, setTime]                     = useState('');
  const [errors, setErrors]                 = useState({});
  const [submitting, setSubmitting]         = useState(false);
  const [serverError, setServerError]       = useState('');

  // Sync pre-selected IDs whenever the modal opens or preSelectedIds changes
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(preSelectedIds.length ? [...preSelectedIds] : []);
      setErrors({});
      setServerError('');
    }
  }, [isOpen, preSelectedIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const validate = () => {
    const errs = {};
    if (!name.trim())                              errs.name    = 'Name is required';
    if (!email.trim())                             errs.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))          errs.email   = 'Enter a valid email';
    if (!selectedIds.length)                       errs.service = 'Please select at least one service';
    if (!date)                                     errs.date    = 'Please choose a date';
    if (!time)                                     errs.time    = 'Please choose a time';
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
          name:             name.trim(),
          email:            email.trim(),
          phone:            phone.trim() || undefined,
          service_ids:      selectedIds,
          appointment_date: date,
          appointment_time: time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      // Enrich with guest info for SuccessCard
      const selectedServices = services.filter(s => selectedIds.includes(s.id));
      const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
      onSuccess({
        ...data,
        guest_name:   name.trim(),
        guest_email:  email.trim(),
        service_name: selectedServices.map(s => s.name).join(', '),
        services:     data.services || selectedServices,
        total_price:  data.total_price || totalPrice,
      });

      // Reset form
      setName(''); setEmail(''); setPhone('');
      setDate(''); setTime(''); setSelectedIds([]);
      setErrors({}); setServerError('');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{MODAL_CSS}</style>
      <div className="bm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bm-box" role="dialog" aria-modal="true" aria-labelledby="bm-dialog-title">

          {/* Header */}
          <div className="bm-header">
            <div>
              <h2 className="bm-title" id="bm-dialog-title">Book Appointment</h2>
              <p className="bm-subtitle">No account needed — book instantly as a guest</p>
            </div>
            <button className="bm-close" onClick={onClose} aria-label="Close booking modal">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          {/* Body */}
          <form className="bm-body" onSubmit={handleSubmit} noValidate>

            {/* Guest info */}
            <div className="bm-row">
              <div className="bm-field">
                <label className="bm-label" htmlFor="bm-name">Full Name *</label>
                <input
                  id="bm-name" className={`bm-input${errors.name ? ' bm-err' : ''}`}
                  type="text" placeholder="Jane Smith" value={name}
                  onChange={e => setName(e.target.value)} autoComplete="name"
                />
                {errors.name && <span className="bm-field-error">{errors.name}</span>}
              </div>
              <div className="bm-field">
                <label className="bm-label" htmlFor="bm-email">Email *</label>
                <input
                  id="bm-email" className={`bm-input${errors.email ? ' bm-err' : ''}`}
                  type="email" placeholder="jane@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} autoComplete="email"
                />
                {errors.email && <span className="bm-field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="bm-field">
              <label className="bm-label" htmlFor="bm-phone">Phone (optional)</label>
              <input
                id="bm-phone" className="bm-input" type="tel"
                placeholder="+1 (555) 000-0000" value={phone}
                onChange={e => setPhone(e.target.value)} autoComplete="tel"
              />
            </div>

            <div className="bm-divider"><span className="bm-divider-text">Services</span></div>

            {/* Multi-select */}
            <div className="bm-field">
              <label className="bm-label">Select Services *</label>
              <ServiceMultiSelect
                services={services}
                selectedIds={selectedIds}
                onChange={setSelectedIds}
                error={!!errors.service}
              />
              {errors.service && <span className="bm-field-error">{errors.service}</span>}
            </div>

            <div className="bm-divider"><span className="bm-divider-text">Date & Time</span></div>

            {/* Date & Time */}
            <div className="bm-row">
              <div className="bm-field">
                <label className="bm-label" htmlFor="bm-date">Date *</label>
                <input
                  id="bm-date" className={`bm-input${errors.date ? ' bm-err' : ''}`}
                  type="date" value={date} min={todayISO()}
                  onChange={e => setDate(e.target.value)}
                />
                {errors.date && <span className="bm-field-error">{errors.date}</span>}
              </div>
              <div className="bm-field">
                <label className="bm-label" htmlFor="bm-time">Time *</label>
                <input
                  id="bm-time" className={`bm-input${errors.time ? ' bm-err' : ''}`}
                  type="time" value={time}
                  onChange={e => setTime(e.target.value)}
                />
                {errors.time && <span className="bm-field-error">{errors.time}</span>}
              </div>
            </div>

            {serverError && <div className="bm-server-error">{serverError}</div>}

            <button type="submit" className="bm-submit" disabled={submitting}>
              {submitting
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span className="bm-spinner" /> Booking…
                  </span>
                : '✦ Confirm Booking'
              }
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
