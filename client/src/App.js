import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './styles/animations.css';
import './styles/admin-animations.css';
import './styles/responsive.css';
import initScrollAnimations from './utils/scrollAnimations';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from './components/Toast';
import CustomerFooter from './components/CustomerFooter';
import ProtectedRoute from './components/ProtectedRoute';
import Skeleton from './components/Skeleton';

const Login        = lazy(() => import("./pages/Login"));
const AdminLayout  = lazy(() => import('./components/AdminLayout'));
const CustomerLayout = lazy(() => import('./components/CustomerLayout'));

// Customer pages (all public)
const CustomerDashboard   = lazy(() => import("./pages/customer/CustomerDashboard"));
const CustomerServices    = lazy(() => import("./pages/customer/CustomerServices"));
const CustomerOffers      = lazy(() => import("./pages/customer/CustomerOffers"));
const CustomerAppointment = lazy(() => import("./pages/customer/CustomerAppointment"));
const CustomerContactus   = lazy(() => import("./pages/customer/CustomerContactus"));
const NotFound            = lazy(() => import('./pages/NotFound'));

// Admin pages (all protected)
const AdminDashboard           = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminServicesManagement  = lazy(() => import("./pages/admin/AdminServicesManagement"));
const AdminAppointmentManagement = lazy(() => import("./pages/admin/AdminAppointmentManagement"));
const AdminOfferManagement     = lazy(() => import("./pages/admin/AdminOfferManagement"));
const AdminUserManagement      = lazy(() => import("./pages/admin/AdminUserManagement"));
const AdminSetting             = lazy(() => import("./pages/admin/AdminSetting"));

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Re-run scroll animations on every navigation
  React.useEffect(() => {
    initScrollAnimations();
  }, [location.pathname]);

  const isAdmin = user?.role === "admin";

  // Admin auth is ready when loading is finished
  const authReady = !loading;

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="route-wrapper">
      <div className="page-fade">
        <Suspense fallback={<Skeleton />}>
          <Routes>

            {/* ── PUBLIC CUSTOMER ROUTES (no login required) ──────────── */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index           element={<CustomerDashboard />} />
              <Route path="services"     element={<CustomerServices />} />
              <Route path="offers"       element={<CustomerOffers />} />
              <Route path="appointments" element={<CustomerAppointment />} />
              <Route path="contact"      element={<CustomerContactus />} />
            </Route>

            {/* ── ADMIN LOGIN ──────────────────────────────────────────── */}
            {/* /admin-login: show login form; redirect away if already admin */}
            <Route
              path="/admin-login"
              element={
                authReady
                  ? (isAdmin ? <Navigate to="/admin" replace /> : <Login adminOnly />)
                  : <div />
              }
            />

            {/* Legacy /login path — redirect to /admin-login so old links still work */}
            <Route path="/login" element={<Navigate to="/admin-login" replace />} />

            {/* ── PROTECTED ADMIN ROUTES ───────────────────────────────── */}
            <Route
              path="/admin"
              element={
                authReady
                  ? (isAdmin
                      ? <ProtectedRoute><AdminLayout /></ProtectedRoute>
                      : <Navigate to="/admin-login" replace />)
                  : <div />
              }
            >
              <Route index                 element={<AdminDashboard />} />
              <Route path="services"       element={<AdminServicesManagement />} />
              <Route path="appointments"   element={<AdminAppointmentManagement />} />
              <Route path="offers"         element={<AdminOfferManagement />} />
              <Route path="users"          element={<AdminUserManagement />} />
              <Route path="settings"       element={<AdminSetting />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </div>

      {/* Footer: show on all non-admin pages */}
      {!isAdminPath && <CustomerFooter />}

      {/* Full-screen loading overlay only while admin auth is resolving */}
      {loading && isAdminPath && (
        <div className="loading-overlay" aria-hidden>
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;