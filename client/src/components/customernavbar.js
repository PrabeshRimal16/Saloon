import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CustomerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname || '/';
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const isActive = (path) => {
    if (path === '/') return currentPath === '/' || currentPath === '/customer';
    return currentPath === path || currentPath.startsWith(path);
  };

  // Fetch customer notifications
  useEffect(() => {
    if (!user || !user.id) return;
    const fetchNotifications = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || '';
        const res = await fetch(`${API_BASE}/api/notifications/customer/${user.id}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

  // Handle click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-gutter py-3 transition-all duration-300" style={{background: 'var(--primary)', color: 'var(--primary-contrast)', boxShadow: '0 6px 24px rgba(15,23,42,0.06)'}}>
      <div className="flex items-center gap-8">
        <button aria-label="home" onClick={() => navigate('/')} className="btn-interactive font-headline-md text-headline-md font-bold text-primary uppercase tracking-widest" style={{color:'var(--primary-contrast)'}}>L'Atelier</button>

        <div className="hidden md:flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className={
              (isActive('/') ? 'font-bold ' : '') +
              'transition-colors font-label-md text-label-md hover:text-secondary'
            }
            style={{color:'rgba(255,255,255,0.85)', textDecoration: isActive('/') ? 'underline' : 'none'}}
          >Home</a>
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); navigate('/services'); }}
            className={(isActive('/services') ? 'font-bold ' : '') + 'transition-colors font-label-md text-label-md hover:text-secondary'}
            style={{color:'rgba(255,255,255,0.85)'}}
          >Services</a>
          <a
            href="/appointments"
            onClick={(e) => { e.preventDefault(); navigate('/appointments'); }}
            className={(isActive('/appointments') ? 'text-secondary font-bold border-b-2 border-secondary pb-1 ' : '') + 'text-on-surface-variant hover:text-secondary transition-colors font-label-md text-label-md'}
          >Appointments</a>
          <a
            href="/offers"
            onClick={(e) => { e.preventDefault(); navigate('/offers'); }}
            className={(isActive('/offers') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-secondary transition-colors font-label-md text-label-md'}
          >Offers</a>
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
            className={(isActive('/contact') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-secondary transition-colors font-label-md text-label-md'}
          >Contact</a>
          <a
            href="/settings"
            onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
            className={(isActive('/settings') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-secondary transition-colors font-label-md text-label-md'}
          >Profile</a>
        </div>
      </div>

        <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3 mr-4">
          <span className="font-label-md text-label-md user-name truncate" style={{color:'var(--primary-contrast)'}}>Welcome, {user?.name || 'Guest'}</span>
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="notifications" 
              className="btn-interactive material-symbols-outlined relative hover:opacity-75 transition-opacity"
              style={{color:'var(--primary-contrast)'}}
            >
              notifications
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-on-background border border-outline-variant rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-outline-variant flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <span className="text-xs text-outline">{notifications.length} new</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="px-4 py-3 border-b border-outline-variant last:border-b-0 hover:bg-surface-container transition-colors">
                        <div className="text-sm font-medium">{notif.type === 'offer' ? '🎁 New Offer' : '📅 Appointment Update'}</div>
                        <div className="text-sm text-on-surface-variant mt-1">{notif.message}</div>
                        <div className="text-xs text-outline mt-2">
                          {new Date(notif.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-on-surface-variant text-sm">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pl-4" style={{borderLeft: '1px solid rgba(255,255,255,0.06)'}}>
          <button onClick={() => navigate('/settings')} className="btn-interactive w-10 h-10 rounded-full overflow-hidden border" style={{borderColor:'rgba(255,255,255,0.08)'}}>
            {user?.avatar_url || user?.photo || user?.avatar ? (
              <img alt="User Profile" className="w-full h-full object-cover" src={user?.avatar_url || user?.photo || user?.avatar} />
            ) : (
              <span className="text-sm font-medium" style={{color:'var(--primary-contrast)'}}>{(user?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </button>
          <button onClick={logout} title="Logout" className="btn-interactive header-button">Logout</button>
        </div>
      </div>
    </nav>
  );
}
