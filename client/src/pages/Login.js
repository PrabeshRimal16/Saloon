import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email: form.email, password: form.password },
        { withCredentials: true }
      );

      const user = res.data;
      // Refresh client auth state (reads /auth/me) so other components update
      try {
        await refreshUser();
      } catch {}
      const dest = user?.role === "admin" ? "/admin" : "/customer";
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Saloon Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.label}>Email</td>
              <td>
                <input style={styles.input} name="email" value={form.email} onChange={handleChange} type="email" placeholder="Enter email" />
              </td>
            </tr>
            <tr>
              <td style={styles.label}>Password</td>
              <td>
                <input style={styles.input} name="password" value={form.password} onChange={handleChange} type="password" placeholder="Enter password" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button style={styles.button} onClick={handleLogin}>Login</button>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={styles.or}>── or ──</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button style={styles.googleButton} onClick={handleGoogleLogin}>
                  Login with Google
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ textAlign: "center", paddingTop: "10px", color: "#555" }}>
                Don't have an account? <span style={{ color: "#4285F4", cursor: "pointer" }} onClick={() => navigate("/register")}>Register</span>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "350px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  label: {
    padding: "10px",
    fontWeight: "bold",
    color: "#555",
    width: "35%",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  googleButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  or: {
    textAlign: "center",
    padding: "10px",
    color: "#aaa",
  },
};

export default Login;