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
    <div className="min-h-screen relative">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left - image + overlay (desktop) */}
        <div className="hidden md:block md:w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1520975915530-5e1f7a8e9d6a?auto=format&fit=crop&w=1600&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 h-full flex items-center justify-center p-12 text-center text-white">
            <div>
              <h2 className="font-serif text-4xl leading-tight font-semibold">Begin Your Journey.</h2>
              <p className="mt-4 text-lg text-white/90">Join our exclusive circle of beauty.</p>
            </div>
          </div>
        </div>

        {/* Right - form area */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          {/* Mobile blurred background behind the form */}
          <div
            className="absolute inset-0 md:hidden bg-cover bg-center filter blur-sm"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1520975915530-5e1f7a8e9d6a?auto=format&fit=crop&w=1200&q=60')`,
              zIndex: 0
            }}
          />
          <div className="absolute inset-0 md:hidden bg-white/60" />

          <div className="relative z-10 max-w-md w-full mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-2xl md:rounded-none md:shadow-none md:bg-white/100">
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl tracking-[0.3em] text-stone-800">The Salon at Reston</h1>
                <div className="h-[2px] bg-amber-400 w-12 mx-auto mt-4 mb-2" />
                <p className="text-gray-400 text-sm mt-2 mb-6">Create your luxury account.</p>
              </div>

              {error && (
                <div className="bg-[#FDEDED] text-error p-3 rounded-input font-body text-body mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="flex flex-col gap-6">
                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-amber-600 focus:outline-none py-2 text-sm text-stone-800"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-amber-600 focus:outline-none py-2 text-sm text-stone-800"
                    placeholder="you@domain.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="phone">Phone Number</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-sm text-stone-800 py-2 px-3 border-0 border-b border-gray-200">+977</div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-amber-600 focus:outline-none py-2 text-sm text-stone-800"
                      placeholder="Mobile number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-amber-600 focus:outline-none py-2 pr-10 text-sm text-stone-800"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[#777] hover:text-amber-600 transition-colors focus:outline-none"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
                        <div className={`${strength.color} h-full transition-all duration-300`} style={{ width: strength.width }} />
                      </div>
                      <span className="font-body text-[10px] text-gray-500 uppercase font-bold w-12 text-right">{strength.label}</span>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 font-semibold uppercase rounded-none">
                  {loading ? "Registering…" : "Create Account"}
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-[1px] bg-gray-200"></div>
                  <span className="text-[12px] text-gray-400 uppercase tracking-[0.5em]">or</span>
                  <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>

                <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-2 border border-gray-200 text-sm text-stone-800">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  <span>Continue with Google</span>
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <button onClick={() => navigate('/login')} className="text-amber-700 font-semibold hover:underline ml-1">
                    Login
                  </button>
                </div>

                <div className="text-center mt-8">
                  <div className="text-[10px] tracking-[0.4em] text-gray-300 uppercase">© 2025 The Salon at Reston</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
