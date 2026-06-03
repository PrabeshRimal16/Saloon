import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { logout, user, loading } = useAuth();

  const navItems = [
    { to: "/admin", label: "Overview", icon: "dashboard", end: true },
    { to: "/admin/services", label: "Services", icon: "content_cut" },
    { to: "/admin/appointments", label: "Appointments", icon: "calendar_month" },
    { to: "/admin/offers", label: "Offers", icon: "local_offer" },
    { to: "/admin/users", label: "Users", icon: "group" },
    { to: "/admin/settings", label: "Settings", icon: "settings" },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    try { logout && logout(); } catch (err) { /* ignore */ }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] bg-[#1C1C1E] flex flex-col z-40">
      <div className="pt-8 pb-8 px-6 text-center">
        <h1 className="font-heading text-primary text-h2 uppercase tracking-widest text-center">The Salon At Reston</h1>
      </div>

      <nav className="flex-1 overflow-auto py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to}
                end={item.end}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-6 py-3 transition-all duration-200 border-l-[3px] ` + 
                  (isActive 
                    ? 'border-primary bg-[rgba(201,168,76,0.08)] text-white' 
                    : 'border-transparent text-[#AAAAAA] hover:text-white hover:bg-[rgba(255,255,255,0.02)]')
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                    <span className="font-body text-body font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-12 h-12 rounded-full bg-[#333] animate-pulse shrink-0" />
          ) : (
            <>
              {(user && (user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture)) ? (
                <img src={user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture} alt={user.name || user.email} className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A84C] shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center text-[16px] font-bold border-2 border-[#C9A84C] text-[#C9A84C] shrink-0">
                  {(user && (user.name || user.email)) ? (user.name ? user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : (user.email[0]||'U').toUpperCase()) : 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white text-[14px] font-bold truncate">{user?.name || user?.displayName || user?.email || 'Admin'}</div>
                <div className="text-[#AAAAAA] text-[12px] truncate">Administrator</div>
              </div>
            </>
          )}
        </div>
        
        <div className="h-[1px] w-full bg-[rgba(255,255,255,0.1)]"></div>
        
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-[8px] text-[#C0392B] hover:bg-[rgba(192,57,43,0.1)] transition-colors duration-200">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-bold text-[13px] uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </aside>
  );
}
