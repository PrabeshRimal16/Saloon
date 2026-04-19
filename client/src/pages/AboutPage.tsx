import { motion } from 'framer-motion';
import { Heart, Award, Gem } from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

const values = [
  { icon: Heart, title: 'Intentional Care', description: 'Every service is delivered with purpose, precision, and genuine care for your experience.' },
  { icon: Award, title: 'Master Artisans', description: 'Our team consists of certified experts with years of specialized training in their craft.' },
  { icon: Gem, title: 'Premium Products', description: 'We exclusively use luxury, cruelty-free products sourced from the finest international brands.' },
];

const team = [
  { name: 'Isabella Chen', role: 'Lead Hair Stylist', bio: 'With over 12 years of experience, Isabella brings artistic vision and technical mastery to every client.' },
  { name: 'Marcus Rivera', role: 'Senior Waxing Specialist', bio: 'Marcus is known for his gentle technique and meticulous attention to detail in all waxing services.' },
  { name: 'Aria Thompson', role: 'Lash Artist', bio: 'Aria\'s expertise in lash lifting and tinting has made her a sought-after specialist for natural enhancement.' },
  { name: 'Daniel Park', role: 'Color Technician', bio: 'Daniel specializes in balayage and highlights, creating bespoke color that enhances each client\'s natural beauty.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            The Art of <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Refinement</span>
          </h1>
          <div className="divider-gold mt-4" />
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              Founded in 2024, Sovereign Grooming was born from a simple belief: grooming should be more than a routine — it should be a ritual. A moment of intentional self-care in an otherwise relentless world.
            </p>
            <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              We created a sanctuary where traditional craftsmanship meets contemporary luxury. Every detail — from the ambient lighting to the products we select — has been chosen to elevate your experience beyond the ordinary.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Our artisans are not just technicians; they are creative professionals who understand that confidence begins with how you feel about yourself. At Sovereign, your chair is always waiting.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: 'var(--color-beige)' }}>
        <div className="section !py-0">
          <AnimatedSection className="text-center mb-14">
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
              What Defines Us
            </span>
            <h2 className="text-3xl md:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
              Our Pillars
            </h2>
            <div className="divider-gold mt-4" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.15}>
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.1)' }}>
                    <value.icon size={28} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <AnimatedSection className="text-center mb-14">
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
            The Artisans
          </span>
          <h2 className="text-3xl md:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
            Meet Our Team
          </h2>
          <div className="divider-gold mt-4" />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <AnimatedSection key={member.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="text-center p-6 rounded-2xl border transition-shadow"
                style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(201,169,110,0.1)' }}
              >
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    background: 'linear-gradient(135deg, var(--color-beige), var(--color-cream))',
                    color: 'var(--color-gold)',
                    border: '2px solid rgba(201,169,110,0.2)',
                  }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                  {member.name}
                </h3>
                <p className="text-xs tracking-[0.1em] uppercase mb-3" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {member.bio}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}
