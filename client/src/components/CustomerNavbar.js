import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function CustomerNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      <style>{`
        .nav { position:fixed; top:0; left:0; right:0; z-index:1000; height:72px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; background:rgba(255,255,255,0.98); border-bottom:1px solid #E8E0D5; transition:left .28s ease, box-shadow .22s ease; font-family: 'DM Sans', sans-serif; }
        @media (min-width:769px){ .nav { left: var(--customer-left, 220px); } }
        .nav.scrolled { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .nav-left { display:flex; align-items:center; gap:14px; }
        .hamburger { width:36px; height:36px; border-radius:8px; display:none; align-items:center; justify-content:center; background:#F8F7F5; border:0; cursor:pointer; color:#1C1C1E; }
        .hamburger:hover { background:#FEF9ED; color:#B8960C; }
        .logo { font-family: 'Cormorant Garamond', Georgia, serif; font-style:italic; color:#B8960C; font-size:20px; background:none; border:0; cursor:pointer; padding:0; }
        .links { display:flex; gap:8px; align-items:center; }
        .link { padding:0 12px; height:72px; display:flex; align-items:center; text-decoration:none; font-size:13px; color:#6B6B6B; border-bottom:2px solid transparent; transition: color .15s, border-color .15s; }
        .link:hover { color:#B8960C; }
        .link.active { color:#B8960C; border-bottom-color:#B8960C; }
        .nav-right { display:flex; align-items:center; gap:12px; }
        .btn-book-nav {
          display:inline-flex; align-items:center; gap:6px;
          padding:10px 22px; border-radius:50px; border:none; cursor:pointer;
          font-family:'DM Sans', sans-serif; font-size:12px; font-weight:600;
          text-transform:uppercase; letter-spacing:1.5px; color:white;
          background: linear-gradient(90deg,#B8960C 0%,#D4AF37 50%,#B8960C 100%);
          background-size:200% auto;
          animation: shimmer 3s linear infinite;
          box-shadow: 0 4px 16px rgba(184,150,12,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space:nowrap;
        }
        .btn-book-nav:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(184,150,12,0.45); }
        @media (max-width:768px){ .links{ display:none; } .nav{ padding:0 12px; } .hamburger{ display:inline-flex; } .btn-book-nav{ padding:8px 14px; font-size:11px; } }
      `}</style>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-left">
          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            aria-label="Open menu"
            onClick={() => window.dispatchEvent(new CustomEvent('customerMobileToggle'))}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
          </button>

          <button className="logo" onClick={() => navigate('/')}>The Salon At Reston</button>

          <div className="links">
            {navLinks.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                end={l.path === '/'}
                className={({ isActive }) => `link${isActive ? ' active' : ''}`}
              >
                {l.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side: Book Now CTA */}
        <div className="nav-right">
          <button
            className="btn-book-nav"
            onClick={() => navigate('/appointments')}
            aria-label="Book an appointment"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_add_on</span>
            Book Now
          </button>
        </div>
      </nav>
    </>
  );
}

export default React.memo(CustomerNavbar);