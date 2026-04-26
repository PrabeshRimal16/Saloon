import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Login/Register auth page
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState<'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'login'
  );

  useEffect(() => {
    setTab(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  const handleTabChange = (t: 'login' | 'register') => {
    setTab(t);
    navigate(`/${t}`);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });

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
          className="relative hidden lg:flex flex-col justify-end p-10"
          style={{
            background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(201,169,110,0.3) 0%, transparent 50%)' }}
          />
          <div className="relative z-10">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
              Est. 2024
            </p>
            <h2 className="text-3xl leading-tight mb-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
              Refinement as a{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Ritual.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Enter a sanctuary where traditional craft meets contemporary luxury. Your chair is waiting.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-10 md:p-12 flex flex-col justify-center" style={{ background: '#fff' }}>
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              Sovereign Grooming
            </p>
            <div className="divider-gold mt-3 mb-4" />
            <h1 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
              {tab === 'login' ? 'Welcome Back' : 'Join the Atelier'}
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--color-muted)' }}>
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

          {/* Login Form */}
          {tab === 'login' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
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
                    className="input-field !pr-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="btn-gold flex items-center justify-center gap-2 mt-2">
                <LogIn size={16} /> Enter Sanctuary
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.15)' }} />
                <span className="text-xs tracking-wide uppercase" style={{ color: 'var(--color-muted-light)' }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.15)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer bg-white transition-all hover:bg-gray-50" style={{ borderColor: 'rgba(201,169,110,0.2)', color: 'var(--color-brown)' }}>
                  Google
                </button>
                <button className="py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer bg-white transition-all hover:bg-gray-50" style={{ borderColor: 'rgba(201,169,110,0.2)', color: 'var(--color-brown)' }}>
                  Apple
                </button>
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Full Name</label>
                <input className="input-field" placeholder="Your full name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Email Address</label>
                <input className="input-field" type="email" placeholder="you@email.com" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Phone Number</label>
                <input className="input-field" type="tel" placeholder="+1 (555) 000-0000" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Confirm</label>
                  <input className="input-field" type="password" placeholder="••••••••" value={registerForm.confirm} onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })} />
                </div>
              </div>
              <label className="flex items-start gap-2 mt-1 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#C9A96E]" />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  I agree to the <a href="#" style={{ color: 'var(--color-gold)' }}>Terms of Membership</a> and the <a href="#" style={{ color: 'var(--color-gold)' }}>Sanctuary Privacy Policy</a>.
                </span>
              </label>
              <button className="btn-gold mt-2">Create Account</button>
            </motion.div>
          )}

          {/* Bottom Link */}
          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
            {tab === 'login' ? (
              <>New to the Atelier? <button onClick={() => handleTabChange('register')} className="bg-transparent border-0 cursor-pointer font-semibold" style={{ color: 'var(--color-gold)' }}>Request Access</button></>
            ) : (
              <>Already have an account? <button onClick={() => handleTabChange('login')} className="bg-transparent border-0 cursor-pointer font-semibold" style={{ color: 'var(--color-gold)' }}>Login</button></>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
