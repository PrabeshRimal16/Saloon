import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CustomerSidebar() {
  const { logout, user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore saved collapse state on mount
  useEffect(() => {
    const v = localStorage.getItem('customer_sidebar_collapsed') === '1';
    setCollapsed(v);
    try {
      document.documentElement.style.setProperty('--customer-left', v ? '64px' : '220px');
    } catch (e) {}

    // Listen for mobile toggle from hamburger (if any external trigger needed)
    const onMobileToggle = (e) => {
      setMobileOpen(typeof e.detail === 'boolean' ? e.detail : prev => !prev);
    };
    window.addEventListener('customerMobileToggle', onMobileToggle);
    return () => window.removeEventListener('customerMobileToggle', onMobileToggle);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('customer_sidebar_collapsed', next ? '1' : '0');
      try { document.documentElement.style.setProperty('--customer-left', next ? '64px' : '220px'); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('customerSidebarToggle', { detail: next })); } catch (e) {}
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
      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        style={{ transition: 'width 0.28s ease, transform 0.28s ease' }}
        className={[
          // base
          'fixed top-0 left-0 h-screen flex flex-col z-50',
          'bg-white border-r border-[#E8E0D5]',
          'shadow-[2px_0_16px_rgba(0,0,0,0.06)]',
          // mobile: slide off-screen by default, slide in when open
          'transform',
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0',
          // desktop width
          collapsed ? 'md:w-[64px]' : 'md:w-[220px]',
        ].join(' ')}
      >

        {/* ── BRAND HEADER ── */}
        <div
          className={[
            'shrink-0 flex items-center h-[64px]',
            'border-b border-[#E8E0D5]',
            collapsed ? 'justify-center px-0' : 'justify-between px-4',
          ].join(' ')}
        >
          {/* Brand logo — hidden when collapsed */}
          {!collapsed && (
            <span
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}
              className="text-[#B8960C] text-[18px] font-semibold whitespace-nowrap overflow-hidden"
            >
              The Salon at Reston
            </span>
          )}

          {/* Desktop collapse / expand toggle — always visible */}
          <button
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={[
              'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              'text-[#B8960C] hover:bg-[#FEF9ED] transition-colors',
              'hidden md:flex',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>

          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#6B6B6B] hover:bg-[#F8F7F5] transition-colors md:hidden ml-auto"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ── NAV LINKS ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <ul className="flex flex-col gap-[2px] px-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={closeMobile}
                  className={({ isActive }) => [
                    'relative flex items-center gap-3 px-3 py-[10px] rounded-lg',
                    'transition-all duration-200 group',
                    isActive
                      ? 'bg-[#FEF9ED] text-[#B8960C] border-l-[3px] border-[#B8960C] pl-[9px]'
                      : 'text-[#4A4A4A] border-l-[3px] border-transparent hover:bg-[#FEF9ED] hover:text-[#B8960C]',
                    collapsed ? 'md:justify-center md:px-0 md:pl-0' : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'material-symbols-outlined text-[20px] shrink-0',
                      'transition-colors duration-200',
                    ].join(' ')}
                    style={{ color: 'inherit' }}
                  >
                    {item.icon}
                  </span>

                  {/* Label fades out when collapsed */}
                  <span
                    className="text-[14px] font-medium whitespace-nowrap overflow-hidden transition-all duration-200"
                    style={{
                      maxWidth: collapsed ? '0px' : '160px',
                      opacity: collapsed ? 0 : 1,
                      display: 'block',
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Tooltip when collapsed (desktop only) */}
                  {collapsed && (
                    <div
                      className="hidden md:block absolute left-[56px] top-1/2 -translate-y-1/2
                        bg-[#1A1A1A] text-white text-[12px] font-semibold px-3 py-1.5
                        rounded-lg whitespace-nowrap pointer-events-none
                        opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                        transition-all duration-150 shadow-lg z-50"
                    >
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── USER PROFILE ── */}
        <div className="shrink-0 px-3 py-3 border-t border-[#E8E0D5]">
          <div className={`flex items-center gap-3 ${collapsed ? 'md:justify-center' : ''}`}>
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-[#F0EBE0] animate-pulse shrink-0" />
            ) : (
              <>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.name || user?.email}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#B8960C] shrink-0"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#FEF9ED] border-2 border-[#B8960C] flex items-center justify-center text-[13px] font-bold text-[#B8960C] shrink-0">
                    {avatarText}
                  </div>
                )}
                {!collapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[#1A1A1A] text-[13px] font-bold truncate leading-tight">
                      {user?.name || user?.displayName || user?.email || 'Customer'}
                    </span>
                    <span className="text-[#6B6B6B] text-[11px] leading-tight">Customer</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── LOGOUT ── */}
        <div className="shrink-0 px-3 pb-4 pt-1">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className={[
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
              'text-[#C0392B] hover:bg-red-50 transition-colors',
              collapsed ? 'md:justify-center' : '',
            ].join(' ')}
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
