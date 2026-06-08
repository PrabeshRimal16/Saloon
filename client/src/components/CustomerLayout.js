import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar';

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#F8F7F5]">
      <CustomerNavbar />
      <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default React.memo(CustomerLayout);