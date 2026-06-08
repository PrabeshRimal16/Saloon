import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const nameParam = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const avatar_url = searchParams.get("avatar_url") || "";
  const google_id = searchParams.get("google_id") || "";

  const [form, setForm] = useState({ name: nameParam, password: "", confirmPassword: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || '';

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const getPasswordStrength = (pw) => {
    if (!pw) return { label: "", color: "transparent", width: '0%' };
    if (pw.length < 6) return { label: "WEAK", color: '#ef4444', width: '33%' };
    if (pw.length < 10) return { label: "MEDIUM", color: '#d97706', width: '66%' };
    return { label: "STRONG", color: '#16a34a', width: '100%' };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");

    // Basic client-side validation (do not alter backend logic)
    if (!form.name || !form.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!form.phone || !form.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/users/complete-profile`, {
        name: form.name,
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
    <div className="min-h-screen relative">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600"
            alt="Salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12">
            <h2 className="text-white text-4xl font-serif mb-3">Almost There.</h2>
            <p className="text-white/70 text-lg">Complete your profile to get started.</p>
          </div>
        </div>

        {/* Right form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif tracking-[0.3em] text-stone-800 uppercase">The Salon at Reston</h1>
              <div className="w-12 h-px bg-amber-500 mx-auto mt-3 mb-4" />
              <h2 className="text-xl font-serif text-gray-700">Complete Your Profile</h2>
              <p className="text-gray-400 text-sm mt-1">{form.name} — {email}</p>
            </div>

            {error && <div className="bg-[#FDEDED] text-error p-3 rounded mb-4 text-center">{error}</div>}

            <div className="relative w-20 h-20 mx-auto mb-6">
              {avatar_url && !avatarError ? (
                  <img
                    src={avatar_url}
                    alt={form.name || 'Profile avatar'}
                    loading="lazy"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-100"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.png'; }}
                  />
              ) : (
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-serif text-amber-700">
                  {(form.name || nameParam)?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
            </div>

            <form onSubmit={handleSubmit} aria-labelledby="complete-heading" className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Full Name <span className="text-amber-500">*</span></label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:border-amber-600 outline-none py-3 text-gray-800"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Phone Number <span className="text-amber-500">*</span></label>
                <div className="flex items-end border-b-2 border-gray-200 focus-within:border-amber-600 transition-colors">
                  <span className="text-gray-500 text-sm pb-3 pr-3 font-medium">+977</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="flex-1 border-0 outline-none py-3 text-gray-800 bg-transparent placeholder:text-gray-300 text-sm"
                    placeholder="Mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Create Password <span className="text-amber-500">*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '6px' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 0', fontSize: '0.9375rem', background: 'transparent', color: '#111827' }}
                    placeholder="Create a password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px', marginLeft: '8px' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      strength.label === 'WEAK' ? 'w-1/3 bg-red-400' : strength.label === 'MEDIUM' ? 'w-2/3 bg-amber-400' : 'w-full bg-green-500'
                    }`} />
                  </div>
                  <p className={`text-xs mt-1 text-right font-medium tracking-widest ${
                    strength.label === 'WEAK' ? 'text-red-400' : strength.label === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'
                  }`}>{strength.label}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Confirm Password <span className="text-amber-500">*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '6px' }}>
                  <input
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 0', fontSize: '0.9375rem', background: 'transparent', color: '#111827' }}
                    placeholder="Repeat your password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px', marginLeft: '8px' }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.confirmPassword && (
                  <p className={`text-xs mt-1 text-right font-medium ${form.password === form.confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                    {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || form.password !== form.confirmPassword}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold tracking-widest uppercase text-sm py-4 rounded-none transition-all duration-300 shadow-lg shadow-amber-200"
              >
                {loading ? 'Saving…' : 'Complete Registration'}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-amber-700 font-semibold hover:underline ml-1">Login</button>
                <span className="mx-2 text-gray-300">|</span>
                <button onClick={() => navigate('/register')} className="text-amber-700 font-semibold hover:underline">Register</button>
              </div>

              <p className="text-center text-[10px] tracking-[0.4em] text-gray-300 uppercase mt-6">© 2026 The Salon at Reston</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
