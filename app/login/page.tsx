'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Toast, Spinner } from '@/components/AuthGuard';

/**
 * Login page — email/password authentication via Supabase Auth.
 * Redirects to /dashboard on success (or the URL in ?redirectTo=).
 */
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [toast, setToast]       = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Read redirect param (set by middleware)
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirectTo') ?? '/dashboard';

      setToast({ message: 'Welcome back! Redirecting…', type: 'success' });
      setTimeout(() => router.push(redirectTo), 1200);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      background: 'linear-gradient(135deg, #fff1ee 0%, #fdf6f0 50%, #f5f0fa 100%)',
    }}>
      <div
        className="glass-card animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 24,
          padding: '2.5rem 2rem',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            className="heading-display"
            style={{ fontSize: '2.2rem', color: '#b25a5a', marginBottom: '0.5rem' }}
          >
            Welcome Back
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Sign in to manage your appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.1rem' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="input-field"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.625rem 0.875rem',
              background: '#fff5f5',
              border: '1px solid #fecaca',
              borderRadius: 8,
              fontSize: '0.85rem',
              color: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '1.25rem', fontSize: '0.95rem' }}
          >
            {loading ? <><Spinner size={18} /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#b25a5a', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
