import { useAuth } from "../../context/AuthContext";

const CustomerDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Browse our services and book an appointment.</p>
    </div>
  );
};

export default CustomerDashboard;