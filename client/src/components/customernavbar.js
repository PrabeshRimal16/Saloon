import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

function CustomerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notifRef = useRef(null);
  const avatarRef = useRef(null);
  
  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!user?.id) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications/customer/${user.id}`);
        const data = await res.json();
        setNotifications(data);
      } catch (_) {}
    };
    fetch_();
    const iv = setInterval(fetch_, 10000);
    return () => clearInterval(iv);
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setShowAvatar(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Services', path: '/services' },
    { name: 'My Appointments', path: '/appointments' },
    { name: 'Offers', path: '/offers' },
    { name: 'About Us', path: '/contact' },
  ];

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const avatar = user?.avatar_url || user?.photo || user?.avatar;

  return (
    <>
      <style>{`
        .lux-nav {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 72px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #E8E0D5;
          transition: box-shadow 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .lux-nav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.07); }

        .lux-logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px; font-weight: 600; font-style: italic;
          color: #B8960C; letter-spacing: 1px; cursor: pointer;
          text-decoration: none; background: none; border: none;
        }
        .lux-logo:hover { color: #8B7209; }

        .lux-links { display: flex; align-items: center; gap: 0; }
        .lux-link {
          font-size: 13px; font-weight: 500; padding: 0 18px; height: 72px;
          display: flex; align-items: center;
          color: #6B6B6B; text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          cursor: pointer; background: none; border-top: none; border-left: none; border-right: none;
          font-family: 'DM Sans', sans-serif;
        }
        .lux-link:hover { color: #B8960C; }
        .lux-link.active { color: #B8960C; border-bottom-color: #B8960C; }

        .lux-divider { width: 1px; height: 28px; background: #E8E0D5; margin: 0 16px; }

        /* Search */
        .lux-search-wrap { position: relative; display: flex; align-items: center; }
        .lux-search-icon {
          position: absolute; left: 12px;
          font-size: 18px; color: #AAAAAA; pointer-events: none;
        }
        .lux-search {
          width: 180px; height: 36px;
          background: #F8F7F5; border: 1.5px solid transparent;
          border-radius: 50px; padding: 0 16px 0 36px;
          font-size: 13px; color: #1C1C1E;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; outline: none;
        }
        .lux-search::placeholder { color: #AAAAAA; }
        .lux-search:focus { border-color: #B8960C; background: #fff; width: 220px; box-shadow: 0 0 0 3px rgba(184,150,12,0.1); }

        /* Bell */
        .lux-bell-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: #F8F7F5; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          position: relative; transition: background 0.2s;
        }
        .lux-bell-btn:hover { background: #FEF9ED; }
        .lux-bell-icon { font-size: 20px; color: #B8960C; }
        .lux-notif-dot {
          position: absolute; top: 4px; right: 4px;
          width: 8px; height: 8px; background: #C0392B;
          border-radius: 50%; border: 2px solid white;
        }

        /* Notif dropdown */
        .lux-notif-drop {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 300px; background: white;
          border: 1px solid #E8E0D5; border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12); z-index: 200;
          overflow: hidden;
        }
        .lux-notif-header {
          padding: 14px 18px; border-bottom: 1px solid #E8E0D5;
          font-weight: 600; font-size: 13px; color: #1C1C1E;
          display: flex; justify-content: space-between; align-items: center;
          background: #F8F7F5;
        }
        .lux-notif-item {
          padding: 12px 18px; border-bottom: 1px solid #F0EBE0;
          font-size: 13px; cursor: pointer; transition: background 0.15s;
        }
        .lux-notif-item:hover { background: #FEF9ED; }
        .lux-notif-empty {
          padding: 32px 18px; text-align: center; color: #AAAAAA; font-size: 13px;
        }

        /* Avatar */
        .lux-avatar-wrap { position: relative; }
        .lux-avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #B8960C; cursor: pointer;
          overflow: hidden; display: flex; align-items: center; justify-content: center;
          background: #FEF9ED; transition: box-shadow 0.2s;
        }
        .lux-avatar-btn:hover { box-shadow: 0 0 0 3px rgba(184,150,12,0.2); }
        .lux-avatar-initials { font-size: 14px; font-weight: 600; color: #B8960C; font-family: 'Cormorant Garamond', serif; }

        /* Avatar dropdown */
        .lux-avatar-drop {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 200px; background: white;
          border: 1px solid #E8E0D5; border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12); z-index: 200;
          overflow: hidden;
        }
        .lux-avatar-drop-item {
          width: 100%; padding: 12px 18px; text-align: left;
          font-size: 13px; font-weight: 500;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 10px; color: #1C1C1E;
          transition: background 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .lux-avatar-drop-item:hover { background: #F8F7F5; }
        .lux-avatar-drop-item.danger { color: #C0392B; }
        .lux-avatar-drop-item.danger:hover { background: #FFF5F5; }

        /* Logout icon btn (fallback) */
        .lux-logout-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: transparent; border: 1.5px solid #E8E0D5;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; color: #6B6B6B;
          position: relative;
        }
        .lux-logout-btn:hover { border-color: #C0392B; color: #C0392B; background: #FFF5F5; }
        .lux-logout-btn .tooltip {
          position: absolute; top: calc(100% + 6px); left: 50%;
          transform: translateX(-50%); background: #1C1C1E;
          color: white; font-size: 11px; padding: 4px 8px;
          border-radius: 4px; white-space: nowrap; pointer-events: none;
          opacity: 0; transition: opacity 0.15s;
        }
        .lux-logout-btn:hover .tooltip { opacity: 1; }
      `}</style>

      <nav className={`lux-nav${scrolled ? ' scrolled' : ''}`}>
        {/* Left: Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="lux-logo" onClick={() => navigate('/')}>The Salon At Reston</button>

          <div style={{ width: 1, height: 28, background: '#E8E0D5', margin: '0 28px' }} />

          <div className="lux-links">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `lux-link${isActive ? ' active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right: Search + Bell + Divider + Avatar */}
          <div className="lux-search-wrap">
            <span className="material-symbols-outlined lux-search-icon">search</span>
            <input className="lux-search" placeholder="Search services..." type="text" />
          </div>

          {/* Bell */}
          <div className="lux-notif-drop-wrap" ref={notifRef} style={{ position: 'relative' }}>
            <button className="lux-bell-btn" onClick={() => setShowNotifications(v => !v)}>
              <span className="material-symbols-outlined lux-bell-icon">notifications</span>
              {notifications.length > 0 && <span className="lux-notif-dot" />}
            </button>

            {showNotifications && (
              <div className="lux-notif-drop">
                <div className="lux-notif-header">
                  <span>Notifications</span>
                  <span style={{ color: '#B8960C', fontSize: 11, fontWeight: 600 }}>{notifications.length} new</span>
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div key={i} className="lux-notif-item">
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{n.type === 'offer' ? '🎁 New Offer' : '📅 Appointment Update'}</div>
                      <div style={{ color: '#6B6B6B', fontSize: 12 }}>{n.message}</div>
                    </div>
                  )) : (
                    <div className="lux-notif-empty">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lux-divider" />

          {/* Avatar dropdown */}
          <div className="lux-avatar-wrap" ref={avatarRef}>
            <button className="lux-avatar-btn" onClick={() => setShowAvatar(v => !v)}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="lux-avatar-initials">{initials}</span>
              }
            </button>

            {showAvatar && (
              <div className="lux-avatar-drop">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #E8E0D5', background: '#F8F7F5' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1C1C1E' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: 11, color: '#AAAAAA', marginTop: 2 }}>{user?.email}</div>
                </div>
                <button className="lux-avatar-drop-item" onClick={() => { navigate('/settings'); setShowAvatar(false); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                  My Profile
                </button>
                <button className="lux-avatar-drop-item danger" onClick={() => { logout(); setShowAvatar(false); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default React.memo(CustomerNavbar);
