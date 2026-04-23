import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, Star } from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

const featuredServices = [
  {
    name: 'Wash & Blowout',
    price: '$65',
    duration: '45 min',
    description: 'A revitalizing cleanse followed by a precision blowout that leaves you feeling polished and renewed.',
    category: 'Hair',
  },
  {
    name: 'Hair Balayage',
    price: '$265',
    duration: '3 hr 15 min',
    description: 'Hand-painted, sun-kissed highlights that blend seamlessly for a natural, dimensional look.',
    category: 'Hair',
  },
  {
    name: 'Brazilian Waxing',
    price: 'from $55',
    duration: '25 min',
    description: 'Smooth, precise waxing using premium hard or chocolate wax for maximum comfort.',
    category: 'Waxing',
  },
  {
    name: 'Lash Lift + Tint',
    price: '$85',
    duration: '1 hr 15 min',
    description: 'Elevate your natural lashes with a semi-permanent lift and customized tint for effortless beauty.',
    category: 'Lashes',
  },
  {
    name: 'Full Face Waxing',
    price: '$40',
    duration: '45 min',
    description: 'Complete facial hair removal using our gentlest techniques for silky smooth results.',
    category: 'Waxing',
  },
  {
    name: 'Full Highlights',
    price: '$265',
    duration: '3 hr 40 min',
    description: 'Transform your look with expertly placed foils for all-over luminosity and depth.',
    category: 'Hair',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ═══ HERO SECTION ═══ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2C2416 0%, #1A1612 40%, #2C2416 100%)',
        }}
      >
        {/* Decorative Elements */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(201,169,110,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,169,110,0.1) 0%, transparent 40%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            border: '1px solid var(--color-gold)',
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-12" style={{ background: 'var(--color-gold)' }} />
            <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
            <span
              className="text-xs tracking-[0.35em] uppercase"
              style={{ color: 'var(--color-gold)', fontWeight: 500 }}
            >
              Est. 2024
            </span>
            <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
            <div className="h-px w-12" style={{ background: 'var(--color-gold)' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-serif)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Where Precision
            <br />
            Meets{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: 'var(--color-gold)',
              }}
            >
              Elegance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            A sanctuary for those who appreciate the art of refined grooming.
            Premium hair, waxing, and lash services crafted for the modern professional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/booking" className="btn-gold flex items-center gap-2 no-underline">
              Book Your Experience
              <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn-outline no-underline">
              Explore Services
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
            style={{ borderColor: 'rgba(201,169,110,0.3)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--color-gold)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURED SERVICES ═══ */}
      <section className="section">
        <AnimatedSection className="text-center mb-16">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: 'var(--color-gold)', fontWeight: 500 }}
          >
            Our Craft
          </span>
          <h2
            className="text-4xl md:text-5xl mt-3"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
          >
            Signature Services
          </h2>
          <div className="divider-gold mt-4" />
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: 'var(--color-muted)' }}
          >
            Each service is a carefully curated experience, designed to leave you looking and feeling extraordinary.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, index) => (
            <AnimatedSection key={service.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(201,169,110,0.12)' }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl border cursor-pointer h-full"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(201,169,110,0.12)',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className="text-xs tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(201,169,110,0.1)',
                      color: 'var(--color-gold)',
                      fontWeight: 600,
                    }}
                  >
                    {service.category}
                  </span>
                  <span
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-gold)',
                    }}
                  >
                    {service.price}
                  </span>
                </div>

                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
                >
                  {service.name}
                </h3>

                <div className="flex items-center gap-1.5 mb-4">
                  <Clock size={13} style={{ color: 'var(--color-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {service.duration}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
                  {service.description}
                </p>

                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase no-underline font-semibold transition-colors duration-300"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Book Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══ PHILOSOPHY BANNER ═══ */}
      <section
        className="py-24"
        style={{
          background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)',
        }}
      >
        <AnimatedSection>
          <div className="max-w-3xl mx-auto px-6">
            <Star size={20} style={{ color: 'var(--color-gold)', margin: '0 0 1.5rem 0' }} />
            <h2
              className="text-3xl md:text-4xl mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}
            >
              Refinement as a{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Ritual.</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              At Sovereign Grooming, every detail matters. From the moment you step through our doors,
              you enter a world where traditional craft meets contemporary luxury.
              Your chair is waiting.
            </p>
            <Link to="/about" className="btn-outline no-underline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>
              Our Story
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section">
        <AnimatedSection className="text-center mb-16">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: 'var(--color-gold)', fontWeight: 500 }}
          >
            Testimonials
          </span>
          <h2
            className="text-4xl md:text-5xl mt-3"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
          >
            What Our Clients Say
          </h2>
          <div className="divider-gold mt-4" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sophia M.',
              text: 'The balayage I received was absolutely flawless. The attention to detail and the luxurious atmosphere make every visit feel like an escape.',
              service: 'Hair Balayage',
            },
            {
              name: 'James K.',
              text: 'Finally found a grooming salon that matches the level of precision I expect. The staff is incredibly skilled, and the ambiance is unmatched.',
              service: 'Wash & Blowout',
            },
            {
              name: 'Elena R.',
              text: 'My lash lift looks amazing — so natural yet so defined. Sovereign Grooming truly understands the art of subtle enhancement.',
              service: 'Lash Lift + Tint',
            },
          ].map((testimonial, i) => (
            <AnimatedSection key={testimonial.name} delay={i * 0.15}>
              <div
                className="p-8 rounded-2xl border"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  borderColor: 'rgba(201,169,110,0.1)',
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={14} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}
                >
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-brown)' }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-gold)' }}>
                    {testimonial.service}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 text-center" style={{ background: 'var(--color-beige)' }}>
        <AnimatedSection>
          <div className="max-w-2xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
            >
              Ready for Your Transformation?
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--color-muted)' }}>
              Book your appointment today and experience the Sovereign difference.
            </p>
            <Link to="/booking" className="btn-gold inline-flex items-center gap-2 no-underline">
              Book Your Visit <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
