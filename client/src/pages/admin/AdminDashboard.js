import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={logout} style={buttonStyle}>Logout</button>
      </div>
      <p>Welcome, {user?.name}</p>
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

export default AdminDashboard;