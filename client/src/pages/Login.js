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
    if (typeof loginWithGoogle === "function") return loginWithGoogle();
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-page animate-fade-in">
      <div className="w-full max-w-[400px] bg-white p-card rounded-card shadow-card">
        <div className="text-center mb-section-gap">
          <h1 className="font-heading text-h2 text-primary tracking-widest uppercase mb-2">The Salon At Reston</h1>
          <p className="font-body text-body text-grey">Welcome back. Please sign in.</p>
        </div>

        {error && (
          <div className="bg-[#FDEDED] text-error p-3 rounded-input font-body text-body mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-element-gap">
          <div>
            <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-body text-label text-grey uppercase tracking-[0.5px]" htmlFor="password">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/complete-profile'); }} className="font-body text-[12px] text-primary hover:text-light-gold transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-primary transition-colors focus:outline-none"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-light-border"></div>
            <span className="font-body text-[12px] text-grey uppercase tracking-[0.5px]">OR</span>
            <div className="flex-1 h-[1px] bg-light-border"></div>
          </div>

          <button type="button" onClick={handleGoogle} className="btn btn-secondary w-full">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </form>

        <div className="mt-6 text-center font-body text-body text-grey">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-bold hover:text-light-gold transition-colors focus:outline-none">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}