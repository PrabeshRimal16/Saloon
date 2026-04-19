'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { UserProfile } from '@/types';

/**
 * Responsive Navbar with:
 * - Logo + nav links
 * - Auth state (login/logout)
 * - Mobile hamburger menu
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch auth state on mount and on route change
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }
    loadUser();

    // Listen for auth changes (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });
    return () => subscription.unsubscribe();
  }, [pathname]); // re-run on navigation

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/booking', label: 'Book Now' },
    ...(profile ? [{ href: '/dashboard', label: 'My Bookings' }] : []),
    ...(profile?.role === 'admin' ? [{ href: '/admin/dashboard', label: 'Admin' }] : []),
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.6)',
        background: 'rgba(253,250,247,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 1.25rem',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.65rem',
              fontWeight: 400,
              color: '#b25a5a',
              letterSpacing: '-0.01em',
            }}
          >
            Luxe <em style={{ fontStyle: 'italic', color: '#c96e38' }}>Salon</em>
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="nav-desktop"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: pathname === link.href ? '#b25a5a' : '#64748b',
                borderBottom: pathname === link.href ? '2px solid #f9a99a' : '2px solid transparent',
                paddingBottom: 2,
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!loading && (
            <>
              {profile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      maxWidth: 140,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {profile.full_name ?? profile.email}
                  </span>
                  <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#64748b',
            }}
            className="nav-hamburger"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="8" x2="21" y2="8"/>
                <line x1="3" y1="16" x2="21" y2="16"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            padding: '1rem 1.25rem 1.5rem',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(253,250,247,0.97)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: pathname === link.href ? '#b25a5a' : '#334155',
                padding: '0.4rem 0',
              }}
            >
              {link.label}
            </Link>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.25rem 0' }} />
          {profile ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Logout
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/login" className="btn-secondary" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive CSS via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
