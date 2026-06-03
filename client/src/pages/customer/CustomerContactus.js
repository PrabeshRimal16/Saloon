import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';

const CSS = `
  .contact-page { background: #FFFFFF; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* Hero */
  .contact-hero { position: relative; min-height: 44vh; display: flex; align-items: center; overflow: hidden; background: #1C1C1E; }
  .contact-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.35; }
  .contact-hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(28,28,30,0.92) 0%, rgba(28,28,30,0.6) 55%, rgba(28,28,30,0.1) 100%); }
  .contact-hero-content { position: relative; z-index: 2; padding: 80px; max-width: 680px; }
  @media (max-width: 768px) { .contact-hero-content { padding: 60px 32px; } }
  .contact-hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 16px; }
  .contact-hero-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 60px; font-weight: 300; color: white; margin: 0 0 16px; letter-spacing: -0.5px; line-height: 1.1; }
  @media (max-width: 600px) { .contact-hero-h1 { font-size: 40px; } }
  .contact-hero-sub { font-size: 16px; color: rgba(255,255,255,0.75); line-height: 1.7; max-width: 440px; margin: 0; }

  /* Info cards row */
  .contact-cards-row { max-width: 1200px; margin: 0 auto; padding: 56px 40px 0; display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  @media (max-width: 900px) { .contact-cards-row { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 500px) { .contact-cards-row { grid-template-columns: 1fr 1fr; padding: 40px 24px 0; gap: 12px; } }

  .info-card { background: white; border-radius: 14px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); border-left: 0px solid #B8960C; transition: box-shadow 0.3s, border-left-width 0.3s, transform 0.2s; cursor: default; }
  .info-card:hover { box-shadow: 0 10px 36px rgba(0,0,0,0.12); border-left: 3px solid #B8960C; transform: translateY(-3px); }
  .info-icon-circle { width: 40px; height: 40px; border-radius: 50%; background: rgba(184,150,12,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .info-icon { font-size: 20px; color: #B8960C; }
  .info-title { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #B8960C; margin-bottom: 8px; }
  .info-text { font-size: 14px; color: #1C1C1E; line-height: 1.6; }

  /* Main body */
  .contact-main { max-width: 1200px; margin: 0 auto; padding: 56px 40px 80px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; }
  @media (max-width: 880px) { .contact-main { grid-template-columns: 1fr; padding: 40px 24px 60px; } }

  /* Form card */
  .contact-form-card { background: white; border-radius: 20px; padding: 48px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  @media (max-width: 600px) { .contact-form-card { padding: 32px 24px; } }
  .form-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 10px; }
  .form-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 400; color: #1C1C1E; margin: 0 0 32px; }

  /* Floating input style */
  .field-wrap { position: relative; margin-bottom: 32px; }
  .field-input, .field-select, .field-textarea {
    width: 100%; background: transparent; border: none;
    border-bottom: 1.5px solid #E8E0D5; padding: 12px 0 10px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1C1C1E;
    outline: none; transition: border-color 0.25s; box-sizing: border-box;
    display: block;
  }
  .field-input:focus, .field-select:focus, .field-textarea:focus { border-bottom-color: #B8960C; }
  .field-input::placeholder, .field-textarea::placeholder { color: transparent; }
  .field-textarea { resize: vertical; min-height: 100px; }
  .field-select { cursor: pointer; background: transparent; }
  .field-label {
    position: absolute; left: 0; top: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #AAAAAA;
    transition: all 0.2s; pointer-events: none;
    text-transform: uppercase; letter-spacing: 1px;
  }
  .field-input:focus ~ .field-label,
  .field-input:not(:placeholder-shown) ~ .field-label,
  .field-select:focus ~ .field-label,
  .field-textarea:focus ~ .field-label,
  .field-textarea:not(:placeholder-shown) ~ .field-label { top: -14px; font-size: 10px; color: #B8960C; letter-spacing: 2px; font-weight: 600; }

  .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 500px) { .form-row-2 { grid-template-columns: 1fr; } }

  .btn-send { display: inline-flex; align-items: center; gap: 8px; padding: 14px 40px; border-radius: 50px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: white; background: linear-gradient(90deg, #B8960C 0%, #D4AF37 50%, #B8960C 100%); background-size: 200% auto; animation: shimmer 3s linear infinite; box-shadow: 0 4px 20px rgba(184,150,12,0.35); transition: transform 0.2s, box-shadow 0.2s; }
  .btn-send:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,150,12,0.45); }

  .success-toast { background: rgba(45,122,79,0.1); border: 1px solid rgba(45,122,79,0.25); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .success-toast-text { font-size: 13px; color: #1E6B40; font-weight: 500; }

  /* Right column */
  .contact-right { display: flex; flex-direction: column; gap: 24px; }

  .map-card { border-radius: 20px; overflow: hidden; border: 4px solid #B8960C; box-shadow: 0 4px 24px rgba(0,0,0,0.1); position: relative; flex-shrink: 0; }
  .map-card img { width: 100%; height: 260px; object-fit: cover; display: block; filter: grayscale(0.3); transition: filter 0.4s; }
  .map-card:hover img { filter: grayscale(0); }
  .map-overlay-card { position: absolute; bottom: 14px; left: 14px; right: 14px; background: rgba(255,255,255,0.96); backdrop-filter: blur(6px); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }

  .hours-card { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .hours-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .hours-line { width: 40px; height: 2px; background: #B8960C; }
  .hours-title { font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #1C1C1E; }
  .hours-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #F0EBE0; }
  .hours-row:last-of-type { border-bottom: none; }
  .hours-day { font-size: 14px; color: #6B6B6B; }
  .hours-time { font-size: 14px; font-weight: 700; color: #1C1C1E; }
  .hours-closed { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #B8960C; }
  .hours-note { font-size: 12px; color: #AAAAAA; font-style: italic; margin-top: 16px; line-height: 1.6; }
`;

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const infoCards = [
    { icon: 'location_on', title: 'Address', lines: ['1613 Washington Plaza N, Reston, VA 20190, United States', 'Located in Lake Anne Plaza - Main Parking lot'] },
    { icon: 'call', title: 'Phone', lines: ['+1 571-519-6741'] },
    { icon: 'mail', title: 'Email', lines: ['info@thesalonatreston.com'] },
    { icon: 'schedule', title: 'Hours', lines: ['Mon–Sat: 10AM – 8PM', 'Sunday: Closed'] },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="contact-page">
        <CustomerNavbar />

        <main style={{ paddingTop: 72 }}>

          {/* Hero */}
          <section className="contact-hero">
            <img className="contact-hero-img" src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80" alt="Salon interior" />
            <div className="contact-hero-overlay" />
            <div className="contact-hero-content">
              <p className="contact-hero-eyebrow">Reach Out</p>
              <h1 className="contact-hero-h1">Get in Touch</h1>
              <p className="contact-hero-sub">Whether you're looking for a transformation or a moment of tranquility, our experts are here to guide you.</p>
            </div>
          </section>

          {/* Info cards */}
          <div className="contact-cards-row">
            {infoCards.map(card => (
              <div key={card.title} className="info-card">
                <div className="info-icon-circle">
                  <span className="material-symbols-outlined info-icon">{card.icon}</span>
                </div>
                <p className="info-title">{card.title}</p>
                {card.lines.map((l, i) => {
                  if (card.title === 'Phone') {
                    const tel = l.replace(/[^+\d]/g, '');
                    return (
                      <p key={i} className="info-text" style={{ margin: i < card.lines.length - 1 ? '0 0 2px' : 0 }}>
                        <a href={`tel:${tel}`} style={{ color: '#1C1C1E', textDecoration: 'none', fontWeight: 700 }}>{l}</a>
                      </p>
                    );
                  }
                  if (card.title === 'Address' && i === 1) {
                    return (
                      <p key={i} className="info-text" style={{ margin: 0, color: '#777777', fontSize: 13 }}>{l}</p>
                    );
                  }
                  return <p key={i} className="info-text" style={{ margin: i < card.lines.length - 1 ? '0 0 2px' : 0 }}>{l}</p>;
                })}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="contact-main">

            {/* Form */}
            <div className="contact-form-card">
              <p className="form-eyebrow">Message Us</p>
              <h2 className="form-title">Send a Message</h2>

              {submitted && (
                <div className="success-toast">
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#2D7A4F' }}>check_circle</span>
                  <p className="success-toast-text">Thank you! We'll be in touch soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row-2">
                  <div className="field-wrap">
                    <input className="field-input" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <label className="field-label">Full Name</label>
                  </div>
                  <div className="field-wrap">
                    <input className="field-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <label className="field-label">Email Address</label>
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="field-wrap">
                    <input className="field-input" type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                    <label className="field-label">Phone (Optional)</label>
                  </div>
                  <div className="field-wrap">
                    <select className="field-select" name="service" value={formData.service} onChange={handleChange}>
                      <option value="">Select service</option>
                      <option>Hair Styling</option>
                      <option>Beard Grooming</option>
                      <option>Facial Treatment</option>
                      <option>Nail Care</option>
                      <option>Other</option>
                    </select>
                    <label className="field-label" style={{ top: formData.service ? -14 : 12, fontSize: formData.service ? 10 : 13, color: formData.service ? '#B8960C' : '#AAAAAA', letterSpacing: formData.service ? '2px' : '1px' }}>Service</label>
                  </div>
                </div>
                <div className="field-wrap">
                  <textarea className="field-textarea" name="message" placeholder="Message" rows={4} value={formData.message} onChange={handleChange} required />
                  <label className="field-label">How can we assist you?</label>
                </div>
                <button type="submit" className="btn-send">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                  Send Message
                </button>
              </form>
            </div>

            {/* Right side */}
            <div className="contact-right">
              {/* Map */}
              <div className="map-card">
                <iframe
                  title="The Salon At Reston - Map"
                  src="https://www.google.com/maps/place/The+Salon+At+Reston/@38.9688042,-77.3434271,17z"
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-overlay-card">
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#B8960C' }}>explore</span>
                  <div>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color:'#1C1C1E', margin:0 }}>1613 Washington Plaza N, Reston, VA 20190</p>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:'#AAAAAA', margin:'2px 0 0', textTransform:'uppercase', letterSpacing:'1px' }}>
                      Located in Lake Anne Plaza - Main Parking lot
                    </p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <a href="https://www.google.com/maps/place/The+Salon+At+Reston/@38.9688042,-77.3434271,17z" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-send" style={{ padding: '8px 14px', borderRadius: 12 }}>Click to open in Maps</button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="hours-card">
                <div className="hours-header">
                  <span className="hours-line" />
                  <h3 className="hours-title">Opening Hours</h3>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Monday — Friday</span>
                  <span className="hours-time">10:00 AM – 8:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Saturday</span>
                  <span className="hours-time">9:00 AM – 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Sunday</span>
                  <span className="hours-closed">Closed</span>
                </div>
                <p className="hours-note">* Private appointments outside standard hours are available upon special request.</p>
              </div>
            </div>

          </div>
        </main>

        <CustomerFooter />
      </div>
    </>
  );
};

export default ContactUsPage;