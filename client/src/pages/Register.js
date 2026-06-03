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
      // Minimal payload: only email. Backend may require more fields.
      await axios.post(`${apiBaseUrl}/api/users/register`, { email }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    if (typeof loginWithGoogle === "function") return loginWithGoogle();
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl tracking-[0.3em] text-stone-800">The Salon at Reston</h1>
          <div className="h-[2px] bg-amber-400 w-12 mx-auto mt-4 mb-2" />
          <p className="text-gray-400 text-sm mt-2">Create your account</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="bg-[#FDEDED] text-error p-3 rounded mb-4 text-center">{error}</div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-[0.35em] mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-amber-600 focus:outline-none py-2 text-sm text-stone-800"
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
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-amber-700 font-semibold hover:underline ml-1">Login</button>
        </div>
      </div>
    </div>
  );
}
