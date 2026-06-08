import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-animations.css';

function AdminSidebar() {
  const { logout, user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('admin_sidebar_collapsed') === '1';
    setCollapsed(v);
    try { document.documentElement.style.setProperty('--admin-left', v ? '64px' : '220px'); } catch (e) {}

    const onMobileToggle = (e) => {
      try { setMobileOpen(!!e.detail); } catch (err) { setMobileOpen(Boolean(e?.detail)); }
    };
    window.addEventListener('adminMobileToggle', onMobileToggle);

    return () => window.removeEventListener('adminMobileToggle', onMobileToggle);
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
    <>
      {/* Backdrop for mobile when sidebar is open */}
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#1A1A1A] flex flex-col z-50 transform transition-transform duration-300 admin-sidebar
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${collapsed ? 'md:w-[64px] w-[64px] is-collapsed' : 'md:w-[220px] w-[260px]'}`}
      >
        {/* Mobile close row */}
        <div className="md:hidden flex items-center justify-between px-3 pt-3 pb-3">
          <div className="pl-1">
            <h1 className="font-heading text-primary text-h5 uppercase tracking-widest text-white">Menu</h1>
          </div>
          <div>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Header / Toggle: centered when collapsed, title + button when expanded (desktop) */}
        {collapsed ? (
          <div className="pt-3 pb-3 hidden md:flex items-center justify-center">
            <button onClick={toggleCollapse} aria-label="Expand sidebar" className="w-10 h-10 rounded-full flex items-center justify-center text-[#C9A84C] hover:bg-[rgba(201,168,76,0.06)] transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        ) : (
          <div className="pt-4 pb-4 px-3 hidden md:flex items-center justify-between">
            <div className={`pl-2`}>
              <h1 className="font-heading text-primary text-h4 uppercase tracking-widest text-white">The Salon At Reston</h1>
            </div>
            <div className="pr-1">
              <button onClick={toggleCollapse} aria-label="Collapse sidebar" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#AAAAAA] hover:text-white">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-auto py-3">
          <ul className="flex flex-col gap-1 px-1 md:px-0">
            {navItems.map((item, idx) => (
              <li key={item.to} className={`nav-item stagger-item ${collapsed ? 'collapsed' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <NavLink 
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
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
                  <span className={`font-body text-body font-medium label-text ${collapsed ? 'label-hidden' : 'label-visible'}`}>{item.label}</span>
                  {collapsed && <div className="collapsed-tooltip">{item.label}</div>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-[rgba(255,255,255,0.05)] flex flex-col mt-2">
          <div className="flex items-center gap-3">
            {loading ? (
              <div className={`${collapsed ? 'w-[36px] h-[36px]' : 'w-[44px] h-[44px]'} rounded-full bg-[#333] animate-pulse shrink-0`} />
            ) : (
              <>
                {(user && (user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture)) ? (
                  <img src={user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture} alt={user.name || user.email} className={`${collapsed ? 'w-[36px] h-[36px]' : 'w-[44px] h-[44px]'} rounded-full object-cover border-2 border-[#C9A84C] shrink-0`} onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.style.display='none';}} />
                ) : (
                  <div className={`${collapsed ? 'w-[36px] h-[36px]' : 'w-[44px] h-[44px]'} rounded-full bg-[#C9A84C] flex items-center justify-center text-[14px] font-bold text-white border-2 border-[#C9A84C] shrink-0`}>
                    {((user && (user.name || user.email)) ? (user.name ? user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : (user.email[0]||'P').toUpperCase()) : 'PR')}
                  </div>
                )}

                <div className={`flex flex-col ml-3 user-details ${collapsed ? 'hidden' : ''}`}>
                  <div className="text-white text-[14px] font-bold truncate">{user?.name || user?.displayName || user?.email || 'Administrator'}</div>
                  <div className="text-[#AAAAAA] text-[12px] truncate">Administrator</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-3 pb-4 mt-auto">
          <div className="w-full flex justify-center">
            <button onClick={handleLogout} aria-label="Logout" className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[#C0392B] hover:bg-[rgba(192,57,43,0.06)] transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className={`text-[#C0392B] text-[14px] font-medium logout-text ${collapsed ? 'hidden' : ''}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default React.memo(AdminSidebar);
