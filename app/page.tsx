import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Luxe Salon — Premium Hair & Beauty',
  description:
    'Experience the finest in hair, beauty, and wellness at Luxe Salon. Book your appointment online today.',
};

// Services showcased on the homepage
const FEATURED_SERVICES = [
  { icon: '✂️', name: 'Haircut & Styling',     desc: 'Precision cuts tailored to your face shape and style.' },
  { icon: '🎨', name: 'Hair Coloring',          desc: 'From subtle highlights to bold transformations.' },
  { icon: '✨', name: 'Keratin Treatment',      desc: 'Smooth, frizz-free hair that lasts up to 5 months.' },
  { icon: '💆', name: 'Facial & Skincare',      desc: 'Rejuvenate your skin with our expert facial treatments.' },
  { icon: '💅', name: 'Manicure & Pedicure',   desc: 'Pamper your hands and feet with luxury nail care.' },
  { icon: '💍', name: 'Bridal Package',         desc: 'Look breathtaking on your most special day.' },
];

const TESTIMONIALS = [
  { name: 'Sophia M.',   text: 'The best salon experience I\'ve ever had. My hair has never looked this good!', stars: 5 },
  { name: 'Emma R.',     text: 'The team is professional, warm and incredibly talented. I\'m a regular for life.', stars: 5 },
  { name: 'Priya K.',    text: 'Booked online in minutes, arrived to perfection every time. 10/10 recommend.', stars: 5 },
];

function Stars({ n }: { n: number }) {
  return (
    <div style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: 8 }}>
      {'★'.repeat(n)}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="hero-gradient"
        style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'flex',
          alignItems: 'center',
          padding: '4rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '10%', right: '-10%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(249,169,154,0.18) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '-10%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(196,156,232,0.14) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left — copy */}
            <div className="animate-fade-in-up">
              <p style={{
                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: '#c96e38', marginBottom: '1rem',
              }}>
                Premium Beauty Studio
              </p>
              <h1
                className="heading-display"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: '#1e293b', marginBottom: '1.25rem' }}
              >
                Where Beauty<br />
                <em style={{ color: '#b25a5a', fontStyle: 'italic' }}>Becomes Art</em>
              </h1>
              <p style={{
                color: '#64748b', fontSize: '1.08rem', lineHeight: 1.75,
                maxWidth: 440, marginBottom: '2.5rem',
              }}>
                Experience luxury hair and beauty treatments crafted by our master stylists.
                Online booking, transparent pricing, and results that speak for themselves.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/booking"
                  className="btn-primary"
                  style={{ textDecoration: 'none', padding: '0.9rem 2rem', fontSize: '1rem' }}
                >
                  Book Appointment
                </Link>
                <Link
                  href="#services"
                  className="btn-secondary"
                  style={{ textDecoration: 'none', padding: '0.9rem 2rem', fontSize: '1rem' }}
                >
                  Explore Services
                </Link>
              </div>

              {/* Trust signals */}
              <div style={{
                display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap',
              }}>
                {[
                  { value: '2,400+', label: 'Happy Clients' },
                  { value: '12 yrs',  label: 'Experience' },
                  { value: '4.9 ★',   label: 'Average Rating' },
                ].map(t => (
                  <div key={t.label}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b25a5a' }}>{t.value}</p>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — decorative visual */}
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Outer ring */}
              <div style={{
                width: 380, height: 380,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(249,169,154,0.15), rgba(196,156,232,0.1))',
                border: '1.5px solid rgba(249,169,154,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Inner content */}
                <div style={{
                  width: 280, height: 280, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fff1ee, #fdf6f0)',
                  border: '1.5px solid rgba(249,169,154,0.4)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(178,90,90,0.12)',
                }}>
                  <span style={{ fontSize: '5rem', display: 'block', textAlign: 'center' }}>💇</span>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                    color: '#b25a5a', marginTop: 8, fontWeight: 300,
                  }}>Luxe Salon</p>
                </div>

                {/* Floating badge — top right */}
                <div style={{
                  position: 'absolute', top: 30, right: -10,
                  background: 'white', borderRadius: 14, padding: '0.6rem 1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>⭐</span>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Rating</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', margin: 0 }}>4.9 / 5.0</p>
                  </div>
                </div>

                {/* Floating badge — bottom left */}
                <div style={{
                  position: 'absolute', bottom: 40, left: -20,
                  background: 'white', borderRadius: 14, padding: '0.6rem 1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>📅</span>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Next slot</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', margin: 0 }}>Tomorrow 10 AM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="services"
        style={{ padding: '6rem 1.5rem', background: 'white' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96e38', marginBottom: '0.5rem' }}>
              What We Offer
            </p>
            <h2 className="heading-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#1e293b' }}>
              Our Services
            </h2>
            <p style={{ color: '#64748b', maxWidth: 500, margin: '1rem auto 0', lineHeight: 1.7 }}>
              From everyday cuts to full transformations — we offer everything your hair and beauty needs deserve.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
            className="stagger"
          >
            {FEATURED_SERVICES.map(service => (
              <div
                key={service.name}
                className="glass-card animate-fade-in-up"
                style={{
                  borderRadius: 20,
                  padding: '1.75rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  {service.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/booking" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              Book Any Service
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(160deg, #fff6f4, #fdf9f7)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96e38', marginBottom: '0.5rem' }}>
            Simple &amp; Fast
          </p>
          <h2 className="heading-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#1e293b', marginBottom: '3.5rem' }}>
            Book in 3 Easy Steps
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Choose a Service', desc: 'Browse our full menu of hair and beauty treatments.', icon: '✂️' },
              { step: '02', title: 'Pick Date & Time', desc: 'Select a slot that fits perfectly into your schedule.', icon: '📅' },
              { step: '03', title: 'Relax & Enjoy',    desc: 'Arrive, unwind, and leave feeling absolutely radiant.', icon: '✨' },
            ].map(s => (
              <div key={s.step} style={{ position: 'relative' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f9a99a, #e07a70)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', margin: '0 auto 1.25rem',
                  boxShadow: '0 8px 24px rgba(224,122,112,0.3)',
                }}>
                  {s.icon}
                </div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f9a99a', letterSpacing: '0.08em', marginBottom: 6 }}>STEP {s.step}</p>
                <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 1.5rem', background: '#1e293b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f9a99a', marginBottom: '0.5rem' }}>
              Client Love
            </p>
            <h2 className="heading-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'white' }}>
              What Our Clients Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map(t => (
              <div
                key={t.name}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: '1.75rem',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Stars n={t.stars} />
                <p style={{ color: '#cbd5e1', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <p style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #fff1ee, #fdf6f0)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 className="heading-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#1e293b', marginBottom: '1rem' }}>
            Ready for Your<br />
            <em style={{ color: '#b25a5a' }}>Transformation?</em>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2rem' }}>
            Join thousands of clients who trust Luxe Salon for their beauty needs.
            Book online in under 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              Get Started Free
            </Link>
            <Link href="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0f172a', color: '#64748b', textAlign: 'center',
        padding: '2rem 1.25rem', fontSize: '0.85rem',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#f9a99a', marginBottom: '0.5rem' }}>
          Luxe <em>Salon</em>
        </p>
        <p>© {new Date().getFullYear()} Luxe Salon. All rights reserved.</p>
      </footer>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
