import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search } from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

interface Service {
  id: string;
  name: string;
  price: number | null;
  price_display: string;
  duration: string;
  category: string;
  description: string;
}

const categories = ['all', 'hair', 'waxing', 'lashes'];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch services:', error);
        setLoading(false);
      });
  }, []);

  const filtered = services.filter((s) => {
    const matchCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Hero */}
      <section
        className="pt-32 pb-20 text-center"
        style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
            Our Services
          </span>
          <h1 className="text-4xl md:text-6xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Curated for <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Excellence</span>
          </h1>
          <div className="divider-gold mt-4" />
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Every service is an experience — meticulously crafted, delivered with artistry.
          </p>
        </motion.div>
      </section>

      {/* Filters & Content */}
      <section className="section">
        {/* Search & Filter Bar */}
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-xs tracking-[0.12em] uppercase font-semibold transition-all duration-300 border cursor-pointer"
                style={{
                  background: activeCategory === cat ? 'var(--color-gold)' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'var(--color-muted)',
                  borderColor: activeCategory === cat ? 'var(--color-gold)' : 'rgba(201,169,110,0.2)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !w-64"
            />
          </div>
        </AnimatedSection>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, index) => (
            <AnimatedSection key={service.name} delay={index * 0.05}>
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(201,169,110,0.12)' }}
                className="p-7 rounded-2xl border h-full flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(201,169,110,0.12)',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className="text-xs tracking-[0.12em] uppercase px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(201,169,110,0.1)',
                      color: 'var(--color-gold)',
                      fontWeight: 600,
                    }}
                  >
                    {service.category}
                  </span>
                  <span
                    className="text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
                  >
                    {service.price_display}
                  </span>
                </div>

                <h3
                  className="text-lg mb-2"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}
                >
                  {service.name}
                </h3>

                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={13} style={{ color: 'var(--color-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {service.duration}
                  </span>
                </div>

                <p className="text-sm leading-relaxed flex-grow mb-5" style={{ color: 'var(--color-muted)' }}>
                  {service.description}
                </p>

                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase no-underline font-semibold transition-all duration-300"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Book This Service <ArrowRight size={14} />
                </Link>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
            <p className="text-lg">No services match your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
