import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
      <div style={{ width: 32, height: 32, border: '4px solid #B8960C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  // Not logged in → go to admin login page
  if (!user) return <Navigate to="/admin-login" replace />;

  // Logged in but not admin → back to home
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
