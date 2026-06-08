import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

  const navLinks = useMemo(() => ([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
  ]), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    try {
      const res = await fetch(`${API_BASE}/api/notifications/customer/${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 10000);
    return () => clearInterval(iv);
  }, [fetchNotifications]);

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setShowAvatar(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .lux-nav { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:72px; background:rgba(255,255,255,0.97); backdrop-filter:blur(12px); border-bottom:1px solid #E8E0D5; transition:box-shadow .25s ease; font-family: 'DM Sans', sans-serif; }
        .lux-nav.scrolled { box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
        .lux-left { display:flex; align-items:center; gap:22px; }
        .lux-logo { font-family: 'Cormorant Garamond', Georgia, serif; font-size:20px; font-style:italic; color:#B8960C; background:none; border:none; cursor:pointer; }
        .lux-links { display:flex; gap:8px; align-items:center; }
        .lux-link { font-size:13px; color:#6B6B6B; text-decoration:none; padding:0 12px; height:72px; display:flex; align-items:center; border-bottom:2px solid transparent; transition:color .15s, border-color .15s; }
        .lux-link:hover { color:#B8960C; }
        .lux-link.active { color:#B8960C; border-bottom-color:#B8960C; }
        .lux-right { display:flex; align-items:center; gap:12px; }
        .lux-bell-btn { width:36px; height:36px; border-radius:50%; background:#F8F7F5; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; }
        .lux-bell-btn:hover { background:#FEF9ED; }
        .lux-bell-icon { font-size:20px; color:#B8960C; }
        .lux-notif-dot { position:absolute; top:6px; right:6px; width:8px; height:8px; background:#C0392B; border-radius:50%; border:2px solid #fff; }
        .lux-notif-drop { position:absolute; top:calc(100% + 10px); right:0; width:320px; background:#fff; border:1px solid #E8E0D5; border-radius:10px; box-shadow:0 12px 40px rgba(0,0,0,0.12); z-index:200; }
        .lux-notif-header { padding:12px 14px; border-bottom:1px solid #E8E0D5; display:flex; justify-content:space-between; align-items:center; background:#F8F7F5; font-weight:600; color:#1C1C1E; }
        .lux-notif-item { padding:12px 14px; border-bottom:1px solid #F0EBE0; color:#1C1C1E; font-size:13px; }
        .lux-notif-empty { padding:20px; text-align:center; color:#AAAAAA; }
        .lux-avatar-wrap { position:relative; }
        .lux-avatar-btn { width:36px; height:36px; border-radius:50%; border:2px solid #B8960C; background:#FEF9ED; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .lux-avatar-initials { font-family:'Cormorant Garamond', serif; color:#B8960C; font-weight:700; }
        .lux-avatar-drop { position:absolute; top:calc(100% + 10px); right:0; width:200px; background:#fff; border:1px solid #E8E0D5; border-radius:10px; box-shadow:0 12px 40px rgba(0,0,0,0.12); z-index:200; }
        .lux-avatar-drop-item { width:100%; padding:10px 12px; background:none; border:none; text-align:left; cursor:pointer; font-size:13px; color:#1C1C1E; }
        .lux-avatar-drop-item:hover { background:#F8F7F5; }
      `}</style>

      <nav className={`lux-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="lux-left">
          <button className="lux-logo" onClick={() => navigate('/')}>The Salon At Reston</button>
          <div style={{ width:1, height:28, background:'#E8E0D5' }} />
          <div className="lux-links">
            {navLinks.map((l) => (
              <NavLink key={l.path} to={l.path} className={({isActive}) => `lux-link${isActive ? ' active' : ''}`}>
                {l.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="lux-right">
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button className="lux-bell-btn" onClick={() => setShowNotifications(v => !v)} aria-label="Notifications">
              <span className="material-symbols-outlined lux-bell-icon">notifications</span>
              {notifications.length > 0 && <span className="lux-notif-dot" />}
            </button>

            {showNotifications && (
              <div className="lux-notif-drop" role="dialog" aria-label="Notifications">
                <div className="lux-notif-header">
                  <span>Notifications</span>
                  <span style={{ color: '#B8960C', fontSize: 12, fontWeight: 600 }}>{notifications.length} new</span>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div className="lux-notif-item" key={i}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{n.type === 'offer' ? '🎁 Offer' : '📅 Appointment'}</div>
                      <div style={{ color: '#6B6B6B', fontSize: 13 }}>{n.message}</div>
                    </div>
                  )) : (
                    <div className="lux-notif-empty">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 28, background: '#E8E0D5' }} />

          <div className="lux-avatar-wrap" ref={avatarRef}>
            <button className="lux-avatar-btn" onClick={() => setShowAvatar(v => !v)} aria-label="Profile menu">
              {user && (user.avatar_url || user.photo) ? (
                <img src={user.avatar_url || user.photo} alt={user.name || user.email} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span className="lux-avatar-initials">{initials}</span>
              )}
            </button>

            {showAvatar && (
              <div className="lux-avatar-drop" role="menu">
                <div style={{ padding: 12, borderBottom: '1px solid #E8E0D5', background: '#F8F7F5' }}>
                  <div style={{ fontWeight: 700 }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: 12, color: '#6B6B6B' }}>{user?.email}</div>
                </div>
                <button className="lux-avatar-drop-item" onClick={() => { navigate('/settings'); setShowAvatar(false); }}>My Profile</button>
                <button className="lux-avatar-drop-item danger" onClick={() => { try { logout && logout(); } catch (e) {} setShowAvatar(false); }}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default React.memo(CustomerNavbar);
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
                ? <img src={avatar} alt={user?.name || user?.email || 'User avatar'} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder.png';}} />
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
      </nav>
    </>
  );
}

export default React.memo(CustomerNavbar);
