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
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="flex items-center gap-12">
        <button aria-label="home" onClick={() => navigate('/')} className="font-headline-md text-headline-md font-bold text-primary uppercase tracking-widest">L'Atelier</button>
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className={
              (isActive('/') ? 'text-secondary font-bold border-b-2 border-secondary pb-1 ' : '') +
              'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md'
            }
          >
            Home
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); navigate('/services'); }}
            className={(isActive('/services') ? 'text-secondary font-bold ' : '') + 'text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md'}
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
          >Contact Us</a>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3">
          <span className="font-label-md text-label-md text-on-surface-variant">Welcome, {user?.name || 'Guest'}</span>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-outline-variant/30">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/50">
            <img alt="User Profile" className="w-full h-full object-cover" src={user?.avatar_url || 'https://via.placeholder.com/150'} />
          </div>
          <button onClick={logout} className="material-symbols-outlined text-outline hover:text-error transition-colors">logout</button>
        </div>
      </div>
    </nav>
  );
}
