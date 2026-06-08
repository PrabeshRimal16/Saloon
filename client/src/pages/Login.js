import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
// removed show/hide icon — no icons needed
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { refreshUser, loginWithGoogle, apiBaseUrl } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) setError(err);
  }, [searchParams]);

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
              <h2 className="font-serif text-4xl leading-tight font-semibold">Luxury. Style. Elegance.</h2>
              <p className="mt-4 text-lg text-white/90">Where beauty meets artistry.</p>
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
            <div className="bg-white md:bg-white p-8 md:p-8 md:shadow-none md:rounded-none rounded-2xl shadow-2xl">
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl tracking-[0.3em] text-stone-800">The Salon at Reston</h1>
                <div className="h-[2px] bg-amber-400 w-12 mx-auto mt-4 mb-2" />
                <p className="text-gray-400 text-sm mt-2 mb-6">Welcome back — sign in to manage your bookings.</p>
              </div>

              {error && (
                <div className="bg-[#FDEDED] text-error p-3 rounded-input font-body text-body mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="flex flex-col gap-6">
                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    style={{width:'100%', borderTop:'none', borderLeft:'none', borderRight:'none', borderBottom:'1px solid #e5e7eb', outline:'none', background:'transparent', padding:'8px 0', fontSize:'14px', color:'#1f2937', boxShadow:'none', display:'block'}}
                  />
                </div>

                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="text-right mt-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/complete-profile'); }} className="text-xs text-amber-600 hover:underline">Forgot?</a>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 font-semibold uppercase rounded-none">
                  {loading ? "Signing in…" : "Sign In"}
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
                  Don't have an account?{' '}
                  <button onClick={() => navigate('/register')} className="text-amber-700 font-semibold hover:underline ml-1">
                    Register
                  </button>
                </div>

                <div className="text-center mt-8">
                  <div className="text-[10px] tracking-[0.4em] text-gray-300 uppercase">© 2026 The Salon at Reston</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}