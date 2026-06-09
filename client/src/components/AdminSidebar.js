import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-animations.css';

function AdminSidebar() {
  const { logout, user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

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

  // Track screen size so collapsed state never hides text on mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showText = !collapsed || isMobile;

  const toggleCollapse = () => {
    setCollapsed((s) => {
      const next = !s;
      localStorage.setItem('admin_sidebar_collapsed', next ? '1' : '0');
      try { document.documentElement.style.setProperty('--admin-left', next ? '64px' : '220px'); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('adminSidebarToggle', { detail: next })); } catch (e) {}
      return next;
    });
  };

  const navItems = [
    { to: '/admin',              label: 'Overview',     icon: 'dashboard',      end: true },
    { to: '/admin/services',     label: 'Services',     icon: 'content_cut' },
    { to: '/admin/appointments', label: 'Appointments', icon: 'calendar_month' },
    { to: '/admin/offers',       label: 'Offers',       icon: 'local_offer' },
    { to: '/admin/users',        label: 'Users',        icon: 'group' },
    { to: '/admin/settings',     label: 'Settings',     icon: 'settings' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    try { logout && logout(); } catch (err) { /* ignore */ }
  };

  const avatarText = user
    ? user.name
      ? user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
      : (user.email?.[0] || 'A').toUpperCase()
    : 'A';
  const avatarSrc = user?.avatar_url || user?.photo || user?.avatar || user?.avatarUrl || user?.picture;

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        style={{ transition: 'width 0.28s ease, transform 0.28s ease' }}
        className={[
          'fixed top-0 left-0 h-screen bg-[#1A1A1A] flex flex-col z-50 admin-sidebar pt-4',
          'transform',
          mobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0',
          collapsed ? 'md:w-[64px]' : 'md:w-[220px]',
        ].join(' ')}
      >

        {/* ── MOBILE HEADER ── */}
        <div className="md:hidden flex items-center justify-between px-3 h-[64px] border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <span className="text-[#C9A84C] text-[13px] font-semibold uppercase tracking-widest">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#AAAAAA] hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* ── DESKTOP HEADER ── */}
        <div className="hidden md:flex items-center h-[64px] shrink-0 border-b border-[rgba(255,255,255,0.06)]">
          {/* Brand name — only when expanded */}
          {showText && (
            <div className="flex-1 pl-5 overflow-hidden">
              <span className="text-white text-[13px] font-semibold uppercase tracking-widest whitespace-nowrap">
                The Salon At Reston
              </span>
            </div>
          )}

          {/* Toggle button — always visible, centered when collapsed */}
          <button
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={[
              'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              'text-[#AAAAAA] hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)]',
              collapsed ? 'mx-auto' : 'mr-3',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* ── NAV LINKS ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col gap-2">
            {navItems.map((item, idx) => (
              <li key={item.to} className="nav-item stagger-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => {
                    let cls = 'relative flex items-center w-full px-[24px] py-[14px] gap-[14px] text-[15px] font-medium transition-all duration-200 group border-l-4 md:border-l-[3px]';
                    if (collapsed && !isMobile) cls += ' md:justify-center md:px-0 md:gap-0';
                    if (isActive) cls += ' bg-[#FEF9ED] text-[#C9A84C] border-[#C9A84C]';
                    else cls += ' text-[#AAAAAA] hover:text-white';
                    return cls;
                  }}
                >
                  <div className="active-border" />
                  <div className="hover-bg" />

                  {/* Icon — fixed size */}
                  <span className="material-symbols-outlined w-[20px] h-[20px] text-[20px] flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>

                  {/* Label — conditionally rendered */}
                  {showText && (
                    <span className="whitespace-nowrap truncate">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip on hover when collapsed (desktop only) */}
                  {collapsed && !isMobile && (
                    <div className="collapsed-tooltip">{item.label}</div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── USER PROFILE ── */}
        <div className="shrink-0 px-6 py-4 border-t border-[rgba(255,255,255,0.1)]">
          <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-[#333] animate-pulse shrink-0" />
            ) : (
              <>
                {/* Avatar */}
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.name || user?.email}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#C9A84C] shrink-0"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-[13px] font-bold text-white border-2 border-[#C9A84C] shrink-0">
                    {avatarText}
                  </div>
                )}

                {/* Name + role — only when expanded */}
                {showText && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-[13px] font-bold truncate leading-tight">
                      {user?.name || user?.displayName || user?.email || 'Administrator'}
                    </span>
                    <span className="text-[#AAAAAA] text-[11px] leading-tight">Administrator</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── LOGOUT ── */}
        <div className="shrink-0 px-6 py-4">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className={[
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
              'text-[#C0392B] hover:bg-[rgba(192,57,43,0.06)] transition-colors',
              collapsed && !isMobile ? 'justify-center' : '',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">logout</span>
            {/* Logout text — only when expanded */}
            {showText && (
              <span className="text-[13px] font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default React.memo(AdminSidebar);
