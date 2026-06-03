import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './styles/animations.css';
import './styles/admin-animations.css';
import initScrollAnimations from './utils/scrollAnimations';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminLayout from './components/AdminLayout';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServicesManagement from "./pages/admin/AdminServicesManagement";
import AdminAppointmentManagement from "./pages/admin/AdminAppointmentManagement";
import AdminOfferManagement from "./pages/admin/AdminOfferManagement";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSetting from "./pages/admin/AdminSetting";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerServices from "./pages/customer/CustomerServices";
import CustomerOffers from "./pages/customer/CustomerOffers";
import CustomerAppointment from "./pages/customer/CustomerAppointment";
import CustomerSetting from "./pages/customer/CustomerSetting";
import CustomerContactus from "./pages/customer/CustomerContactus";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

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
      <div key={location.pathname} className="page-fade">
      <Routes>
      <Route
        path="/login"
        element={authReady ? (!isLoggedIn ? <Login /> : <Navigate to={defaultAuthedPath} />) : <div />}
      />
      <Route path="/admin" element={authReady ? (isAdmin ? <AdminLayout /> : (isLoggedIn ? <Navigate to="/customer" /> : <Navigate to="/login" />)) : <div />}>
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
      <Route
        path="*"
        element={authReady ? <Navigate to={isLoggedIn ? defaultAuthedPath : "/login"} /> : <div />}
      />
      <Route 
      path="/register" 
      element={<Register />} 
      />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
      </div>

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