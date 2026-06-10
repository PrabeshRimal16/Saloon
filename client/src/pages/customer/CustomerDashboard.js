import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from '../../components/CustomerNavbar';


const CSS = `
  .hero-section { min-height: 90vh; position: relative; overflow: hidden; display: flex; align-items: center; }
  .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%); }
  .hero-content { position: relative; z-index: 2; padding: 0 80px; max-width: 700px; }
  @media (max-width: 768px) { .hero-content { padding: 0 32px; } }

  .hero-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 6px; text-transform: uppercase; color: #B8960C; display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .hero-gold-line { display: block; width: 80px; height: 1px; background: #B8960C; }

  .hero-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 72px; font-weight: 300; letter-spacing: -1px; color: white; line-height: 1.1; margin: 0 0 20px; }
  @media (max-width: 768px) { .hero-h1 { font-size: 48px; } }
  .hero-sub { font-family: 'DM Sans', sans-serif; font-size: 18px; color: rgba(255,255,255,0.85); margin: 0 0 40px; line-height: 1.7; max-width: 480px; }

  .btn-pill-gold {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 40px; border-radius: 50px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px; color: white;
    background: linear-gradient(90deg, #B8960C 0%, #D4AF37 40%, #B8960C 60%, #8B7209 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    box-shadow: 0 8px 32px rgba(184,150,12,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-pill-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(184,150,12,0.5); animation-duration: 1.5s; }

  .btn-pill-glass {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 40px; border-radius: 50px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px; color: white;
    background: rgba(255,255,255,0.08); border: 1.5px solid white;
    backdrop-filter: blur(6px);
    transition: background 0.2s;
  }
  .btn-pill-glass:hover { background: rgba(255,255,255,0.16); }

  .features-strip { background: #1C1C1E; padding: 20px 80px; }
  @media (max-width: 768px) { .features-strip { padding: 20px 32px; } }
  .features-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  @media (max-width: 700px) { .features-inner { grid-template-columns: repeat(2,1fr); } }
  .feature-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; }
  .feature-icon { font-size: 20px; color: #B8960C; }
  .feature-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }

  .section-wrap { max-width: 1200px; margin: 0 auto; padding: 80px 40px; }
  @media (max-width: 768px) { .section-wrap { padding: 60px 24px; } }

  .section-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 12px; }
  .section-h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 400; color: #1C1C1E; margin: 0 0 48px; }

  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }

  .svc-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: box-shadow 0.3s, transform 0.3s; cursor: pointer; }
  .svc-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.14); transform: translateY(-8px); }
  .svc-img-wrap { aspect-ratio: 4/5; min-height: 400px; height: auto; position: relative; overflow: hidden; background: linear-gradient(135deg, #1C1C1E 0%, #2C2416 100%); display: flex; align-items: center; justify-content: center; }
  .svc-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease; display: block; }
  .svc-card:hover .svc-img-wrap img { transform: scale(1.03); }
  .svc-placeholder-icon { font-size: 48px; color: #B8960C; text-shadow: 0 0 16px rgba(184,150,12,0.5); z-index: 2; }
  .svc-placeholder-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: white; opacity: 0.05; text-transform: uppercase; text-align: center; line-height: 1.1; pointer-events: none; z-index: 1; padding: 20px; }
  .svc-category-badge { position: absolute; top: 14px; left: 14px; background: #B8960C; color: white; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; z-index: 3; }
  .svc-body { padding: 24px; }
  .svc-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 600; color: #1C1C1E; margin: 0 0 8px; }
  .svc-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6B6B6B; line-height: 1.65; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .svc-footer { display: flex; align-items: center; justify-content: space-between; }
  .svc-price { font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 700; color: #1C1C1E; }
  .btn-svc-book { padding: 12px 24px; border-radius: 8px; background: linear-gradient(90deg, #B8960C 0%, #D4AF37 100%); color: white; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; transition: opacity 0.2s, transform 0.2s; }
  .btn-svc-book:hover { opacity: 0.9; transform: scale(1.02); }

  .offers-row { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: thin; }
  .offer-card { background: white; border-radius: 16px; min-width: 260px; max-width: 260px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border-top: 3px solid #B8960C; transition: box-shadow 0.3s, transform 0.3s; }
  .offer-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.14); transform: translateY(-4px); }

  .cta-banner { background: #1C1C1E; border-radius: 20px; padding: 56px; display: flex; align-items: center; justify-content: space-between; gap: 32px; position: relative; overflow: hidden; }
  @media (max-width: 768px) { .cta-banner { flex-direction: column; padding: 40px 32px; text-align: center; } }
  .cta-glow { position: absolute; top: -60px; right: -60px; width: 280px; height: 280px; background: radial-gradient(circle, rgba(184,150,12,0.18) 0%, transparent 70%); pointer-events: none; }
`;

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/services`).then(r => r.json()).then(d => setServices(d.slice(0, 3))).catch(() => { });
    fetch(`${API_BASE}/api/offers`).then(r => r.json())
      .then(d => setOffers(d.filter(o => !o.valid_until || new Date(o.valid_until) > new Date()).slice(0, 5)))
      .catch(() => { });
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Guest';

  const fallbackServices = [
    { title: 'Artisanal Hair Sculpting', desc: 'A bespoke cutting experience tailored to your facial structure and personal style.', price: 2500, icon: 'content_cut', cat: 'Hair' },
    { title: 'Radiance Facial', desc: 'Advanced oxygen-infused hydration therapy for a luminous, rested complexion.', price: 3500, icon: 'spa', cat: 'Skin' },
    { title: 'Noir Beard Grooming', desc: 'The ultimate ritual featuring hot towel service, razor detailing, and warm oil treatment.', price: 1800, icon: 'face', cat: 'Grooming' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <style>{CSS}</style>
      <CustomerNavbar />

      <main style={{ flexGrow: 1, paddingTop: 72 }}>

        {/* ── Hero ── */}
        <section className="hero-section">
          <img className="hero-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2000&q=85" alt="Luxury Salon" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.png'; }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-gold-line" />
              Welcome Back
              <span className="hero-gold-line" />
            </div>
            <h1 className="hero-h1">{firstName},<br />Look Stunning.</h1>
            <p className="hero-sub">Experience luxury grooming tailored to your unique style at The Salon At Reston.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <button className="btn-pill-gold" onClick={() => navigate('/appointments')}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
                Book Now
              </button>
              <button className="btn-pill-glass" onClick={() => navigate('/services')}>
                View Services
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Features Strip ── */}
        <div className="features-strip">
          <div className="features-inner">
            {[{ icon: 'verified', text: 'Certified Stylists' }, { icon: 'spa', text: 'Luxury Products' }, { icon: 'schedule', text: 'Flexible Booking' }, { icon: 'star', text: 'Premium Service' }].map(f => (
              <div key={f.text} className="feature-item">
                <span className="material-symbols-outlined feature-icon">{f.icon}</span>
                <span className="feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured Services ── */}
        <div style={{ background: '#FFFFFF' }}>
          <div className="section-wrap">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
              <div>
                <p className="section-eyebrow">Our Expertise</p>
                <h2 className="section-h2" style={{ margin: 0 }}>Featured Services</h2>
              </div>
              <button onClick={() => navigate('/services')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 600, color: '#B8960C', textTransform: 'uppercase', letterSpacing: '1px', transition: 'gap 0.2s' }}>
                View All <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
            </div>

            <div className="services-grid">
              {(services.length > 0 ? services : fallbackServices).map((s, i) => {
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const imgSrc = s.image_url || s.imageUrl;
                const fullImg = imgSrc ? (imgSrc.startsWith('/') ? `${API_BASE}${imgSrc}` : imgSrc) : null;
                return (
                  <div key={s.id || i} className="svc-card">
                    <div className="svc-img-wrap">
                      {fullImg
                        ? <img src={fullImg} alt={s.name || s.title} />
                        : (
                          <>
                            <span className="svc-placeholder-text">{s.name || s.title}</span>
                            <span className="material-symbols-outlined svc-placeholder-icon">{s.icon || 'content_cut'}</span>
                          </>
                        )
                      }
                      {(s.category || s.cat) && <span className="svc-category-badge">{s.category || s.cat}</span>}
                    </div>
                    <div className="svc-body">
                      <h3 className="svc-name">{s.name || s.title}</h3>
                      <p className="svc-desc">{s.description || s.desc}</p>
                      <div className="svc-footer">
                        <span className="svc-price">{'$' + Number(s.price || 0).toLocaleString()}</span>
                        <button className="btn-svc-book" onClick={() => navigate('/appointments')}>Book Now</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Active Offers ── */}
        {offers.length > 0 && (
          <div style={{ background: '#F8F7F5' }}>
            <div className="section-wrap">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
                <div>
                  <p className="section-eyebrow">Exclusive Deals</p>
                  <h2 className="section-h2" style={{ margin: 0 }}>Active Offers</h2>
                </div>
                <button onClick={() => navigate('/offers')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 600, color: '#B8960C', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  See All <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </button>
              </div>
              <div className="offers-row">
                {offers.map(offer => {
                  const API_BASE = process.env.REACT_APP_API_URL || '';
                  const img = offer.image_url ? (offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url) : null;
                  return (
                    <div key={offer.id} className="offer-card">
                      <div style={{ background: 'linear-gradient(145deg,#2A2A2A,#1C1C1E)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {img ? <img src={img} alt={offer.title} style={{ width: '100%', height: 'auto', display: 'block' }} /> : <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'rgba(184,150,12,0.5)', padding: '40px 0' }}>local_offer</span>}
                        {offer.discount_percent > 0 && (
                          <div style={{ position: 'absolute', top: 10, left: 10, background: '#B8960C', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 700, padding: '3px 12px', borderRadius: 50 }}>{offer.discount_percent}% OFF</div>
                        )}
                      </div>
                      <div style={{ padding: '16px 18px' }}>
                        <h3 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: 17, fontWeight: 600, color: '#1C1C1E', margin: '0 0 6px' }}>{offer.title}</h3>
                        <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: '#6B6B6B', margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{offer.description}</p>
                        {offer.valid_until && <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: '#AAAAAA', display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14, color: '#B8960C' }}>event</span>Until {new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CTA Banner ── */}
        <div style={{ background: '#FFFFFF' }}>
          <div className="section-wrap">
            <div className="cta-banner">
              <div className="cta-glow" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#B8960C', margin: '0 0 10px' }}>Manage</p>
                <h2 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: 40, fontWeight: 400, color: 'white', margin: '0 0 8px' }}>Your Appointments</h2>
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>View, manage and track all your upcoming and past bookings.</p>
              </div>
              <button className="btn-pill-gold" style={{ position: 'relative', zIndex: 1, flexShrink: 0 }} onClick={() => navigate('/appointments')}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
                My Appointments
              </button>
            </div>
          </div>
        </div>

      </main>


    </div>
  );
}