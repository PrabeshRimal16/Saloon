import { useAuth } from "../../context/AuthContext";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={logout} style={buttonStyle}>Logout</button>
      </div>
      <p>Browse our services and book an appointment.</p>
    </div>
  );
};

const buttonStyle = {
  padding: "8px 12px",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

export default CustomerDashboard;