import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { refreshUser, loginWithGoogle, apiBaseUrl } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      await refreshUser();
      const role = res.data?.role || "customer";
      navigate(role === "admin" ? "/admin" : "/customer");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // Prefer auth hook if provided, fallback to direct URL
    if (typeof loginWithGoogle === "function") return loginWithGoogle();
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  return (
    <div style={pageStyles.wrap}>
      <form style={pageStyles.card} onSubmit={submit} aria-labelledby="login-heading">
        <h1 id="login-heading" style={pageStyles.brand}>L'Atelier</h1>
        <p style={pageStyles.tag}>The Modern Haute Beauty</p>

        {error && <div role="alert" style={pageStyles.error}>{error}</div>}

        <label style={pageStyles.label} htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={pageStyles.input}
          required
        />

        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={pageStyles.label} htmlFor="password">Password</label>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/complete-profile'); }} style={pageStyles.forgot}>Forgot?</a>
          </div>
          <div style={pageStyles.pwWrap}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...pageStyles.input, paddingRight: 44 }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              style={pageStyles.eyeButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ ...pageStyles.primary, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div style={pageStyles.sep} aria-hidden>
          <span style={pageStyles.sepText}>Or</span>
        </div>

        <button type="button" onClick={handleGoogle} style={pageStyles.google}>
          Continue with Google
        </button>

        <div style={pageStyles.footer}>
          New here? <button type="button" onClick={() => navigate('/register')} style={pageStyles.link}>Create an account</button>
        </div>
      </form>
    </div>
  );
}

const pageStyles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    background: '#fff',
    fontFamily: "Montserrat, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: '#fff',
    border: '1px solid rgba(207,196,197,0.3)',
    padding: '28px',
    borderRadius: 10,
    boxShadow: '0 20px 50px -12px rgba(0,0,0,0.05)'
  },
  brand: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    margin: 0,
    color: '#000'
  },
  tag: { fontSize: 12, letterSpacing: '.12em', color: '#4c4546', marginTop: 6, marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4c4546' },
  input: { width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid #e6e6e6', borderRadius: 6, boxSizing: 'border-box' },
  primary: { width: '100%', padding: '12px', marginTop: 18, background: '#000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
  google: { width: '100%', padding: '12px', marginTop: 8, background: '#fff', color: '#000', border: '1px solid #cfc4c5', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
  sep: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 },
  sepText: { color: '#cfc4c5', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' },
  pwWrap: { position: 'relative' },
  eyeButton: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#7e7576' },
  footer: { marginTop: 16, textAlign: 'center', color: '#4c4546' },
  link: { background: 'transparent', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer' },
  forgot: { fontSize: 13, color: '#735c00', textDecoration: 'none' },
  error: { background: '#fdecea', color: '#b04545', padding: '8px 10px', borderRadius: 6, marginBottom: 12 }
};