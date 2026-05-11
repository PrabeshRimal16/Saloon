import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Booking', path: '/booking' },
  { name: 'Offers', path: '/offers' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const toggleDark = () => {
    setDark(!dark);
    document.body.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(' ')[0]
    : user?.email?.split('@')[0] ?? '';

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span
            className="text-2xl tracking-wider"
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              color: scrolled ? 'var(--color-brown)' : '#fff',
            }}
          >
            Sovereign
          </span>
          <span
            className="text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'var(--color-gold)' }}
          >
            Grooming
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative text-sm tracking-[0.12em] uppercase no-underline transition-colors duration-300"
              style={{
                fontWeight: 500,
                color:
                  location.pathname === link.path
                    ? 'var(--color-gold)'
                    : scrolled
                    ? 'var(--color-brown-light)'
                    : 'rgba(255,255,255,0.85)',
              }}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5"
                  style={{ background: 'var(--color-gold)' }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDark}
            className="p-2 rounded-full transition-colors duration-300 hover:bg-white/10"
            style={{ color: scrolled ? 'var(--color-brown)' : '#fff' }}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth: show user avatar dropdown OR login link */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 hover:border-gold cursor-pointer"
                style={{
                  borderColor: 'rgba(201,169,110,0.35)',
                  background: scrolled ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.1)',
                  color: scrolled ? 'var(--color-brown)' : '#fff',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--color-gold)', color: '#fff' }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium tracking-wide">{displayName}</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl overflow-hidden"
                    style={{ background: '#fff', border: '1px solid rgba(201,169,110,0.15)' }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(201,169,110,0.1)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-brown)' }}>{displayName}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>{user.email}</p>
                    </div>
                    <button
                      id="signout-btn"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm bg-transparent border-0 cursor-pointer transition-colors hover:bg-red-50 text-left"
                      style={{ color: '#dc2626' }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              id="nav-login-btn"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium no-underline transition-colors duration-300 hover:opacity-80"
              style={{ color: scrolled ? 'var(--color-gold)' : 'rgba(255,255,255,0.85)' }}
            >
              <User size={15} />
              Login
            </Link>
          )}

          <Link
            to="/booking"
            className="hidden md:inline-block btn-gold !py-2.5 !px-5 !text-xs no-underline"
          >
            Book Now
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: scrolled ? 'var(--color-brown)' : '#fff' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm tracking-[0.12em] uppercase no-underline py-2 border-b"
                  style={{
                    fontWeight: 500,
                    color: location.pathname === link.path ? 'var(--color-gold)' : 'var(--color-brown)',
                    borderColor: 'rgba(201,169,110,0.1)',
                  }}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="btn-outline flex items-center justify-center gap-2 text-center mt-2"
                  style={{ color: '#dc2626', borderColor: 'rgba(220,38,38,0.3)' }}
                >
                  <LogOut size={14} />
                  Sign Out ({displayName})
                </button>
              ) : (
                <Link to="/login" className="btn-outline text-center no-underline mt-1">
                  Login / Register
                </Link>
              )}

              <Link to="/booking" className="btn-gold text-center no-underline mt-1">
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
