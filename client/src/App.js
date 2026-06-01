import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
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

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";
  const defaultAuthedPath = isAdmin ? "/admin" : "/customer";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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