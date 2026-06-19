import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Phone } from 'lucide-react';

function CustomerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Track screen size so collapsed state never hides text on mobile
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // On mobile: always show text (ignore collapsed). On desktop: respect collapsed.
  const showText = !collapsed || isMobile;

  // Restore saved collapse state on mount
  useEffect(() => {
    const v = localStorage.getItem('customer_sidebar_collapsed') === '1';
    setCollapsed(v);
    try {
      document.documentElement.style.setProperty('--customer-left', v ? '64px' : '220px');
    } catch (e) {}

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
    { to: '/contact',      label: 'Contact',      icon: 'phone' },
  ];

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
          'fixed top-0 left-0 h-screen flex flex-col z-50',
          'bg-white border-r border-[#E8E0D5]',
          'shadow-[2px_0_16px_rgba(0,0,0,0.06)]',
          'transform',
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0',
          collapsed ? 'md:w-[64px]' : 'md:w-[220px]',
        ].join(' ')}
      >

        {/* ── BRAND HEADER ── */}
        <div
          className={[
            'shrink-0 flex items-center h-[64px]',
            'border-b border-[#E8E0D5]',
            !showText ? 'justify-center px-0' : 'justify-between px-4',
          ].join(' ')}
        >
          {showText && (
            <span
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}
              className="text-[#B8960C] text-[18px] font-semibold whitespace-nowrap overflow-hidden"
            >
              The Salon at Reston
            </span>
          )}

          {/* Desktop collapse / expand toggle */}
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
                    !showText ? 'md:justify-center md:px-0 md:pl-0' : '',
                  ].join(' ')}
                >
                  {item.to === '/contact' ? (
                    <Phone size={20} style={{ color: 'inherit' }} className="shrink-0" />
                  ) : (
                    <span
                      className="material-symbols-outlined text-[20px] shrink-0 transition-colors duration-200"
                      style={{ color: 'inherit' }}
                    >
                      {item.icon}
                    </span>
                  )}

                  {showText && (
                    <span className="text-[14px] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip when collapsed on desktop */}
                  {collapsed && !isMobile && (
                    <div
                      className="absolute left-[56px] top-1/2 -translate-y-1/2
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

        {/* ── SALON INFO (replaces user profile) ── */}
        <div className="shrink-0 px-4 py-4 border-t border-[#E8E0D5]">
          {showText ? (
            <div className="text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                 className="text-[#B8960C] text-[13px] font-semibold mb-1">
                The Salon at Reston
              </p>
              <p className="text-[#AAAAAA] text-[11px]">Luxury beauty services</p>
              <a
                href="tel:+1234567890"
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#6B6B6B] hover:text-[#B8960C] transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                Book by phone
              </a>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="material-symbols-outlined text-[20px] text-[#B8960C]">storefront</span>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}

export default React.memo(CustomerSidebar);
