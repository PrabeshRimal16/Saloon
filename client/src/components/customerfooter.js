import React from 'react';

const CustomerFooter = () => {
  return (
    <>
      <style>{`
        .lux-footer {
          background: #1C1C1E;
          font-family: 'DM Sans', sans-serif;
        }
        .lux-footer-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1.4fr 1fr 1fr;
          gap: 64px; padding: 72px 40px 56px;
        }
        @media (max-width: 768px) {
          .lux-footer-grid { grid-template-columns: 1fr; gap: 40px; padding: 48px 24px 40px; }
        }
        .lux-footer-logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px; font-weight: 600; font-style: italic;
          color: #B8960C; letter-spacing: 1px; display: block; margin-bottom: 12px;
        }
        .lux-footer-tagline {
          font-size: 14px; color: #888888; font-style: italic;
          margin: 0 0 24px; line-height: 1.6;
        }
        .lux-footer-socials { display: flex; gap: 12px; }
        .lux-social-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1.5px solid #B8960C; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.25s; color: #B8960C; text-decoration: none;
        }
        .lux-social-btn:hover { background: #B8960C; color: #fff; }
        .lux-social-btn svg { width: 16px; height: 16px; fill: currentColor; }

        .lux-footer-col-title {
          font-size: 11px; font-weight: 600; letter-spacing: 4px;
          text-transform: uppercase; color: #B8960C;
          margin-bottom: 24px; display: block;
        }
        .lux-footer-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .lux-footer-link {
          font-size: 14px; color: #AAAAAA; text-decoration: none;
          background: none; border: none; cursor: pointer; text-align: left;
          padding: 0; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .lux-footer-link:hover { color: #B8960C; }

        .lux-footer-contact-item {
          display: flex; gap: 10px; margin-bottom: 14px; align-items: flex-start;
        }
        .lux-footer-contact-icon { font-size: 16px; color: #B8960C; margin-top: 1px; flex-shrink: 0; }
        .lux-footer-contact-text { font-size: 14px; color: #AAAAAA; line-height: 1.5; }

        .lux-footer-bottom {
          border-top: 1px solid #B8960C;
          max-width: 1200px; margin: 0 auto;
          padding: 20px 40px;
          display: flex; justify-content: space-between; align-items: center; gap: 16px;
        }
        @media (max-width: 600px) {
          .lux-footer-bottom { flex-direction: column; padding: 20px 24px; text-align: center; }
        }
        .lux-footer-copy { font-size: 12px; color: #666666; }
      `}</style>

      <footer className="lux-footer">
        <div className="lux-footer-grid">
          {/* Col 1 — Brand */}
          <div>
            <span className="lux-footer-logo">The Salon At Reston</span>
            <p className="lux-footer-tagline">Where beauty meets artistry.</p>
            <p style={{ fontSize: 13, color: '#666666', marginBottom: 24, lineHeight: 1.7 }}>
              Crafting excellence in beauty and grooming since 2012. A sanctuary for those who appreciate the finer things.
            </p>
            <div className="lux-footer-socials">
              {/* Instagram */}
              <a href="#" className="lux-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="lux-social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <span className="lux-footer-col-title">Explore</span>
            <ul className="lux-footer-links">
              {['Home', 'Services', 'Appointments', 'Offers', 'Contact'].map(l => (
                <li key={l}><button className="lux-footer-link">{l}</button></li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <span className="lux-footer-col-title">Visit Us</span>
            <div className="lux-footer-contact-item">
              <span className="material-symbols-outlined lux-footer-contact-icon">location_on</span>
              <span className="lux-footer-contact-text">1613 Washington Plaza N<br />Reston, VA 20190</span>
            </div>
            <div className="lux-footer-contact-item">
              <span className="material-symbols-outlined lux-footer-contact-icon">call</span>
              <span className="lux-footer-contact-text"><a href="tel:+15715196741" style={{ color: '#AAAAAA', textDecoration: 'none' }}>+1 571-519-6741</a></span>
            </div>
            <div className="lux-footer-contact-item">
              <span className="material-symbols-outlined lux-footer-contact-icon">mail</span>
              <span className="lux-footer-contact-text">info@thesalonatreston.com</span>
            </div>
            <div className="lux-footer-contact-item">
              <span className="material-symbols-outlined lux-footer-contact-icon">schedule</span>
              <span className="lux-footer-contact-text">Mon–Sat: 10:00 AM – 8:00 PM<br />Sunday: Closed</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="lux-footer-bottom">
          <p className="lux-footer-copy">© {new Date().getFullYear()} The Salon At Reston. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <button className="lux-footer-link">Privacy Policy</button>
            <button className="lux-footer-link">Terms of Service</button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CustomerFooter;
