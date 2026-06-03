import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';

const CSS = `
  .svc-page { background: #FFFFFF; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* Header Banner */
  .svc-header { background: #FFFFFF; padding: 80px 40px 64px; text-align: center; border-bottom: 1px solid #E8E0D5; }
  .svc-header-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 16px; }
  .svc-header-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 56px; font-weight: 400; color: #1C1C1E; margin: 0 auto 24px; letter-spacing: -0.5px; }
  .svc-header-line { width: 80px; height: 1px; background: #B8960C; margin: 0 auto 20px; }
  .svc-header-sub { font-size: 16px; color: #6B6B6B; font-style: italic; max-width: 600px; margin: 0 auto; line-height: 1.7; }

  /* Search + Filters */
  .svc-controls { max-width: 1200px; margin: 0 auto; padding: 48px 40px 32px; }
  @media (max-width: 768px) { .svc-controls { padding: 32px 24px 24px; } }

  .svc-search-wrap { position: relative; margin-bottom: 28px; }
  .svc-search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); font-size: 20px; color: #AAAAAA; pointer-events: none; }
  .svc-search { width: 100%; height: 50px; border: 1.5px solid #E8E0D5; border-radius: 50px; padding: 0 24px 0 52px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #1C1C1E; background: white; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .svc-search::placeholder { color: #AAAAAA; }
  .svc-search:focus { border-color: #B8960C; box-shadow: 0 0 0 3px rgba(184,150,12,0.1); }

  .svc-filters { display: flex; flex-wrap: wrap; gap: 10px; }
  .svc-filter-btn { height: 40px; padding: 0 24px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .svc-filter-btn.inactive { background: transparent; border: 1.5px solid #B8960C; color: #B8960C; }
  .svc-filter-btn.inactive:hover { background: rgba(184,150,12,0.06); }
  .svc-filter-btn.active { background: #B8960C; border: 1.5px solid #B8960C; color: white; box-shadow: 0 4px 16px rgba(184,150,12,0.3); }

  /* Grid */
  .svc-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; }
  @media (max-width: 768px) { .svc-grid-wrap { padding: 0 24px 60px; } }
  .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  @media (max-width: 900px) { .svc-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) { .svc-grid { grid-template-columns: 1fr; } }

  .svc-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: box-shadow 0.3s, transform 0.3s; display: flex; flex-direction: column; }
  .svc-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.14); transform: translateY(-8px); }
  .svc-img-area { aspect-ratio: 4/5; min-height: 400px; height: auto; position: relative; overflow: hidden; background: linear-gradient(135deg, #1C1C1E 0%, #2C2416 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .svc-img-area img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease; display: block; }
  .svc-card:hover .svc-img-area img { transform: scale(1.03); }
  .svc-img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 2; }
  .svc-img-placeholder .mat-icon { font-size: 48px; color: #B8960C; text-shadow: 0 0 16px rgba(184,150,12,0.5); }
  .svc-placeholder-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: white; opacity: 0.05; text-transform: uppercase; text-align: center; line-height: 1.1; pointer-events: none; z-index: 1; padding: 20px; }
  .svc-cat-pill { position: absolute; top: 14px; left: 14px; background: #B8960C; color: white; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; z-index: 3; }
  .svc-body { padding: 24px; flex-grow: 1; display: flex; flex-direction: column; }
  .svc-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 600; color: #1C1C1E; margin: 0 0 8px; }
  .svc-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6B6B6B; line-height: 1.65; margin: 0 0 16px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .svc-dur { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #AAAAAA; margin: 0 0 16px; display: flex; align-items: center; gap: 4px; }
  .svc-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .svc-price { font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 700; color: #1C1C1E; }
  .btn-book { padding: 12px 24px; border-radius: 8px; background: linear-gradient(90deg, #B8960C 0%, #D4AF37 100%); color: white; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; transition: opacity 0.2s, transform 0.15s; margin-left: auto; }
  .btn-book:hover { opacity: 0.9; transform: scale(1.02); }

  /* Empty */
  .svc-empty { text-align: center; padding: 80px 24px; color: #AAAAAA; }

  /* Signature banner */
  .sig-banner { background: #1C1C1E; padding: 80px 40px; }
  .sig-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  @media (max-width: 800px) { .sig-inner { grid-template-columns: 1fr; gap: 48px; } }

  /* Booking Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
  .modal-box { background: white; border-radius: 20px; max-width: 480px; width: 100%; box-shadow: 0 24px 80px rgba(0,0,0,0.2); overflow: hidden; }
  .modal-header { padding: 28px 32px 24px; border-bottom: 1px solid #E8E0D5; display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 600; color: #1C1C1E; margin: 0; }
  .modal-sub { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6B6B6B; margin: 4px 0 0; }
  .modal-close { width: 32px; height: 32px; border-radius: 50%; border: none; background: #F8F7F5; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6B6B6B; transition: background 0.2s; }
  .modal-close:hover { background: #E8E0D5; }
  .modal-body { padding: 28px 32px 32px; }
  .modal-label { display: block; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #AAAAAA; margin-bottom: 8px; }
  .modal-input { width: 100%; background: #F8F7F5; border: 1.5px solid #E8E0D5; border-radius: 10px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1C1C1E; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
  .modal-input:focus { border-color: #B8960C; box-shadow: 0 0 0 3px rgba(184,150,12,0.1); background: white; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .modal-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 24px; border-top: 1px solid #E8E0D5; margin-top: 24px; }
  .btn-cancel-modal { padding: 12px 24px; border-radius: 50px; background: none; border: 1.5px solid #E8E0D5; color: #6B6B6B; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: border-color 0.2s; }
  .btn-cancel-modal:hover { border-color: #1C1C1E; color: #1C1C1E; }
  .btn-confirm { padding: 12px 32px; border-radius: 50px; background: #B8960C; border: none; color: white; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: background 0.2s; }
  .btn-confirm:hover { background: #8B7209; }
  .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CATEGORIES = ['All', 'Hair Sculpting', 'Facial Therapy', 'Nail Artistry', 'Grooming'];

export default function CustomerServices() {
  const [services, setServices] = useState([]);
  const { user } = useAuth();
  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/services`).then(r => r.json()).then(setServices).catch(() => {});
  }, []);

  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'All' || (s.category || '').toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
    const matchSearch = !searchQuery || (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user?.id) return alert('You must be signed in to book.');
    if (!bookingDate || !bookingTime) return alert('Please choose a date and time.');
    setBookingLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, service_id: bookingService.id, appointment_date: bookingDate, appointment_time: bookingTime, phone: bookingPhone })
      });
      if (!res.ok) { alert('Booking failed: ' + await res.text()); }
      else { alert('Booking confirmed!'); setBookingService(null); }
    } catch { alert('Booking failed'); }
    finally { setBookingLoading(false); }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="svc-page">
        <CustomerNavbar />

        <main style={{ paddingTop: 72 }}>
          {/* Header */}
          <div className="svc-header">
            <p className="svc-header-eyebrow">Curated Excellence</p>
            <h1 className="svc-header-h1">Our Services</h1>
            <span className="svc-header-line" />
            <p className="svc-header-sub">Experience the pinnacle of personal grooming — each service is a bespoke journey blending traditional artistry with modern precision.</p>
          </div>

          {/* Search + Filters */}
          <div className="svc-controls">
            <div className="svc-search-wrap">
              <span className="material-symbols-outlined svc-search-icon">search</span>
              <input className="svc-search" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="svc-filters">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`svc-filter-btn ${activeCategory === cat ? 'active' : 'inactive'}`} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="svc-grid-wrap">
            {filtered.length === 0 ? (
              <div className="svc-empty">
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#B8960C', opacity: 0.4, display: 'block', marginBottom: 16 }}>spa</span>
                <p style={{ fontSize: 16, fontFamily: 'Cormorant Garamond,serif' }}>No services found</p>
                <p style={{ fontSize: 13 }}>Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="svc-grid">
                {filtered.map((s, idx) => {
                  const API_BASE = process.env.REACT_APP_API_URL || '';
                  const imgSrc = s.image_url && s.image_url.startsWith('/') ? `${API_BASE}${s.image_url}` : (s.image_url || '');
                  return (
                    <div key={s.id || idx} className="svc-card">
                      <div className="svc-img-area">
                        {imgSrc
                          ? <img src={imgSrc} alt={s.name} />
                          : (
                            <>
                              <span className="svc-placeholder-text">{s.name}</span>
                              <div className="svc-img-placeholder"><span className="material-symbols-outlined mat-icon">content_cut</span></div>
                            </>
                          )
                        }
                        {s.category && <span className="svc-cat-pill">{s.category}</span>}
                      </div>
                      <div className="svc-body">
                        <h3 className="svc-name">{s.name}</h3>
                        <p className="svc-desc">{s.description}</p>
                        {s.duration && <p className="svc-dur"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>{s.duration} min</p>}
                        <div className="svc-footer">
                          <span className="svc-price">NPR {Number(s.price || 0).toLocaleString()}</span>
                          <button className="btn-book" onClick={() => setBookingService(s)}>Book Now</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Signature Banner */}
          <div className="sig-banner">
            <div className="sig-inner">
              <div>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'#B8960C', marginBottom:14 }}>Unparalleled Luxury</p>
                <h2 style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:44, fontWeight:400, color:'white', margin:'0 0 20px', lineHeight:1.15 }}>The Signature Atelier Experience</h2>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(255,255,255,0.65)', marginBottom:32, lineHeight:1.75 }}>Every appointment includes a complimentary consultation, artisanal teas or champagne, and access to our private relaxation lounge.</p>
                {['Complimentary Scalp Analysis','Personal Style Portfolio','Post-Treatment Maintenance Plan'].map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:18, color:'#B8960C' }}>check_circle</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ position:'relative' }}>
                <div style={{ borderRadius:12, overflow:'hidden', border:'4px solid rgba(184,150,12,0.25)', aspectRatio:'1' }}>
                  <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" alt="Salon" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <CustomerFooter />
      </div>

      {/* Booking Modal */}
      {bookingService && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setBookingService(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Book Appointment</h3>
                <p className="modal-sub">{bookingService.name}</p>
              </div>
              <button className="modal-close" onClick={() => setBookingService(null)}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitBooking}>
                <div className="modal-grid">
                  <div>
                    <label className="modal-label">Date *</label>
                    <input required type="date" className="modal-input" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="modal-label">Time *</label>
                    <input required type="time" className="modal-input" value={bookingTime} onChange={e => setBookingTime(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="modal-label">Phone (Optional)</label>
                  <input type="tel" className="modal-input" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel-modal" onClick={() => setBookingService(null)}>Cancel</button>
                  <button type="submit" className="btn-confirm" disabled={bookingLoading}>{bookingLoading ? 'Processing...' : 'Confirm Booking'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
