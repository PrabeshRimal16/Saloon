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

  const navLinks = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
  ], []);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    try {
      const res = await fetch(`${API_BASE}/api/notifications/customer/${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 10000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onDoc(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setShowAvatar(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .nav { position:fixed; top:0; left:0; right:0; z-index:1000; height:72px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; background:rgba(255,255,255,0.98); border-bottom:1px solid #E8E0D5; transition:box-shadow .22s ease; font-family: 'DM Sans', sans-serif; }
        .nav.scrolled { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .nav-left { display:flex; align-items:center; gap:18px; }
        .logo { font-family: 'Cormorant Garamond', Georgia, serif; font-style:italic; color:#B8960C; font-size:20px; background:none; border:0; cursor:pointer; }
        .links { display:flex; gap:8px; align-items:center; }
        .link { padding:0 12px; height:72px; display:flex; align-items:center; color:#1C1C1E; text-decoration:none; font-size:13px; color:#6B6B6B; border-bottom:2px solid transparent; transition: color .15s, border-color .15s; }
        .link:hover { color:#B8960C; }
        .link.active { color:#B8960C; border-bottom-color:#B8960C; }
        .nav-right { display:flex; align-items:center; gap:12px; }
        .bell { width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:#F8F7F5; border:0; cursor:pointer; position:relative; }
        .bell:hover { background:#FEF9ED; }
        .bell .material-symbols-outlined { color:#B8960C; font-size:20px; }
        .dot { position:absolute; top:6px; right:6px; width:8px; height:8px; background:#C0392B; border-radius:50%; border:2px solid #fff; }
        .notif-drop { position:absolute; top:calc(100% + 10px); right:0; width:320px; background:#fff; border:1px solid #E8E0D5; border-radius:10px; box-shadow:0 12px 40px rgba(0,0,0,0.12); z-index:1200; }
        .notif-header { padding:12px 14px; border-bottom:1px solid #E8E0D5; background:#F8F7F5; display:flex; justify-content:space-between; align-items:center; font-weight:600; color:#1C1C1E; }
        .notif-item { padding:10px 14px; border-bottom:1px solid #F0EBE0; font-size:13px; color:#1C1C1E; }
        .avatar-btn { width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:#FEF9ED; border:2px solid #B8960C; cursor:pointer; }
        .avatar-initials { font-family:'Cormorant Garamond', serif; color:#B8960C; font-weight:700; }
        .avatar-drop { position:absolute; top:calc(100% + 10px); right:0; width:200px; background:#fff; border:1px solid #E8E0D5; border-radius:10px; box-shadow:0 12px 40px rgba(0,0,0,0.12); z-index:1200; }
        .avatar-item { width:100%; padding:10px 12px; text-align:left; background:none; border:0; cursor:pointer; display:flex; gap:8px; align-items:center; color:#1C1C1E; }
        .avatar-item.danger { color:#C0392B; }
        @media (max-width:768px){ .links{ display:none; } .nav{ padding:0 12px; } }
      `}</style>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-left">
          <button className="logo" onClick={() => navigate('/')}>The Salon At Reston</button>
          <div className="links">
            {navLinks.map((l) => (
              <NavLink key={l.path} to={l.path} className={({ isActive }) => `link${isActive ? ' active' : ''}`}>
                {l.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-right">
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="bell" aria-label="Notifications" onClick={() => setShowNotifications(v => !v)}>
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && <span className="dot" />}
            </button>

            {showNotifications && (
              <div className="notif-drop" role="menu">
                <div className="notif-header">
                  <span>Notifications</span>
                  <span style={{ color: '#B8960C', fontSize: 12, fontWeight: 600 }}>{notifications.length} new</span>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div className="notif-item" key={i}>
                      <div style={{ fontWeight: 600 }}>{n.type === 'offer' ? '🎁 Offer' : '📅 Appointment'}</div>
                      <div style={{ color: '#6B6B6B', marginTop: 6 }}>{n.message}</div>
                    </div>
                  )) : (
                    <div style={{ padding: 18, color: '#AAAAAA' }}>No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 28, background: '#E8E0D5' }} />

          <div style={{ position: 'relative' }} ref={avatarRef}>
            <button className="avatar-btn" aria-label="Account" onClick={() => setShowAvatar(v => !v)}>
              {user?.avatar_url || user?.photo ? (
                <img src={user.avatar_url || user.photo} alt={user?.name || user?.email} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder.png';}} />
              ) : (
                <span className="avatar-initials">{initials}</span>
              )}
            </button>

            {showAvatar && (
              <div className="avatar-drop" role="menu">
                <div style={{ padding: 12, borderBottom: '1px solid #E8E0D5', background: '#F8F7F5' }}>
                  <div style={{ fontWeight: 700 }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: 12, color: '#6B6B6B' }}>{user?.email}</div>
                </div>
                <button className="avatar-item" onClick={() => { navigate('/settings'); setShowAvatar(false); }}>My Profile</button>
                <button className="avatar-item danger" onClick={() => { try { logout && logout(); } catch (e) {} setShowAvatar(false); }}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default React.memo(CustomerNavbar);
