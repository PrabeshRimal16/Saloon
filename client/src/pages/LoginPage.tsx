import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'login'
  );

  // If already logged in, redirect home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    setTab(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  const handleTabChange = (t: 'login' | 'register') => {
    setTab(t);
    navigate(`/${t}`);
    setStatus('idle');
    setMessage('');
  };

  // Shared state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [message, setMessage] = useState('');

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    agreed: false,
  });

  /* ─── Login Handler ─── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }
    setStatus('loading');
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage('Welcome back! Redirecting…');
      setTimeout(() => navigate('/'), 1200);
    }
  };

  /* ─── Register Handler ─── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, password, confirm, agreed } = registerForm;

    if (!name || !email || !password || !confirm) {
      setStatus('error');
      setMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setStatus('error');
      setMessage('You must agree to the Terms of Membership.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
      },
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    // Insert profile row
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        email,
        phone,
      });
    }

    setStatus('success');
    setMessage(
      data.session
        ? 'Account created! Redirecting…'
        : 'Account created! Please check your email to confirm, then log in.'
    );
    if (data.session) {
      setTimeout(() => navigate('/'), 1200);
    }
  };

  /* ─── Feedback Banner ─── */
  const FeedbackBanner = () => {
    if (status === 'idle' || status === 'loading') return null;
    const isError = status === 'error';
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
          style={{
            background: isError ? 'rgba(220,38,38,0.06)' : 'rgba(34,197,94,0.08)',
            border: `1px solid ${isError ? 'rgba(220,38,38,0.2)' : 'rgba(34,197,94,0.2)'}`,
            color: isError ? '#b91c1c' : '#15803d',
          }}
        >
          {isError
            ? <AlertCircle size={16} className="mt-0.5 shrink-0" />
            : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
          <span>{message}</span>
        </motion.div>
      </AnimatePresence>
    );
  };

  const isLoading = status === 'loading';

  return (
    <div
      className="min-h-screen flex items-center justify-center py-20 px-6"
      style={{ background: 'linear-gradient(135deg, var(--color-beige) 0%, var(--color-cream) 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl"
        style={{ minHeight: '600px' }}
      >
        {/* Left Image Panel */}
        <div
          className="relative hidden lg:flex flex-col justify-end p-12"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1470&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }} />
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(201,169,110,0.5) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <p className="text-xs tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: 'var(--color-gold)' }}>
              Est. 2024
            </p>
            <h2 className="text-4xl leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
              Refinement as a{' '}<br />
              <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Ritual.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Enter a sanctuary where traditional craft meets contemporary luxury. Your chair is waiting.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-10 md:p-12 flex flex-col justify-center" style={{ background: '#fff' }}>
          <div className="text-left mb-8">
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              Sovereign Grooming
            </p>
            <div className="divider-gold-left mt-3 mb-4" />
            <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
              {tab === 'login' ? 'Welcome Back' : 'Join the Atelier'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {tab === 'login'
                ? 'Step back into the sanctuary of intentional refinement.'
                : 'Create your account to curate your experience.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b" style={{ borderColor: 'rgba(201,169,110,0.15)' }}>
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className="flex-1 py-3 text-xs tracking-[0.15em] uppercase font-semibold bg-transparent border-0 cursor-pointer transition-colors relative"
                style={{ color: tab === t ? 'var(--color-brown)' : 'var(--color-muted-light)' }}
              >
                {t === 'login' ? 'Login' : 'Create Account'}
                {tab === t && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'var(--color-gold)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* ── Login Form ── */}
          {tab === 'login' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-5"
              onSubmit={handleLogin}
              id="login-form"
            >
              <FeedbackBanner />

              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  className="input-field"
                  type="email"
                  placeholder="you@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  autoComplete="email"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs tracking-[0.12em] uppercase" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                    Password
                  </label>
                  <a href="#" className="text-xs no-underline" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    className="input-field !pr-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    autoComplete="current-password"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
                    style={{ color: 'var(--color-muted)' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-gold flex items-center justify-center gap-2 mt-2"
                disabled={isLoading}
                id="login-submit"
              >
                {isLoading
                  ? <><Loader2 size={16} className="animate-spin" /> Signing In…</>
                  : <><LogIn size={16} /> Enter Sanctuary</>}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.15)' }} />
                <span className="text-xs tracking-wide uppercase" style={{ color: 'var(--color-muted-light)' }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.15)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="login-google"
                  className="py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer bg-white transition-all hover:bg-gray-50"
                  style={{ borderColor: 'rgba(201,169,110,0.2)', color: 'var(--color-brown)' }}
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  id="login-apple"
                  className="py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer bg-white transition-all hover:bg-gray-50"
                  style={{ borderColor: 'rgba(201,169,110,0.2)', color: 'var(--color-brown)' }}
                >
                  <svg width="14" height="16" viewBox="0 0 14 17" fill="currentColor">
                    <path d="M13.197 13.01c-.23.53-.502.996-.818 1.4-.43.547-.782.926-1.052 1.135-.42.345-.87.521-1.35.532-.346 0-.763-.098-1.248-.298-.487-.199-.934-.298-1.345-.298-.43 0-.89.099-1.38.298-.49.2-.886.304-1.19.315-.46.018-.92-.163-1.38-.543-.294-.23-.66-.626-1.1-1.188-.47-.6-.857-1.296-1.16-2.088C.31 11.383.143 10.514.143 9.67c0-.97.21-1.808.633-2.51a3.71 3.71 0 0 1 1.323-1.342 3.563 3.563 0 0 1 1.79-.507c.352 0 .813.109 1.385.323.57.215.937.323 1.097.323.12 0 .528-.127 1.218-.38.652-.236 1.203-.334 1.654-.297 1.222.098 2.14.578 2.748 1.44-1.094.663-1.634 1.59-1.623 2.78.01.927.346 1.699 1.006 2.31.3.284.634.504 1.005.66-.08.233-.165.457-.254.67zM9.97.533C9.97 1.26 9.707 1.94 9.184 2.57c-.626.73-1.383 1.152-2.204 1.086a2.22 2.22 0 0 1-.016-.27c0-.698.303-1.444.842-2.054.268-.308.61-.564 1.023-.769C9.24.36 9.633.247 10.003.233c.01.1.015.2.015.3h-.048z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </motion.form>
          )}

          {/* ── Register Form ── */}
          {tab === 'register' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
              onSubmit={handleRegister}
              id="register-form"
            >
              <FeedbackBanner />

              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                  Full Name <span style={{ color: 'var(--color-gold)' }}>*</span>
                </label>
                <input
                  id="register-name"
                  className="input-field"
                  placeholder="Your full name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  autoComplete="name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                  Email Address <span style={{ color: 'var(--color-gold)' }}>*</span>
                </label>
                <input
                  id="register-email"
                  className="input-field"
                  type="email"
                  placeholder="you@email.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  autoComplete="email"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                  Phone Number
                </label>
                <input
                  id="register-phone"
                  className="input-field"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  autoComplete="tel"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                    Password <span style={{ color: 'var(--color-gold)' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      className="input-field !pr-10"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
                      style={{ color: 'var(--color-muted)' }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                    Confirm <span style={{ color: 'var(--color-gold)' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirm"
                      className="input-field !pr-10"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerForm.confirm}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
                      style={{ color: 'var(--color-muted)' }}
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength hint */}
              {registerForm.password && (
                <div className="flex gap-1.5 items-center -mt-1">
                  {[1, 2, 3, 4].map((i) => {
                    const strength = Math.min(4, Math.floor(registerForm.password.length / 3));
                    return (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength
                            ? strength <= 1 ? '#ef4444'
                              : strength <= 2 ? '#f97316'
                                : strength <= 3 ? '#eab308'
                                  : '#22c55e'
                            : 'rgba(201,169,110,0.12)',
                        }}
                      />
                    );
                  })}
                  <span className="text-xs ml-1" style={{ color: 'var(--color-muted-light)' }}>
                    {registerForm.password.length < 4 ? 'Weak' : registerForm.password.length < 7 ? 'Fair' : registerForm.password.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}

              <label className="flex items-start gap-2 mt-1 cursor-pointer" id="register-terms-label">
                <input
                  id="register-terms"
                  type="checkbox"
                  className="mt-1 accent-[#C9A96E]"
                  checked={registerForm.agreed}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreed: e.target.checked })}
                />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  I agree to the <a href="#" style={{ color: 'var(--color-gold)' }}>Terms of Membership</a> and the <a href="#" style={{ color: 'var(--color-gold)' }}>Sanctuary Privacy Policy</a>.
                </span>
              </label>

              <button
                type="submit"
                className="btn-gold mt-2 flex items-center justify-center gap-2"
                disabled={isLoading}
                id="register-submit"
              >
                {isLoading
                  ? <><Loader2 size={16} className="animate-spin" /> Creating Account…</>
                  : <><UserPlus size={16} /> Create Account</>}
              </button>
            </motion.form>
          )}

          {/* Bottom Link */}
          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
            {tab === 'login' ? (
              <>New to the Atelier?{' '}
                <button onClick={() => handleTabChange('register')} className="bg-transparent border-0 cursor-pointer font-semibold" style={{ color: 'var(--color-gold)' }}>
                  Request Access
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => handleTabChange('login')} className="bg-transparent border-0 cursor-pointer font-semibold" style={{ color: 'var(--color-gold)' }}>
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
