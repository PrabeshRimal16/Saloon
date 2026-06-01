import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

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
        path="*"
        element={<Navigate to={isLoggedIn ? defaultAuthedPath : "/login"} />}
      />
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