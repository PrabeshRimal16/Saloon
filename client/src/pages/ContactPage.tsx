import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, Check,
  Hash, ChevronDown, ChevronUp,
  MessageSquare, Scissors, Star
} from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Visit Us',
    value: '123 Park Avenue, Suite 501',
    sub: 'New York, NY 10016',
    color: '#C9A96E',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '(212) 555-0189',
    sub: 'Mon–Sat 9AM–7PM',
    color: '#C9A96E',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@sovereigngrooming.com',
    sub: 'We reply within 24 hours',
    color: '#C9A96E',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Sat: 9:00 AM – 7:00 PM',
    sub: 'Sunday: Closed',
    color: '#C9A96E',
  },
];

const hours = [
  { day: 'Monday', time: '9:00 AM – 7:00 PM', open: true },
  { day: 'Tuesday', time: '9:00 AM – 7:00 PM', open: true },
  { day: 'Wednesday', time: '9:00 AM – 7:00 PM', open: true },
  { day: 'Thursday', time: '9:00 AM – 8:00 PM', open: true },
  { day: 'Friday', time: '8:00 AM – 8:00 PM', open: true },
  { day: 'Saturday', time: '8:00 AM – 6:00 PM', open: true },
  { day: 'Sunday', time: 'Closed', open: false },
];

const faqs = [
  {
    q: 'Do I need to book in advance?',
    a: 'We highly recommend booking at least 48 hours in advance, especially for weekend appointments. Walk-ins are welcome based on availability.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'We require at least 24 hours notice for cancellations. Late cancellations or no-shows may incur a 50% service fee.',
  },
  {
    q: 'Do you offer gift cards?',
    a: 'Yes! Sovereign Grooming gift cards are available in any denomination and can be purchased in-salon or via email request.',
  },
  {
    q: 'What brands do you use?',
    a: 'We exclusively use premium, salon-grade products including Oribe, Kérastase, and GHD tools to ensure the finest results.',
  },
];

