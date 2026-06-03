import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminProvider } from '../context/AdminContext';

export default function AdminLayout() {
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
