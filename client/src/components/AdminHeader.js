import React, { useEffect, useRef, useState } from 'react';
import '../styles/admin-animations.css';

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function avatarInitials(name, email) {
  if (!name && !email) return 'U';
  const src = name || email;
  const parts = src.split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function AdminHeader({ title }) {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

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
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // notification shake when new notification arrives
  const [shake, setShake] = useState(false);
  const prevCount = useRef(0);
  useEffect(() => {
    if (notifications.length > prevCount.current) {
      setShake(true);
      setTimeout(() => setShake(false), 700);
    }
    prevCount.current = notifications.length;
  }, [notifications.length]);

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem('admin_sidebar_collapsed') === '1';
    setSidebarCollapsed(v);
  }, []);

  useEffect(() => {
    const onToggle = (e) => {
      try { setSidebarCollapsed(!!e.detail); } catch (err) {}
    };
    window.addEventListener('adminSidebarToggle', onToggle);
    return () => window.removeEventListener('adminSidebarToggle', onToggle);
  }, []);

  return (
    <header style={{ left: 'var(--admin-left,220px)' }} className="fixed top-0 right-0 z-40 bg-white border-b border-[#EDE8DC] h-[80px] flex items-center px-8 transition-all duration-300">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="font-heading text-[20px] font-bold text-dark">{title || 'Admin'}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center relative">
            <span className="material-symbols-outlined absolute left-3 text-primary text-[20px] pointer-events-none">search</span>
            <input
              type="text"
              placeholder="Search admin..."
              className="w-64 bg-[#F5F5F5] border border-transparent rounded-full py-[10px] pl-10 pr-4 text-body font-body outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
            />
          </div>

          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`btn-interactive w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-[#FEF9ED] transition-colors ${shake ? 'notif-shake' : ''}`}
              title="Notifications"
            >
              <span className="material-symbols-outlined text-primary text-[24px]">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-light-border rounded-card shadow-modal z-50 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-light-border flex items-center justify-between bg-cream">
                  <h3 className="font-body font-bold text-dark">Notifications</h3>
                  <span className="text-label text-grey uppercase tracking-widest">{notifications.length} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-4 border-b border-light-border last:border-b-0 hover:bg-[#FEF9ED] transition-colors cursor-pointer">
                        <div className="text-[14px] text-dark font-medium">{notif.type === 'offer' ? '🎁 Offer Update' : '📅 Appointment'}</div>
                        <div className="text-[13px] text-grey mt-1 leading-snug">{notif.message}</div>
                        <div className="text-[11px] text-[#AAAAAA] mt-2 font-medium">
                          {new Date(notif.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center">
                      <span className="material-symbols-outlined text-primary text-[32px] mb-2 opacity-50">notifications_off</span>
                      <p className="text-[14px] text-grey">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-light-border hidden md:block"></div>

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-[#E0E0E0] animate-pulse" />
          ) : (
            <Link to="/admin/settings" className="flex items-center gap-3">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName || 'Admin avatar'} loading="lazy" className="w-10 h-10 rounded-full object-cover border-[2px] border-primary" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder.png';}} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#FEF9ED] border-[2px] border-primary flex items-center justify-center text-[14px] font-bold text-primary">
                  {avatarInitials(displayName, user?.email)}
                </div>
              )}
              <div className="hidden sm:flex flex-col justify-center">
                <span className="font-body text-[14px] font-bold text-dark leading-tight">{displayName || 'Admin'}</span>
                <span className="font-body text-[12px] text-grey leading-tight">Administrator</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default React.memo(AdminHeader);
