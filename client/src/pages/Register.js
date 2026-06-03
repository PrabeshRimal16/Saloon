import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { refreshUser, loginWithGoogle, apiBaseUrl } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        phone_number: `+977${phone}`
      };
      
      const res = await axios.post(
        `${apiBaseUrl}/api/users/register`,
        payload,
        { withCredentials: true }
      );

      await refreshUser();
      const role = res.data?.role || "customer";
      navigate(role === "admin" ? "/admin" : "/customer");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    if (typeof loginWithGoogle === "function") return loginWithGoogle();
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  // Simple password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: "", color: "transparent" };
    if (password.length < 6) return { label: "Weak", color: "bg-error", width: "33%" };
    if (password.length < 10) return { label: "Medium", color: "bg-[#F39C12]", width: "66%" };
    return { label: "Strong", color: "bg-success", width: "100%" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-page py-10 animate-fade-in">
      <div className="w-full max-w-[400px] bg-white p-card rounded-card shadow-card">
        <div className="text-center mb-section-gap">
          <h1 className="font-heading text-h2 text-primary tracking-widest uppercase mb-2">L'Atelier</h1>
          <p className="font-body text-body text-grey">Create your luxury account.</p>
        </div>

        {error && (
          <div className="bg-[#FDEDED] text-error p-3 rounded-input font-body text-body mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-element-gap">
          <div>
            <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your full name"
              required
            />
          </div>

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
            <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1" htmlFor="phone">Phone Number</label>
            <div className="flex gap-2">
              <div className="bg-[#F5F5F5] border border-light-border rounded-input px-3 py-[10px] flex items-center justify-center font-body text-[14px] text-grey">
                +977
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field flex-1"
                placeholder="Mobile number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="Create a password"
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
            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                </div>
                <span className="font-body text-[10px] text-grey uppercase font-bold w-12 text-right">{strength.label}</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? "Registering…" : "Register"}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-light-border"></div>
            <span className="font-body text-[12px] text-grey uppercase tracking-[0.5px]">OR</span>
            <div className="flex-1 h-[1px] bg-light-border"></div>
          </div>

          <button type="button" onClick={handleGoogle} className="btn bg-primary text-white hover:bg-[#b5943b] shadow-[0_4px_16px_rgba(201,168,76,0.3)] w-full transition-all duration-200">
            <div className="bg-white rounded-full p-1 mr-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            </div>
            Register with Google
          </button>
        </form>

        <div className="mt-6 text-center font-body text-body text-grey">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-bold hover:text-light-gold transition-colors focus:outline-none">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
