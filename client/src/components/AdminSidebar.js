import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-animations.css';

export default function AdminSidebar() {
  const { logout, user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('admin_sidebar_collapsed') === '1';
    setCollapsed(v);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((s) => {
      const next = !s;
      localStorage.setItem('admin_sidebar_collapsed', next ? '1' : '0');
      return next;
    });
  };

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
    <aside className={`fixed top-0 left-0 h-screen bg-[#1A1A1A] flex flex-col z-40 admin-sidebar ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}>
      <div className="pt-8 pb-8 px-6 text-center">
        <h1 className={`font-heading text-primary text-h2 uppercase tracking-widest text-center transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}>The Salon At Reston</h1>
      </div>

      <nav className="flex-1 overflow-auto py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item, idx) => (
            <li key={item.to} className={`nav-item stagger-item ${collapsed ? 'collapsed' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }}>
              <NavLink 
                to={item.to}
                end={item.end}
                className={({ isActive }) => 
                  `relative flex items-center gap-3 px-6 py-3 transition-all duration-200 border-l-[3px] ` + 
                  (isActive 
                    ? 'active text-white' 
                    : 'border-transparent text-[#AAAAAA] hover:text-white')
                }
              >
                <div className="active-border" />
                <div className="hover-bg" />
                <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                <span className={`font-body text-body font-medium transition-opacity ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.label}</span>
                {collapsed && <div className="collapsed-tooltip">{item.label}</div>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.05)] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-[44px] h-[44px] rounded-full bg-[#333] animate-pulse shrink-0" />
          ) : (
            <>
              {(user && (user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture)) ? (
                <img src={user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture} alt={user.name || user.email} className="w-[44px] h-[44px] rounded-full object-cover border-2 border-[#C9A84C] shrink-0" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.style.display='none';}} />
              ) : null}

              {!(user && (user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture)) && (
                <div className="w-[44px] h-[44px] rounded-full bg-[#C9A84C] flex items-center justify-center text-[14px] font-bold text-white border-2 border-[#C9A84C] shrink-0">
                  {((user && (user.name || user.email)) ? (user.name ? user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : (user.email[0]||'P').toUpperCase()) : 'PR')}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-white text-[14px] font-bold truncate">{user?.name || user?.displayName || user?.email || 'Administrator'}</div>
                <div className="text-[#AAAAAA] text-[12px] truncate">Administrator</div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button onClick={toggleCollapse} className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-[#AAAAAA] hover:text-white transition-colors" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <span className="material-symbols-outlined">menu</span>
            <span className={`font-bold text-[13px] ${collapsed ? 'opacity-0 w-0' : ''}`}>Collapse</span>
          </button>

          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-[6px] text-[#C0392B] transition-colors duration-150">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-bold text-[13px]">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
