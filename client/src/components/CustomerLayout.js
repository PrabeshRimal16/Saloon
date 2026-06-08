import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar';
import CustomerSidebar from './CustomerSidebar';

function CustomerLayout() {
  useEffect(() => {
    const collapsed = localStorage.getItem('customer_sidebar_collapsed') === '1';
    try { document.documentElement.style.setProperty('--customer-left', collapsed ? '64px' : '220px'); } catch (err) {}
    const onToggle = (e) => {
      try {
        document.documentElement.style.setProperty('--customer-left', e.detail ? '64px' : '220px');
      } catch (err) {}
    };
    window.addEventListener('customerSidebarToggle', onToggle);
    return () => window.removeEventListener('customerSidebarToggle', onToggle);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F5]">
      <CustomerSidebar />
      <CustomerNavbar />
      <main className="admin-content pt-[72px] ml-0 md:ml-[var(--customer-left,220px)] transition-all duration-300" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default React.memo(CustomerLayout);