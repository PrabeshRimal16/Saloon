import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function CustomerNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo(() => [
    { name: 'Home',         path: '/' },
    { name: 'Services',     path: '/services' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Offers',       path: '/offers' },
    { name: 'Contact',      path: '/contact' },
  ], []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen for the external customerMobileToggle event (fired by sidebar etc.)
  useEffect(() => {
    const handler = () => setMobileOpen(o => !o);
    window.addEventListener('customerMobileToggle', handler);
    return () => window.removeEventListener('customerMobileToggle', handler);
  }, []);

  // Close drawer on route change
  const closeMobile = () => setMobileOpen(false);

  // Close drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

        .nav {
          position:fixed; top:0; left:0; right:0; z-index:1000;
          height:72px; display:flex; align-items:center;
          justify-content:space-between; padding:0 20px;
          background:rgba(255,255,255,0.98);
          border-bottom:1px solid #E8E0D5;
          transition: left .28s ease, box-shadow .22s ease;
          font-family: 'DM Sans', sans-serif;
        }
        @media (min-width:769px){ .nav { left: var(--customer-left, 220px); } }
        .nav.scrolled { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }

        .nav-left { display:flex; align-items:center; gap:14px; }

        .hamburger {
          width:40px; height:40px; border-radius:10px;
          display:none; align-items:center; justify-content:center;
          background:#F8F7F5; border:0; cursor:pointer; color:#1C1C1E;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .hamburger:hover { background:#FEF9ED; color:#B8960C; }

        .logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style:italic; color:#B8960C; font-size:20px;
          background:none; border:0; cursor:pointer; padding:0;
          transition: opacity 0.2s;
        }
        .logo:hover { opacity: 0.8; }

        .nav-links { display:flex; gap:8px; align-items:center; }
        .nav-link {
          padding:0 12px; height:72px; display:flex; align-items:center;
          text-decoration:none; font-size:13px; color:#6B6B6B;
          border-bottom:2px solid transparent;
          transition: color .15s, border-color .15s;
          white-space: nowrap;
        }
        .nav-link:hover { color:#B8960C; }
        .nav-link.active { color:#B8960C; border-bottom-color:#B8960C; }

        .nav-right { display:flex; align-items:center; gap:12px; }
        .btn-book-nav {
          display:inline-flex; align-items:center; gap:6px;
          padding:10px 22px; border-radius:50px; border:none; cursor:pointer;
          font-family:'DM Sans', sans-serif; font-size:12px; font-weight:600;
          text-transform:uppercase; letter-spacing:1.5px; color:white;
          background: linear-gradient(90deg,#B8960C 0%,#D4AF37 50%,#B8960C 100%);
          background-size:200% auto;
          animation: nav-shimmer 3s linear infinite;
          box-shadow: 0 4px 16px rgba(184,150,12,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space:nowrap; min-height: 40px;
        }
        .btn-book-nav:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(184,150,12,0.45); }
        @keyframes nav-shimmer { to { background-position: 200% center; } }

        /* ── Mobile ── */
        @media (max-width:768px){
          .nav-links { display:none; }
          .nav { padding:0 12px; }
          .hamburger { display:inline-flex; }
          .btn-book-nav { padding:8px 14px; font-size:11px; }
        }

        /* ── Mobile Drawer ── */
        .mobile-drawer-backdrop {
          position: fixed; inset: 0; z-index: 998;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(2px);
          animation: fade-in-bd 0.2s ease;
        }
        @keyframes fade-in-bd { from { opacity:0 } to { opacity:1 } }

        .mobile-drawer {
          position: fixed; top: 72px; left: 0; right: 0; z-index: 999;
          background: white;
          border-bottom: 1px solid #E8E0D5;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          display: flex; flex-direction: column;
          animation: drawer-slide-down 0.25s cubic-bezier(0.34,1.1,0.64,1) forwards;
          overflow: hidden;
        }
        @keyframes drawer-slide-down {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-drawer-link {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 24px; text-decoration: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          color: #1C1C1E; border-bottom: 1px solid #F5F0EB;
          transition: background 0.15s, color 0.15s;
          min-height: 56px;
        }
        .mobile-drawer-link:last-of-type { border-bottom: none; }
        .mobile-drawer-link:hover { background: #FBF9F5; color: #B8960C; }
        .mobile-drawer-link.active { color: #B8960C; font-weight: 600; }
        .mobile-drawer-link .mob-link-icon { font-size: 20px; color: #B8960C; opacity: 0.7; }
        .mobile-drawer-book {
          margin: 16px 24px 20px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 24px; border-radius: 50px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px; color: white;
          background: linear-gradient(90deg,#B8960C 0%,#D4AF37 50%,#B8960C 100%);
          background-size: 200% auto; animation: nav-shimmer 3s linear infinite;
          box-shadow: 0 4px 20px rgba(184,150,12,0.35);
          min-height: 50px;
        }
      `}</style>

      {/* ── Main Navbar ── */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-left">
          {/* Hamburger — mobile only */}
          <button
            className="hamburger touch-target"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>

          <button className="logo" onClick={() => { navigate('/'); closeMobile(); }}>
            The Salon At Reston
          </button>

          {/* Desktop links */}
          <div className="nav-links" role="list">
            {navLinks.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                end={l.path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                role="listitem"
              >
                {l.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side: Book Now CTA */}
        <div className="nav-right">
          <button
            className="btn-book-nav touch-target"
            onClick={() => { navigate('/appointments'); closeMobile(); }}
            aria-label="Book an appointment"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_add_on</span>
            Book Now
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer (only on small screens) ── */}
      {mobileOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <nav className="mobile-drawer" aria-label="Mobile navigation">
            {navLinks.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                end={l.path === '/'}
                className={({ isActive }) => `mobile-drawer-link${isActive ? ' active' : ''}`}
                onClick={closeMobile}
              >
                <span className="material-symbols-outlined mob-link-icon">
                  {l.path === '/'             ? 'home'
                  : l.path === '/services'    ? 'spa'
                  : l.path === '/appointments'? 'calendar_month'
                  : l.path === '/offers'      ? 'local_offer'
                  : 'mail'}
                </span>
                {l.name}
              </NavLink>
            ))}
            <button
              className="mobile-drawer-book"
              onClick={() => { navigate('/appointments'); closeMobile(); }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_add_on</span>
              Book an Appointment
            </button>
          </nav>
        </>
      )}
    </>
  );
}

export default React.memo(CustomerNavbar);