const socialLinks = [
  { icon: Hash, label: 'Instagram', handle: '@sovereigngrooming', url: '#' },
  { icon: Hash, label: 'Facebook', handle: 'Sovereign Grooming NYC', url: '#' },
  { icon: Hash, label: 'Twitter / X', handle: '@sovereigngroom', url: '#' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        className="relative pt-36 pb-28 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 60%, #2C2416 100%)' }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.14) 0%, transparent 70%)',
          }}
        />
        {/* Decorative ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(201,169,110,0.08)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6"
        >
          <span className="eyebrow">Get in Touch</span>
          <h1
            className="text-5xl md:text-7xl mt-4 mb-5"
            style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: 600 }}
          >
            We'd Love to{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Hear</span>
            {' '}from You
          </h1>
          <div className="divider-gold" />
          <p className="mt-5 text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Whether you have a question, want to book a consultation, or simply want to say hello —
            our team is here for you.
          </p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-10 mt-12"
          >
            {[
              { label: 'Years of Excellence', value: '10+' },
              { label: 'Happy Clients', value: '4,800+' },
              { label: 'Average Rating', value: '4.9 ★' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl font-semibold"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── CONTACT INFO CARDS ─── */}
      <section className="section-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map((info, i) => (
            <AnimatedSection key={info.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(201,169,110,0.12)' }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl border h-full"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  borderColor: 'rgba(201,169,110,0.14)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.18)' }}
                >
                  <info.icon size={18} style={{ color: 'var(--color-gold)' }} />
                </div>
                <p className="text-xs tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: 'var(--color-gold)' }}>
                  {info.label}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-brown)' }}>
                  {info.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-light)' }}>
                  {info.sub}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── FORM + HOURS + MAP ─── */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — Contact Form */}
          <AnimatedSection>
            <span className="eyebrow">Send a Message</span>
            <h2
              className="text-3xl md:text-4xl mt-3 mb-8"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
            >
              Start a Conversation
            </h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Your Name</label>
                    <input
                      className="input-field"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Phone Number</label>
                    <input
                      className="input-field"
                      type="tel"
                      placeholder="(000) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Email Address</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Service of Interest</label>
                  <select
                    className="input-field"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select a service…</option>
                    <option>Hair Balayage</option>
                    <option>Wash & Blowout</option>
                    <option>Full Highlights</option>
                    <option>Lash Lift + Tint</option>
                    <option>Brazilian Waxing</option>
                    <option>Full Face Waxing</option>
                    <option>Other / General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Message</label>
                  <textarea
                    className="input-field"
                    rows={5}
                    placeholder="How can we help you? Tell us anything…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-gold flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-10 rounded-2xl text-center"
                style={{
                  background: 'rgba(201,169,110,0.05)',
                  border: '1px solid rgba(201,169,110,0.18)',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark))', boxShadow: '0 8px 24px rgba(201,169,110,0.3)' }}
                >
                  <Check size={26} color="#fff" />
                </motion.div>
                <h3
                  className="text-2xl mb-2"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
                >
                  Message Received!
                </h3>
                <p className="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>
                  Thank you for reaching out. A member of our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                  className="btn-outline text-sm"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatedSection>

          {/* Right — Map + Hours + Social */}
          <AnimatedSection delay={0.2}>
            {/* Stylized Map */}
            <div
              className="relative w-full rounded-2xl overflow-hidden mb-8"
              style={{
                height: '260px',
                background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)',
                border: '1px solid rgba(201,169,110,0.15)',
              }}
            >
              {/* Decorative grid lines */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              {/* Roads */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" fill="none">
                <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(201,169,110,0.12)" strokeWidth="18" />
                <line x1="200" y1="0" x2="200" y2="260" stroke="rgba(201,169,110,0.12)" strokeWidth="12" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(201,169,110,0.06)" strokeWidth="6" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(201,169,110,0.06)" strokeWidth="6" />
                <line x1="100" y1="0" x2="100" y2="260" stroke="rgba(201,169,110,0.06)" strokeWidth="6" />
                <line x1="300" y1="0" x2="300" y2="260" stroke="rgba(201,169,110,0.06)" strokeWidth="6" />
                {/* Center block */}
                <rect x="148" y="88" width="104" height="84" rx="4" fill="rgba(201,169,110,0.07)" stroke="rgba(201,169,110,0.15)" strokeWidth="1" />
              </svg>
              {/* Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark))', boxShadow: '0 4px 20px rgba(201,169,110,0.5)' }}
                  >
                    <MapPin size={18} color="#fff" />
                  </div>
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px rgba(201,169,110,0.6)' }}
                  />
                </motion.div>
              </div>
              {/* Label */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-center whitespace-nowrap"
                style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)', backdropFilter: 'blur(12px)' }}
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--color-gold)' }}>123 Park Avenue</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>New York, NY 10016</p>
              </div>
            </div>

            {/* Business Hours */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(201,169,110,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Clock size={16} style={{ color: 'var(--color-gold)' }} />
                <h3 className="text-sm tracking-[0.15em] uppercase font-semibold" style={{ color: 'var(--color-gold)' }}>
                  Business Hours
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {hours.map((h) => {
                  const isToday = h.day === today;
                  return (
                    <div
                      key={h.day}
                      className="flex justify-between items-center py-2 px-3 rounded-lg"
                      style={{
                        background: isToday ? 'rgba(201,169,110,0.08)' : 'transparent',
                        border: isToday ? '1px solid rgba(201,169,110,0.15)' : '1px solid transparent',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'var(--color-gold)' }}
                          />
                        )}
                        <span
                          className="text-sm"
                          style={{ color: isToday ? 'var(--color-brown)' : 'var(--color-muted)', fontWeight: isToday ? 600 : 400 }}
                        >
                          {h.day}
                          {isToday && <span className="text-xs ml-2" style={{ color: 'var(--color-gold)' }}>Today</span>}
                        </span>
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: h.open ? 'var(--color-muted)' : 'rgba(201,0,0,0.55)' }}
                      >
                        {h.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(201,169,110,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Star size={16} style={{ color: 'var(--color-gold)' }} />
                <h3 className="text-sm tracking-[0.15em] uppercase font-semibold" style={{ color: 'var(--color-gold)' }}>
                  Follow Us
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 no-underline group"
                    style={{ border: '1px solid rgba(201,169,110,0.08)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.06)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.08)';
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.15)' }}
                    >
                      <s.icon size={16} style={{ color: 'var(--color-gold)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-brown)' }}>{s.label}</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted-light)' }}>{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section
        className="py-24"
        style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)' }}
      >
        <AnimatedSection>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="eyebrow">FAQ</span>
              <h2
                className="text-4xl md:text-5xl mt-3"
                style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}
              >
                Common{' '}
                <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Questions</span>
              </h2>
              <div className="divider-gold mt-4" />
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  layout
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: openFaq === i ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.04)',
                    border: openFaq === i ? '1px solid rgba(201,169,110,0.22)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <MessageSquare size={15} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                      <p className="text-sm font-medium" style={{ color: '#fff' }}>
                        {faq.q}
                      </p>
                    </div>
                    <div className="flex-shrink-0" style={{ color: 'var(--color-gold)' }}>
                      {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', paddingLeft: '2.5rem' }}>
                      {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── CTA STRIP ─── */}
      <section className="py-20" style={{ background: 'var(--color-beige)' }}>
        <AnimatedSection>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Scissors size={22} style={{ color: 'var(--color-gold)', margin: '0 auto 1rem' }} />
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
            >
              Ready to Experience Sovereign Grooming?
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-muted)' }}>
              Book your appointment today. Premium grooming, thoughtfully crafted for you.
            </p>
            <a href="/booking" className="btn-gold inline-flex items-center gap-2 no-underline">
              Book Your Experience
            </a>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
