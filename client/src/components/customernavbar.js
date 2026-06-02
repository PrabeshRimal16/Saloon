import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CustomerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname || '/';

  const isActive = (path) => {
    if (path === '/') return currentPath === '/' || currentPath === '/customer';
    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-gutter py-3" style={{background: 'var(--primary)', color: 'var(--primary-contrast)', boxShadow: '0 6px 24px rgba(15,23,42,0.06)'}}>
      <div className="flex items-center gap-8">
        <button aria-label="home" onClick={() => navigate('/')} className="font-headline-md text-headline-md font-bold text-primary uppercase tracking-widest" style={{color:'var(--primary-contrast)'}}>L'Atelier</button>

        <div className="hidden md:flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className={
              (isActive('/') ? 'font-bold ' : '') +
              'transition-colors font-label-md text-label-md'
            }
            style={{color:'rgba(255,255,255,0.85)', textDecoration: isActive('/') ? 'underline' : 'none'}}
          >Home</a>
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); navigate('/services'); }}
            className={(isActive('/services') ? 'font-bold ' : '') + 'transition-colors font-label-md text-label-md'}
            style={{color:'rgba(255,255,255,0.85)'}}
          >Services</a>
          <a
            href="/appointments"
            onClick={(e) => { e.preventDefault(); navigate('/appointments'); }}
            className={(isActive('/appointments') ? 'text-secondary font-bold border-b-2 border-secondary pb-1 ' : '') + 'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md'}
          >Appointments</a>
          <a
            href="/offers"
            onClick={(e) => { e.preventDefault(); navigate('/offers'); }}
            className={(isActive('/offers') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md'}
          >Offers</a>
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
            className={(isActive('/contact') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md'}
          >Contact</a>
          <a
            href="/settings"
            onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
            className={(isActive('/settings') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md'}
          >Profile</a>
        </div>
      </div>

        <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3 mr-4">
          <span className="font-label-md text-label-md user-name truncate" style={{color:'var(--primary-contrast)'}}>Welcome, {user?.name || 'Guest'}</span>
          <button aria-label="notifications" className="header-button material-symbols-outlined">notifications</button>
        </div>

        <div className="flex items-center gap-3 pl-4" style={{borderLeft: '1px solid rgba(255,255,255,0.06)'}}>
          <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full overflow-hidden border" style={{borderColor:'rgba(255,255,255,0.08)'}}>
            {user?.avatar_url || user?.photo || user?.avatar ? (
              <img alt="User Profile" className="w-full h-full object-cover" src={user?.avatar_url || user?.photo || user?.avatar} />
            ) : (
              <span className="text-sm font-medium" style={{color:'var(--primary-contrast)'}}>{(user?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </button>
          <button onClick={logout} title="Logout" className="header-button">Logout</button>
        </div>
      </div>
    </nav>
  );
}
