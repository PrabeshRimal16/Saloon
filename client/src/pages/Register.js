import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!form.name || !form.password || !form.phone) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const url = `http://localhost:5000/auth/google?action=register&name=${encodeURIComponent(
      form.name
    )}&password=${encodeURIComponent(form.password)}&phone=${encodeURIComponent(
      form.phone
    )}`;

    window.location.href = url;
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