import { useState, useEffect, useCallback } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';

const CSS = `
  .offers-page { background: #FFFFFF; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* Hero */
  .offers-hero { position: relative; min-height: 55vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #1C1C1E; text-align: center; }
  .offers-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3; }
  .offers-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(28,28,30,0.5) 0%, rgba(28,28,30,0.7) 100%); }
  .offers-hero-content { position: relative; z-index: 2; max-width: 700px; padding: 0 32px; }
  .offers-hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 16px; }
  .offers-hero-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 60px; font-weight: 300; color: white; margin: 0 0 16px; line-height: 1.1; letter-spacing: -0.5px; }
  @media (max-width: 600px) { .offers-hero-h1 { font-size: 40px; } }
  .offers-hero-sub { font-size: 16px; color: rgba(255,255,255,0.7); max-width: 520px; margin: 0 auto; line-height: 1.7; }

  /* Controls */
  .offers-controls { max-width: 1200px; margin: 0 auto; padding: 48px 40px 32px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  @media (max-width: 600px) { .offers-controls { padding: 32px 24px 24px; } }
  .offers-tab-group { display: flex; gap: 8px; }
  .offers-tab { padding: 0 24px; height: 40px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .offers-tab.active { background: #B8960C; border: 1.5px solid #B8960C; color: white; box-shadow: 0 4px 16px rgba(184,150,12,0.3); }
  .offers-tab.inactive { background: transparent; border: 1.5px solid #B8960C; color: #B8960C; }
  .offers-tab.inactive:hover { background: rgba(184,150,12,0.06); }
  .offers-count { font-size: 13px; color: #AAAAAA; }

  /* Grid */
  .offers-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; }
  @media (max-width: 768px) { .offers-grid-wrap { padding: 0 24px 60px; } }
  .offers-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  @media (max-width: 900px) { .offers-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 580px) { .offers-grid { grid-template-columns: 1fr; } }

  /* Active card */
  .offer-card-lux { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); display: flex; flex-direction: column; transition: box-shadow 0.3s, transform 0.3s; }
  .offer-card-lux:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.14); transform: translateY(-5px); }
  .offer-gold-top { background: linear-gradient(135deg, #8B7209 0%, #B8960C 40%, #D4AF37 70%, #B8960C 100%); padding: 40px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
  .offer-discount-num { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 60px; font-weight: 600; color: white; line-height: 1; }
  .offer-discount-off { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-top: -4px; }
  .offer-card-img { width: 100%; height: auto; display: block; }
  .offer-card-body { padding: 24px; flex-grow: 1; display: flex; flex-direction: column; gap: 10px; }
  .offer-card-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 600; color: #1C1C1E; margin: 0; }
  .offer-card-desc { font-size: 13px; color: #6B6B6B; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1; }
  .offer-meta-row { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #E8E0D5; flex-wrap: wrap; gap: 10px; }
  .offer-valid { font-size: 12px; color: #AAAAAA; display: flex; align-items: center; gap: 4px; }

  /* Promo chip */
  .promo-chip { display: inline-flex; align-items: center; gap: 6px; background: #F8F7F5; border: 1px solid #E8E0D5; border-radius: 6px; padding: 4px 10px; cursor: pointer; transition: border-color 0.2s; }
  .promo-chip:hover { border-color: #B8960C; }
  .promo-code-text { font-family: 'Courier New', monospace; font-size: 13px; font-weight: 700; color: #B8960C; }
  .promo-copy-icon { font-size: 14px; color: #AAAAAA; }

  .btn-offer-book { width: 100%; margin-top: 4px; padding: 12px 0; border-radius: 50px; background: #B8960C; color: white; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: background 0.2s; }
  .btn-offer-book:hover { background: #8B7209; }
  .btn-offer-book:disabled { background: #E8E0D5; color: #AAAAAA; cursor: not-allowed; }

  /* Expired card */
  .offer-card-expired { opacity: 0.35; position: relative; }
  .expired-ribbon { position: absolute; top: 12px; right: -8px; background: #6B6B6B; color: white; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 16px; border-radius: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 8px 100%); }

  /* Empty */
  .offers-empty { text-align: center; padding: 80px 24px; }
  .offers-empty-icon { font-size: 56px; color: rgba(184,150,12,0.35); display: block; margin-bottom: 20px; }

  /* Show expired toggle */
  .show-expired-link { display: block; text-align: center; padding: 16px; font-size: 13px; color: #AAAAAA; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; margin-bottom: 32px; }
  .show-expired-link:hover { color: #B8960C; }

  /* Newsletter */
  .offers-nl { background: #1C1C1E; padding: 80px 40px; text-align: center; }
  .offers-nl-inner { max-width: 560px; margin: 0 auto; }

  /* Toast */
  .toast-lux { padding: 14px 20px; border-radius: 10px; color: white; font-size: 13px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.15); animation: slideInRight 0.3s ease-out; }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
`;

