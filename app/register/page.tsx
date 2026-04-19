'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Toast, Spinner } from '@/components/AuthGuard';

/**
 * Register page — creates a Supabase Auth user + inserts a profile
 * row into the public.users table via a database trigger.
 */
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!fullName.trim())        e.fullName = 'Full name is required.';
    if (!email.trim())           e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (password.length < 8)    e.password = 'Password must be at least 8 characters.';
    if (password !== confirm)   e.confirm  = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Create the auth user (Supabase sends a confirmation email if enabled)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          // Pass metadata so the trigger can populate public.users
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || null,
          },
        },
      });

      if (signUpError) {
        setToast({ message: signUpError.message, type: 'error' });
        return;
      }

      // 2. Upsert the public.users row immediately (in case the trigger hasn't fired)
      if (authData.user) {
        await supabase.from('users').upsert({
          id: authData.user.id,
          email: email.trim().toLowerCase(),
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          role: 'customer',
        }, { onConflict: 'id' });
      }

      setToast({ message: 'Account created! Redirecting to dashboard…', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1600);
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const Field = ({
    id, label, type = 'text', value, onChange, placeholder, error, autoComplete,
  }: {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; placeholder?: string; error?: string; autoComplete?: string;
  }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => { onChange(e.target.value); setErrors(prev => ({ ...prev, [id]: '' })); }}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input-field"
        disabled={loading}
      />
      {error && <p style={{ color: '#e11d48', fontSize: '0.78rem', marginTop: 4 }}>{error}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      background: 'linear-gradient(135deg, #f5f0fa 0%, #fdf6f0 50%, #fff1ee 100%)',
    }}>
      <div
        className="glass-card animate-fade-in-up"
        style={{ width: '100%', maxWidth: 480, borderRadius: 24, padding: '2.5rem 2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-display" style={{ fontSize: '2.2rem', color: '#b25a5a', marginBottom: '0.5rem' }}>
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Join Luxe Salon and start booking
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Field id="fullName" label="Full Name" value={fullName} onChange={setFullName}
            placeholder="Jane Doe" error={errors.fullName} autoComplete="name" />
          <Field id="phone" label="Phone (optional)" type="tel" value={phone} onChange={setPhone}
            placeholder="+1 (555) 000-0000" autoComplete="tel" />
          <Field id="email" label="Email Address" type="email" value={email} onChange={setEmail}
            placeholder="you@example.com" error={errors.email} autoComplete="email" />
          <Field id="password" label="Password" type="password" value={password} onChange={setPassword}
            placeholder="Min. 8 characters" error={errors.password} autoComplete="new-password" />
          <Field id="confirm" label="Confirm Password" type="password" value={confirm} onChange={setConfirm}
            placeholder="Repeat your password" error={errors.confirm} autoComplete="new-password" />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
          >
            {loading ? <><Spinner size={18} /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#b25a5a', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
