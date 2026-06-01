import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Overview', icon: 'dashboard' },
    { to: '/admin/services', label: 'Services', icon: 'content_cut' },
    { to: '/admin/appointments', label: 'Appointments', icon: 'calendar_today' },
    { to: '/admin/users', label: 'Clients', icon: 'group' },
    { to: '/admin/offers', label: 'Offers', icon: 'local_offer' },
    { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-6 z-50 bg-surface dark:bg-surface-container border-r border-outline-variant/30 w-64 md:flex hidden">
        <div className="mb-8">
          <h1 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">L'Atelier</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.2em]">Admin Suite</p>
        </div>
        <nav className="flex-1 space-y-2">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 py-3 transition-all duration-200 pl-4 ${isActive(item.to) ? 'text-primary dark:text-primary-fixed font-bold border-l-2 border-secondary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-secondary'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-4 pt-6">
          <button onClick={() => navigate('/admin/services')} className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md transition-transform active:scale-95">Book New Service</button>
          <button onClick={logout} className="w-full py-3 border border-outline-variant/30">Sign out</button>
        </div>
      </aside>

      {/* Topbar */}
      <header className="flex justify-between items-center w-full px-gutter h-20 sticky top-0 z-40 bg-surface/90 dark:bg-surface-container/90 backdrop-blur-[30px] border-b border-outline-variant/30 md:pl-72">
        <div className="flex items-center gap-4 md:hidden">
          <span className="material-symbols-outlined text-primary cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>menu</span>
          <span className="font-headline-md text-headline-md text-primary tracking-tight">L'Atelier</span>
        </div>
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 gap-3 w-96 border-outline rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-body-md w-full" placeholder="Search..." />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined">help_outline</span></button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <div className="text-right hidden lg:block">
              <p className="text-label-sm font-bold text-primary">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 overflow-hidden">
              <img alt="Administrator Profile" className="w-full h-full object-cover" src={user?.avatar_url || 'https://via.placeholder.com/100'} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full bg-surface border-b border-outline-variant/30 z-50 p-4 space-y-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="block py-2 px-4 font-label-md text-label-md" onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}
        </div>
      )}
    </>
  );
}