const generatePromoCode = (title) => title.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 900 + 100);

const OffersAndRitualsPage = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/offers`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (msg, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg, type }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500);
  };

  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    addNotification(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const handleBookWithCode = useCallback((code) => {
    addNotification(`Use code "${code}" when booking!`);
  }, []);

  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
    const email = new FormData(e.target).get('email');
    addNotification(`${email} added to the circle!`);
    e.target.reset();
  }, []);

  const activeOffers = offers.filter(o => !o.valid_until || new Date(o.valid_until) >= new Date());
  const expiredOffers = offers.filter(o => o.valid_until && new Date(o.valid_until) < new Date());
  const displayOffers = showExpired ? offers : activeOffers;

  const renderCard = (offer, expired = false) => {
    const promoCode = generatePromoCode(offer.title);
    const discountPercent = offer.discount_percent || 0;
    const imgUrl = offer.image_url
      ? (offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url)
      : null;

    return (
      <div key={offer.id} className={`offer-card-lux${expired ? ' offer-card-expired' : ''}`} style={{ position: 'relative' }}>
        {expired && <span className="expired-ribbon">Expired</span>}

        {/* Gold top or image */}
        {imgUrl ? (
          <div style={{ overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <img src={imgUrl} alt={offer.title} className="offer-card-img" />
            {discountPercent > 0 && (
              <div style={{ position:'absolute', top:12, left:12, background:'#B8960C', color:'white', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:700, padding:'3px 12px', borderRadius:50 }}>{discountPercent}% OFF</div>
            )}
          </div>
        ) : (
          <div className="offer-gold-top">
            {discountPercent > 0 ? (
              <>
                <span className="offer-discount-num">{discountPercent}%</span>
                <span className="offer-discount-off">OFF</span>
              </>
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'rgba(255,255,255,0.7)' }}>local_offer</span>
            )}
          </div>
        )}

        <div className="offer-card-body">
          <h3 className="offer-card-title">{offer.title}</h3>
          <p className="offer-card-desc">{offer.description}</p>

          <div className="offer-meta-row">
            <div className="offer-valid">
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#B8960C' }}>event</span>
              {offer.valid_until
                ? new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Ongoing'}
            </div>
            <div className="promo-chip" onClick={() => handleCopyCode(promoCode)} title="Click to copy">
              <span className="promo-code-text">{promoCode}</span>
              <span className="material-symbols-outlined promo-copy-icon">
                {copiedCode === promoCode ? 'check' : 'content_copy'}
              </span>
            </div>
          </div>

          <button className="btn-offer-book" onClick={() => !expired && handleBookWithCode(promoCode)} disabled={expired}>
            {expired ? 'Offer Expired' : 'Book with Code'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="offers-page">
        <CustomerNavbar />

        {/* Toast notifications */}
        <div style={{ position:'fixed', top:88, right:20, zIndex:999, display:'flex', flexDirection:'column', gap:8 }}>
          {notifications.map(n => (
            <div key={n.id} className="toast-lux" style={{ background: n.type === 'success' ? '#2D7A4F' : '#1C1C1E' }}>{n.msg}</div>
          ))}
        </div>

        <main style={{ paddingTop: 72 }}>
          {/* Hero */}
          <section className="offers-hero">
            <img className="offers-hero-img" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=80" alt="Luxury salon" />
            <div className="offers-hero-overlay" />
            <div className="offers-hero-content">
              <p className="offers-hero-eyebrow">Curated Experiences</p>
              <h1 className="offers-hero-h1">Exclusive Rituals &amp; Seasonal Offers</h1>
              <p className="offers-hero-sub">Step into a world of bespoke beauty. Our seasonal rituals are designed to harmonize your inner glow.</p>
            </div>
          </section>

          {/* Controls */}
          {!loading && (
            <div className="offers-controls">
              <div className="offers-tab-group">
                <button className={`offers-tab ${!showExpired ? 'active' : 'inactive'}`} onClick={() => setShowExpired(false)}>
                  Active Offers ({activeOffers.length})
                </button>
                <button className={`offers-tab ${showExpired ? 'active' : 'inactive'}`} onClick={() => setShowExpired(true)}>
                  All Offers
                </button>
              </div>
              <span className="offers-count">{displayOffers.length} offer{displayOffers.length !== 1 ? 's' : ''} shown</span>
            </div>
          )}

          {/* Grid */}
          <div className="offers-grid-wrap">
            {loading ? (
              <div style={{ textAlign:'center', padding:'80px 0' }}>
                <div style={{ width:40, height:40, border:'2px solid #B8960C', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
                <p style={{ fontSize:14, color:'#AAAAAA' }}>Loading exclusive offers...</p>
              </div>
            ) : displayOffers.length === 0 ? (
              <div className="offers-empty">
                <span className="material-symbols-outlined offers-empty-icon">card_giftcard</span>
                <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:30, fontWeight:400, color:'#1C1C1E', margin:'0 0 10px' }}>No active offers right now</h2>
                <p style={{ fontSize:14, color:'#AAAAAA' }}>Check back soon — new rituals are crafted seasonally.</p>
              </div>
            ) : (
              <div className="offers-grid">
                {displayOffers.map(offer => {
                  const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date();
                  return renderCard(offer, isExpired);
                })}
              </div>
            )}

            {/* Show/hide expired toggle */}
            {!loading && expiredOffers.length > 0 && (
              <button className="show-expired-link" onClick={() => setShowExpired(v => !v)}>
                {showExpired ? '↑ Hide expired offers' : `Show ${expiredOffers.length} expired offer${expiredOffers.length > 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {/* Distinction section */}
          <section style={{ background: '#F8F7F5', padding: '80px 40px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'#B8960C', marginBottom:14 }}>Why Choose Us</p>
                <h2 style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:44, fontWeight:400, color:'#1C1C1E', margin:'0 0 28px', lineHeight:1.15 }}>The Salon At Reston Distinction</h2>
                {[
                  { icon:'content_cut', title:'Master Artistry', desc:'Every professional is a certified master, trained in the latest global trends and classic techniques.' },
                  { icon:'star', title:'Premium Curations', desc:'We partner exclusively with luxury brands like Oribe and Valmont for the highest standard of care.' },
                ].map(item => (
                  <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:24 }}>
                    <div style={{ width:44, height:44, borderRadius:8, background:'#1C1C1E', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:20, color:'#B8960C' }}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#1C1C1E', margin:'0 0 6px' }}>{item.title}</h4>
                      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#6B6B6B', lineHeight:1.7, margin:0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderRadius:16, overflow:'hidden', boxShadow:'0 12px 48px rgba(0,0,0,0.12)' }}>
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" alt="Salon" style={{ width:'100%', height:400, objectFit:'cover', display:'block' }} />
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <div className="offers-nl">
            <div className="offers-nl-inner">
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'#B8960C', marginBottom:14 }}>Join The Circle</p>
              <h2 style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:44, fontWeight:400, color:'white', margin:'0 0 12px' }}>Stay in the Know</h2>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:36, lineHeight:1.7 }}>Exclusive early access to seasonal rituals and private salon events.</p>
              <form style={{ display:'flex', flexDirection:'column', gap:0 }} onSubmit={handleNewsletterSubmit}>
                <div style={{ display:'flex', gap:0, flexWrap:'wrap', gap:12 }}>
                  <input className="svc-search" style={{ flex:1, background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.2)', color:'white', minWidth:200, borderRadius:50, padding:'12px 24px', fontFamily:'DM Sans,sans-serif', fontSize:14, outline:'none' }} placeholder="Your email address" type="email" name="email" required />
                  <button type="submit" style={{ padding:'12px 32px', borderRadius:50, background:'#B8960C', border:'none', color:'white', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', whiteSpace:'nowrap', transition:'background 0.2s' }}>Join Now</button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <CustomerFooter />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default OffersAndRitualsPage;