import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would save to Supabase contacts table
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: MapPin, label: 'Visit Us', value: '123 Park Avenue, New York, NY 10016' },
    { icon: Phone, label: 'Call Us', value: '(212) 555-0189' },
    { icon: Mail, label: 'Email Us', value: 'hello@sovereigngrooming.com' },
    { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9AM–7PM | Sunday: Closed' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            We'd Love to <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Hear</span> from You
          </h1>
          <div className="divider-gold mt-4" />
        </motion.div>
      </section>

      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <AnimatedSection>
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
              Send a Message
            </h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Your Name</label>
                  <input className="input-field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Email Address</label>
                  <input className="input-field" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Message</label>
                  <textarea
                    className="input-field"
                    rows={6}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn-gold flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl text-center"
                style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)' }}
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-gold)' }}>
                  <Check size={24} color="#fff" />
                </div>
                <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                  Message Sent!
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatedSection>

          {/* Contact Info + Map */}
          <AnimatedSection delay={0.2}>
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
              Visit Our Sanctuary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="p-5 rounded-xl border"
                  style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(201,169,110,0.1)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <info.icon size={16} style={{ color: 'var(--color-gold)' }} />
                    <span className="text-xs tracking-[0.1em] uppercase font-semibold" style={{ color: 'var(--color-gold)' }}>
                      {info.label}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    {info.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div
              className="w-full h-72 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-beige), var(--color-cream))',
                border: '1px solid rgba(201,169,110,0.15)',
              }}
            >
              <div className="text-center">
                <MapPin size={32} style={{ color: 'var(--color-gold)', margin: '0 auto 0.5rem' }} />
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  123 Park Avenue, New York
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted-light)' }}>
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
