import React from 'react';
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

  const displayName = user?.name || user?.displayName || user?.email || '';
  const avatarSrc = user?.avatar_url || user?.photo || user?.avatar || user?.avatarUrl || user?.picture || null;

  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 lg:px-10">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">{title || 'Admin'}</h1>
          <p className="text-sm text-gray-500">Manage site settings and content</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <input
              aria-label="Search"
              placeholder="Search admin..."
              className="px-3 py-2 border rounded-md text-sm w-64"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:inline-block px-3 py-2 rounded-md bg-gray-100 text-sm">Notifications</button>
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <Link to="/admin/settings" className="flex items-center gap-3">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">{avatarInitials(displayName, user?.email)}</div>
                )}
                <span className="hidden sm:inline-block text-sm font-medium text-gray-700">{displayName}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
