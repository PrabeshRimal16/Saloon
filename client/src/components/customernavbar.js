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
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
    { name: 'Profile', path: '/settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[32px] h-[80px] bg-white border-b border-[#EDE8DC] transition-all duration-300">
      <div className="flex items-center gap-12">
        <button aria-label="home" onClick={() => navigate('/')} className="btn-interactive font-serif text-[20px] font-bold text-[#C9A84C] uppercase tracking-widest">
          L'Atelier
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => { e.preventDefault(); navigate(link.path); }}
              className={`font-body text-[14px] font-medium transition-colors duration-200 ${
                isActive(link.path) 
                  ? 'text-[#C9A84C] border-b-[2px] border-[#C9A84C] pb-1' 
                  : 'text-gray-600 hover:text-[#C9A84C]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center relative">
          <span className="material-symbols-outlined absolute left-3 text-primary text-[20px] pointer-events-none">search</span>
          <input
            type="text"
            placeholder="Search services..."
            className="w-48 bg-[#F5F5F5] border border-transparent rounded-[8px] py-[10px] pl-10 pr-4 text-body font-body outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
          />
        </div>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="notifications" 
            className="btn-interactive w-10 h-10 rounded-full flex items-center justify-center relative bg-[#FEF9ED] border border-[rgba(201,168,76,0.2)]"
          >
            <span className="material-symbols-outlined text-primary text-[24px]">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
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
                      <div className="text-[14px] text-dark font-medium">{notif.type === 'offer' ? '🎁 New Offer' : '📅 Appointment Update'}</div>
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

        <div className="h-8 w-[1px] bg-light-border"></div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/settings')} className="btn-interactive w-10 h-10 rounded-full overflow-hidden border-2 border-primary bg-[#FEF9ED] flex items-center justify-center">
            {user?.avatar_url || user?.photo || user?.avatar ? (
              <img alt="User Profile" className="w-full h-full object-cover" src={user?.avatar_url || user?.photo || user?.avatar} />
            ) : (
              <span className="text-[14px] font-bold text-primary">{(user?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </button>
          <button onClick={logout} title="Logout" className="btn-interactive text-[14px] font-medium text-grey hover:text-primary transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
