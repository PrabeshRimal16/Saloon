import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-animations.css';

function CustomerSidebar() {
  const { logout, user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore saved state on mount
  useEffect(() => {
    const v = localStorage.getItem('customer_sidebar_collapsed') === '1';
    setCollapsed(v);
    try {
      document.documentElement.style.setProperty('--customer-left', v ? '64px' : '220px');
    } catch (e) {}

    // Listen for mobile toggle from navbar hamburger
    const onMobileToggle = (e) => {
      setMobileOpen(prev => {
        // if event has explicit detail, use it; otherwise toggle
        return typeof e.detail === 'boolean' ? e.detail : !prev;
      });
    };
    window.addEventListener('customerMobileToggle', onMobileToggle);
    return () => window.removeEventListener('customerMobileToggle', onMobileToggle);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('customer_sidebar_collapsed', next ? '1' : '0');
      try {
        document.documentElement.style.setProperty('--customer-left', next ? '64px' : '220px');
      } catch (e) {}
      try {
        window.dispatchEvent(new CustomEvent('customerSidebarToggle', { detail: next }));
      } catch (e) {}
      return next;
    });
  };

  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { to: '/',             label: 'Home',         icon: 'home',           end: true },
    { to: '/services',     label: 'Services',     icon: 'content_cut' },
    { to: '/appointments', label: 'Appointments', icon: 'calendar_month' },
    { to: '/offers',       label: 'Offers',       icon: 'local_offer' },
    { to: '/contact',      label: 'Contact',      icon: 'support_agent' },
    { to: '/settings',     label: 'Settings',     icon: 'settings' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    try { logout && logout(); } catch (err) {}
  };

  const avatarText = user
    ? user.name
      ? user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
      : (user.email?.[0] || 'U').toUpperCase()
    : 'U';

  const avatarSrc = user?.avatar_url || user?.photo || user?.avatar || user?.avatarUrl || user?.picture;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        style={{ transition: 'width 0.28s ease, transform 0.28s ease' }}
        className={[
          'fixed top-0 left-0 h-screen bg-[#1A1A1A] flex flex-col z-50',
          // mobile: slide in/out
          'transform',
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0',
          // desktop width
          collapsed ? 'md:w-[64px]' : 'md:w-[220px]',
        ].join(' ')}
      >

        {/* ── MOBILE HEADER (close button) ── */}
        <div className="md:hidden flex items-center justify-between px-4 h-[64px] border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <span className="text-[#C9A84C] text-[13px] font-semibold uppercase tracking-widest">Menu</span>
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#AAAAAA] hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* ── DESKTOP HEADER ── */}
        <div className="hidden md:flex items-center h-[64px] shrink-0 border-b border-[rgba(255,255,255,0.06)] relative">
          {/* Brand name — hidden when collapsed */}
          {!collapsed && (
            <div className="flex-1 pl-5 overflow-hidden">
              <span className="text-white text-[13px] font-semibold uppercase tracking-widest whitespace-nowrap">
                The Salon
              </span>
            </div>
          )}

          {/* Collapse / Expand toggle button — always visible on desktop */}
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
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          <ul className="flex flex-col gap-[2px]">
            {navItems.map((item, idx) => (
              <li
                key={item.to}
                className={`nav-item stagger-item ${collapsed ? 'collapsed' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={closeMobile}
                  className={({ isActive }) => {
                    const base = 'relative flex items-center py-[11px] transition-all duration-200 border-l-[3px] ';
                    const placement = collapsed ? 'justify-center px-0 w-full' : 'gap-3 px-5';
                    const state = isActive
                      ? 'active border-[#C9A84C] text-white'
                      : 'border-transparent text-[#AAAAAA] hover:text-white';
                    return base + placement + ' ' + state;
                  }}
                >
                  {/* Gold left border indicator */}
                  <div className="active-border" />
                  {/* Hover bg sweep */}
                  <div className="hover-bg" />
                  <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                  {/* Label — hidden when collapsed on desktop */}
                  <span
                    className="text-[14px] font-medium whitespace-nowrap overflow-hidden transition-all duration-200"
                    style={{
                      maxWidth: collapsed ? '0px' : '160px',
                      opacity: collapsed ? 0 : 1,
                    }}
                  >
                    {item.label}
                  </span>
                  {/* Tooltip on hover when collapsed */}
                  {collapsed && (
                    <div className="collapsed-tooltip">{item.label}</div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── USER PROFILE ── */}
        <div className="shrink-0 p-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            {loading ? (
              <div className={`${collapsed ? 'w-9 h-9' : 'w-10 h-10'} rounded-full bg-[#333] animate-pulse shrink-0`} />
            ) : (
              <>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.name || user?.email}
                    className={`${collapsed ? 'w-9 h-9' : 'w-10 h-10'} rounded-full object-cover border-2 border-[#C9A84C] shrink-0`}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className={`${collapsed ? 'w-9 h-9' : 'w-10 h-10'} rounded-full bg-[#C9A84C] flex items-center justify-center text-[13px] font-bold text-white border-2 border-[#C9A84C] shrink-0`}>
                    {avatarText}
                  </div>
                )}
                {!collapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-[13px] font-bold truncate">
                      {user?.name || user?.displayName || user?.email || 'Customer'}
                    </span>
                    <span className="text-[#AAAAAA] text-[11px]">Customer</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── LOGOUT ── */}
        <div className="shrink-0 px-3 pb-4">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#C0392B] hover:bg-[rgba(192,57,43,0.08)] transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">logout</span>
            {!collapsed && (
              <span className="text-[13px] font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default React.memo(CustomerSidebar);
