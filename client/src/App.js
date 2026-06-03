import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './styles/animations.css';
import './styles/admin-animations.css';
import './styles/responsive.css';
import initScrollAnimations from './utils/scrollAnimations';
import { AuthProvider, useAuth } from "./context/AuthContext";
const Login = lazy(() => import("./pages/Login"));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const CustomerServices = lazy(() => import("./pages/customer/CustomerServices"));
const CustomerOffers = lazy(() => import("./pages/customer/CustomerOffers"));
const CustomerAppointment = lazy(() => import("./pages/customer/CustomerAppointment"));
const CustomerSetting = lazy(() => import("./pages/customer/CustomerSetting"));
const CustomerContactus = lazy(() => import("./pages/customer/CustomerContactus"));
const Register = lazy(() => import("./pages/Register"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
import CustomerNavbar from './components/CustomerNavbar';
import CustomerFooter from './components/CustomerFooter';
const NotFound = lazy(() => import('./pages/NotFound'));
import ProtectedRoute from './components/ProtectedRoute';
import Skeleton from './components/Skeleton';

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminServicesManagement = lazy(() => import("./pages/admin/AdminServicesManagement"));
const AdminAppointmentManagement = lazy(() => import("./pages/admin/AdminAppointmentManagement"));
const AdminOfferManagement = lazy(() => import("./pages/admin/AdminOfferManagement"));
const AdminUserManagement = lazy(() => import("./pages/admin/AdminUserManagement"));
const AdminSetting = lazy(() => import("./pages/admin/AdminSetting"));

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hideLayout = ['/login', '/register', '/complete-profile'].includes(location.pathname);

  // Initialize scroll animations once when routes are rendered
  // and re-run to pick up new elements after navigation
  React.useEffect(() => {
    initScrollAnimations();
  }, [location.pathname]);

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";
  const defaultAuthedPath = isAdmin ? "/admin" : "/customer";
  const authReady = !loading;

  return (
    <div className="route-wrapper">
      {/* Nav and footer are mounted outside the route switch so they don't unmount on navigation */}
      {!hideLayout && !location.pathname.startsWith('/admin') && <CustomerNavbar />}
      <div className="page-fade">
      <Suspense fallback={<Skeleton /> }>
      <Routes>
      <Route
        path="/login"
        element={authReady ? (!isLoggedIn ? <Login /> : <Navigate to={defaultAuthedPath} />) : <div />}
      />
      <Route path="/admin" element={authReady ? (isAdmin ? <ProtectedRoute><AdminLayout /></ProtectedRoute> : (isLoggedIn ? <Navigate to="/customer" /> : <Navigate to="/login" />)) : <div />}>
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServicesManagement />} />
        <Route path="appointments" element={<AdminAppointmentManagement />} />
        <Route path="offers" element={<AdminOfferManagement />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="settings" element={<AdminSetting />} />
      </Route>
      <Route
        path="/customer"
        element={authReady ? (isLoggedIn && !isAdmin ? <CustomerDashboard /> : (isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />)) : <div />}
      />
      <Route
        path="/services"
        element={<CustomerServices />}
      />
      <Route
        path="/offers"
        element={<CustomerOffers />}
      />
      <Route
        path="/appointments"
        element={<CustomerAppointment />}
      />
      <Route
        path="/contact"
        element={<CustomerContactus />}
      />
      <Route
        path="/settings"
        element={<CustomerSetting />}
      />
      <Route
        path="/"
        element={authReady ? (isLoggedIn && !isAdmin ? <CustomerDashboard /> : (isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />)) : <div />}
      />
      <Route path="*" element={<NotFound />} />
      <Route 
      path="/register" 
      element={<Register />} 
      />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
      </Suspense>
      </div>

      {!hideLayout && !location.pathname.startsWith('/admin') && <CustomerFooter />}

      {loading && (
        <div className="loading-overlay" aria-hidden>
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;