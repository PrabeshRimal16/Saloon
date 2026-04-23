import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative pt-20 pb-8"
      style={{ background: 'var(--color-brown)', color: 'rgba(255,255,255,0.7)' }}
    >
      {/* Decorative Gold Line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="h-20 mb-6 flex flex-col justify-start">
              <h3
                className="text-2xl mb-1 leading-none"
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                Sovereign
              </h3>
              <p
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: 'var(--color-gold)' }}
              >
                Grooming
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Where precision meets elegance. A sanctuary for those who appreciate the art of refined grooming.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="h-20 mb-6 flex flex-col justify-start pt-1">
              <h4
                className="text-xs tracking-[0.2em] uppercase leading-none"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
              >
                Navigate
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              {['Services', 'Booking', 'Offers', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-sm no-underline transition-colors duration-300 hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="h-20 mb-6 flex flex-col justify-start pt-1">
              <h4
                className="text-xs tracking-[0.2em] uppercase leading-none"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
              >
                Opening Hours
              </h4>
            </div>
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Mon – Fri: 9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Saturday: 9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Sunday: Closed</span>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="h-20 mb-6 flex flex-col justify-start pt-1">
              <h4
                className="text-xs tracking-[0.2em] uppercase leading-none"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
              >
                Get in Touch
              </h4>
            </div>
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: 'var(--color-gold)' }} />
                <span>123 Park Avenue, New York, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                <span>(212) 555-0189</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} style={{ color: 'var(--color-gold)' }} />
                <span>hello@sovereigngrooming.com</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {['IG', 'FB'].map((label, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 text-xs font-semibold no-underline"
                  style={{
                    border: '1px solid rgba(201,169,110,0.3)',
                    color: 'var(--color-gold)',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <p>© 2025 Sovereign Grooming. Designed for the Intentional.</p>
          <div className="flex gap-6">
            <a href="#" className="no-underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>Privacy Policy</a>
            <a href="#" className="no-underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms of Service</a>
            <a href="#" className="no-underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
