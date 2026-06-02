import React, { useEffect, useRef } from 'react';
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

  const displayName = user?.name || user?.displayName || user?.email || '';
  const avatarSrc = user?.avatar_url || user?.photo || user?.avatar || user?.avatarUrl || user?.picture || null;

  return (
    <header ref={headerRef} className="app-header w-full fixed top-0 left-0 right-0 z-50 border-b border-transparent">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 lg:px-10 h-full">
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
            <button className="hidden md:inline-block header-button">Notifications</button>
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
