import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './styles/animations.css';
import initScrollAnimations from './utils/scrollAnimations';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="route-wrapper" key={location.pathname}>
      <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to={defaultAuthedPath} />}
      />
      <Route
        path="/admin"
        element={
          isAdmin ? <AdminDashboard /> : <Navigate to={isLoggedIn ? "/customer" : "/login"} />
        }
      />
      <Route
        path="/admin/services"
        element={isAdmin ? <AdminServicesManagement /> : <Navigate to={isLoggedIn ? "/customer" : "/login"} />}
      />
      <Route
        path="/admin/appointments"
        element={isAdmin ? <AdminAppointmentManagement /> : <Navigate to={isLoggedIn ? "/customer" : "/login"} />}
      />
      <Route
        path="/admin/offers"
        element={isAdmin ? <AdminOfferManagement /> : <Navigate to={isLoggedIn ? "/customer" : "/login"} />}
      />
      <Route
        path="/admin/users"
        element={isAdmin ? <AdminUserManagement /> : <Navigate to={isLoggedIn ? "/customer" : "/login"} />}
      />
      <Route
        path="/admin/settings"
        element={isAdmin ? <AdminSetting /> : <Navigate to={isLoggedIn ? "/customer" : "/login"} />}
      />
      <Route
        path="/customer"
        element={
          isLoggedIn && !isAdmin
            ? <CustomerDashboard />
            : <Navigate to={isLoggedIn ? "/admin" : "/login"} />
        }
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
        element={
          isLoggedIn && !isAdmin
            ? <CustomerDashboard />
            : <Navigate to={isLoggedIn ? "/admin" : "/login"} />
        }
      />
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? defaultAuthedPath : "/login"} />}
      />
      <Route 
      path="/register" 
      element={<Register />} 
      />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
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