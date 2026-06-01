import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      // Step 1: Open Google popup
      const googleUser = await getGoogleUser();
      if (!googleUser) return;

      // Step 2: Register with Google info + form data
      await axios.post("http://localhost:5000/api/users/register", {
        name: form.name,
        email: googleUser.email,
        google_id: googleUser.id,
        avatar_url: googleUser.picture,
        password: form.password,
        phone: form.phone,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const getGoogleUser = () => {
    return new Promise((resolve) => {
      const popup = window.open(
        "http://localhost:5000/auth/google",
        "googleLogin",
        "width=500,height=600"
      );

      const timer = setInterval(async () => {
        try {
          const res = await axios.get("http://localhost:5000/auth/me", {
            withCredentials: true,
          });
          if (res.data) {
            clearInterval(timer);
            popup.close();
            resolve(res.data);
          }
        } catch {
          // keep waiting
        }
      }, 1000);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.label}>Name</td>
              <td><input style={styles.input} name="name" placeholder="Enter name" onChange={handleChange} /></td>
            </tr>
            <tr>
              <td style={styles.label}>Password</td>
              <td><input style={styles.input} name="password" type="password" placeholder="Enter password" onChange={handleChange} /></td>
            </tr>
            <tr>
              <td style={styles.label}>Phone</td>
              <td><input style={styles.input} name="phone" placeholder="Enter phone" onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button style={styles.button} onClick={handleRegister}>
                  Register with Google
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={styles.link}>
                Already have an account?{" "}
                <span style={styles.span} onClick={() => navigate("/login")}>Login</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" },
  card: { backgroundColor: "#fff", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "350px" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  table: { width: "100%", borderCollapse: "collapse" },
  label: { padding: "10px", fontWeight: "bold", color: "#555", width: "35%" },
  input: { width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" },
  button: { width: "100%", padding: "10px", marginTop: "10px", backgroundColor: "#4285F4", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
  error: { color: "red", textAlign: "center" },
  link: { textAlign: "center", paddingTop: "10px", color: "#555" },
  span: { color: "#4285F4", cursor: "pointer" },
};

export default Register;