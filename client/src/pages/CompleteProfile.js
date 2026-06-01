import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const CompleteProfile = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ password: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const google_id = searchParams.get("google_id");
  const email = searchParams.get("email");
  const avatar_url = searchParams.get("avatar_url");
  const name = searchParams.get("name");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      const res = await axios.post("http://localhost:5000/api/users/complete-profile", {
        name,
        email,
        google_id,
        avatar_url,
        password: form.password,
        phone: form.phone,
      }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Complete Profile</h2>
        <p style={styles.subtitle}>Welcome, {name}! ({email})</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.label}>Password</td>
                <td>
                  <input
                    style={styles.input}
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    value={form.password}
                  />
                </td>
              </tr>
              <tr>
                <td style={styles.label}>Phone</td>
                <td>
                  <input
                    style={styles.input}
                    name="phone"
                    placeholder="Enter phone"
                    onChange={handleChange}
                    value={form.phone}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <button style={styles.button} type="submit">Complete Registration</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" },
  card: { backgroundColor: "#fff", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "350px" },
  title: { textAlign: "center", marginBottom: "10px", color: "#333" },
  subtitle: { textAlign: "center", marginBottom: "20px", color: "#777", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse" },
  label: { padding: "10px", fontWeight: "bold", color: "#555", width: "35%" },
  input: { width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" },
  button: { width: "100%", padding: "10px", marginTop: "10px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
  error: { color: "red", textAlign: "center" },
};

export default CompleteProfile;
