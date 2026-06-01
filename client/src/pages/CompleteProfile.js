import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const avatar_url = searchParams.get("avatar_url") || "";
  const google_id = searchParams.get("google_id") || "";

  const [form, setForm] = useState({ password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/complete-profile", {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form style={styles.card} onSubmit={handleSubmit} aria-labelledby="complete-heading">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={styles.avatarBox}>
            {avatar_url ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <div style={styles.avatarPlaceholder}>{name?.charAt(0)?.toUpperCase() || "U"}</div>
            )}
          </div>
          <div>
            <h2 id="complete-heading" style={styles.title}>Complete Your Profile</h2>
            <p style={styles.subtitle}>{name} — <span style={{ color: '#6b6b6b' }}>{email}</span></p>
          </div>
        </div>

        {error && <div role="alert" style={styles.error}>{error}</div>}

        <label style={styles.label} htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} style={styles.input} required />

        <label style={{ ...styles.label, marginTop: 12 }} htmlFor="phone">Phone</label>
        <input id="phone" name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} style={styles.input} />

        <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.8 : 1 }}>{loading ? 'Saving…' : 'Complete Registration'}</button>
      </form>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f9f9f9', fontFamily: "Montserrat, system-ui, -apple-system, 'Segoe UI'" },
  card: { width: '100%', maxWidth: 520, background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 20px 50px -12px rgba(0,0,0,0.06)', border: '1px solid rgba(207,196,197,0.3)' },
  avatarBox: { width: 72, height: 72, borderRadius: 8, overflow: 'hidden', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarPlaceholder: { fontSize: 28, color: '#7e7576', fontWeight: 600 },
  title: { margin: 0, fontSize: 20 },
  subtitle: { margin: 0, color: '#6b6b6b', fontSize: 13 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4c4546', marginTop: 16 },
  input: { width: '100%', padding: '10px 12px', fontSize: 15, borderRadius: 6, border: '1px solid #e6e6e6', boxSizing: 'border-box', marginTop: 6 },
  button: { width: '100%', padding: '12px', marginTop: 18, background: '#000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 },
  error: { background: '#fdecea', color: '#b04545', padding: '8px 10px', borderRadius: 6, marginTop: 12 }
};
