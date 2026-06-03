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
    try { document.documentElement.style.setProperty('--admin-left', v ? '64px' : '220px'); } catch (e) {}
  }, []);

  const toggleCollapse = () => {
    setCollapsed((s) => {
      const next = !s;
      localStorage.setItem('admin_sidebar_collapsed', next ? '1' : '0');
      // set css var and notify other components (header) about the change
      try { document.documentElement.style.setProperty('--admin-left', next ? '64px' : '220px'); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('adminSidebarToggle', { detail: next })); } catch (e) {}
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
    <aside className={`fixed top-0 left-0 h-screen bg-[#1A1A1A] flex flex-col z-40 admin-sidebar ${collapsed ? 'w-[64px] is-collapsed' : 'w-[220px]'}`}>
      <div className="pt-4 pb-4 px-3 flex items-center justify-between">
        <div className={`pl-2 ${collapsed ? 'opacity-0' : ''}`}>
          <h1 className="font-heading text-primary text-h4 uppercase tracking-widest">The Salon At Reston</h1>
        </div>
        <div className="pr-1">
          <button onClick={toggleCollapse} className="w-8 h-8 rounded-full flex items-center justify-center text-[#AAAAAA] hover:text-white transition-colors">
            <span className="material-symbols-outlined">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-auto py-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item, idx) => (
            <li key={item.to} className={`nav-item stagger-item ${collapsed ? 'collapsed' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }}>
              <NavLink 
                to={item.to}
                end={item.end}
                className={({ isActive }) => {
                  const base = `relative flex items-center py-3 transition-all duration-200 border-l-[3px] `;
                  const placement = collapsed ? 'justify-center px-0' : 'gap-3 px-6';
                  const state = isActive ? 'active text-white' : 'border-transparent text-[#AAAAAA] hover:text-white';
                  return base + placement + ' ' + state;
                }}
              >
                <div className="active-border" />
                <div className="hover-bg" />
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className={`font-body text-body font-medium transition-opacity ${collapsed ? 'hidden' : 'opacity-100'}`}>{item.label}</span>
                {collapsed && <div className="collapsed-tooltip">{item.label}</div>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-[rgba(255,255,255,0.05)] flex flex-col mt-2">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* left: avatar + name (name hidden when collapsed) */}
            {loading ? (
              <div className="w-[44px] h-[44px] rounded-full bg-[#333] animate-pulse shrink-0" />
            ) : (
              <>
                {(user && (user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture)) ? (
                  <img src={user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture} alt={user.name || user.email} className="w-[44px] h-[44px] rounded-full object-cover border-2 border-[#C9A84C] shrink-0" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.style.display='none';}} />
                ) : (
                  <div className="w-[44px] h-[44px] rounded-full bg-[#C9A84C] flex items-center justify-center text-[14px] font-bold text-white border-2 border-[#C9A84C] shrink-0">
                    {((user && (user.name || user.email)) ? (user.name ? user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : (user.email[0]||'P').toUpperCase()) : 'PR')}
                  </div>
                )}
                <div className={`flex flex-col ml-3 ${collapsed ? 'hidden' : ''}`}>
                  <div className="text-white text-[14px] font-bold truncate">{user?.name || user?.displayName || user?.email || 'Administrator'}</div>
                  <div className="text-[#AAAAAA] text-[12px] truncate">Administrator</div>
                </div>
              </>
            )}
          </div>

          <div>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full flex items-center justify-center text-[#C0392B] hover:bg-[rgba(192,57,43,0.06)] transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
