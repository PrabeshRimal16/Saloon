import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { loginWithGoogle, apiBaseUrl } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!email || !email.includes("@")) throw new Error("Please enter a valid email");
      await axios.post(`${apiBaseUrl}/api/users/register`, { email }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Failed to create account");
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

        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="relative z-10 max-w-md w-full mx-auto">
            <div className="bg-white p-8 md:p-8 rounded-2xl shadow-2xl">
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl tracking-[0.3em] text-stone-800">The Salon at Reston</h1>
                <div className="h-[2px] bg-amber-400 w-12 mx-auto mt-4 mb-2" />
                <p className="text-gray-400 text-sm mt-2 mb-6">Create your account</p>
              </div>

              {error && (
                <div className="bg-[#FDEDED] text-error p-3 rounded mb-4 text-center">{error}</div>
              )}

              <form onSubmit={submit} className="flex flex-col gap-6">
                <div>
                  <label className="block font-body text-xs text-gray-500 uppercase tracking-[0.35em] mb-2" htmlFor="email">EMAIL</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-amber-600 focus:outline-none py-2 text-sm text-stone-800"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 font-semibold uppercase rounded-none">
                  {loading ? "Creating…" : "CREATE ACCOUNT"}
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
                  <button onClick={() => navigate('/login')} className="text-amber-700 font-semibold hover:underline ml-1">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
