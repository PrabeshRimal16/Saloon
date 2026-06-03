import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminProvider } from '../context/AdminContext';

export default function AdminLayout() {
  useEffect(() => {
    const collapsed = localStorage.getItem('admin_sidebar_collapsed') === '1';
    document.documentElement.style.setProperty('--admin-left', collapsed ? '64px' : '220px');
    const onToggle = (e) => {
      try {
        document.documentElement.style.setProperty('--admin-left', e.detail ? '64px' : '220px');
      } catch (err) {}
    };
    window.addEventListener('adminSidebarToggle', onToggle);
    return () => window.removeEventListener('adminSidebarToggle', onToggle);
  }, []);
  return (
    <AdminProvider>
      <div>
        <AdminSidebar />
        <AdminHeader />
        <main className="admin-content pt-[80px]" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Outlet />
        </main>
      </div>
    </AdminProvider>
  );
}
