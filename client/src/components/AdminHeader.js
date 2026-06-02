import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function avatarInitials(name, email) {
  if (!name && !email) return 'U';
  const src = name || email;
  const parts = src.split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function AdminHeader({ title }) {
  const { user, loading } = useAuth();
  const headerRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const setHeaderHeight = () => {
      try {
        const h = headerRef.current ? headerRef.current.offsetHeight : 96;
        document.documentElement.style.setProperty('--app-header-height', `${h}px`);
      } catch (e) {
        document.documentElement.style.setProperty('--app-header-height', `96px`);
      }
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    return () => window.removeEventListener('resize', setHeaderHeight);
  }, []);

  // Fetch admin notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || '';
        const res = await fetch(`${API_BASE}/api/notifications/admin`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

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

  const displayName = user?.name || user?.displayName || user?.email || '';
  const avatarSrc = user?.avatar_url || user?.photo || user?.avatar || user?.avatarUrl || user?.picture || null;

  return (
    <header ref={headerRef} className="app-header fixed top-0 left-0 right-0 z-50 h-16 border-b border-transparent">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between pl-64 px-4 lg:px-10 h-full">
        <div>
          <h1 className="text-2xl font-serif">{title || 'Admin'}</h1>
          <p className="text-sm" style={{color:'rgba(255,255,255,0.85)'}}>Manage site settings and content</p>
        </div>

          <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <input
              aria-label="Search"
                placeholder="Search admin..."
                className="px-3 py-2 border rounded-md text-sm w-64 search-input"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 relative transition-colors"
                title="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <span className="text-xs text-gray-500">{notifications.length} new</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                          <div className="text-sm text-gray-800 font-medium">{notif.type === 'offer' ? '🎁 Offer' : '📅 Appointment'}</div>
                          <div className="text-sm text-gray-600 mt-1">{notif.message}</div>
                          <div className="text-xs text-gray-400 mt-2">
                            {new Date(notif.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <Link to="/admin/settings" className="flex items-center gap-3">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">{avatarInitials(displayName, user?.email)}</div>
                )}
                <span className="hidden sm:inline-block user-name">{displayName}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
