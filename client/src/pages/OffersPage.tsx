import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Percent, Crown, X } from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

const offers = [
  {
    id: '1',
    title: 'First Visit — 15% Off',
    description: 'Welcome to Sovereign Grooming. Enjoy 15% off your first service as our way of introducing you to the luxury experience.',
    icon: Gift,
    gradient: 'linear-gradient(135deg, #C9A96E 0%, #B08F5A 100%)',
    code: 'WELCOME15',
  },
  {
    id: '2',
    title: 'Buy 3 Waxing, Get 1 Free',
    description: 'Book three waxing sessions and receive your fourth complimentary. Consistency meets savings.',
    icon: Percent,
    gradient: 'linear-gradient(135deg, #2C2416 0%, #4A3D2E 100%)',
    code: 'WAX4FREE',
  },
  {
    id: '3',
    title: 'Monthly Membership — $99',
    description: 'Enjoy 2 services per month, priority booking, and exclusive member pricing. The ultimate grooming subscription.',
    icon: Crown,
    gradient: 'linear-gradient(135deg, #8B7E6E 0%, #6B5E4E 100%)',
    code: 'SOVEREIGN99',
  },
];

export default function OffersPage() {
  const [redeemModal, setRedeemModal] = useState<string | null>(null);
  const [redeemForm, setRedeemForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleRedeem = () => {
    setSubmitted(true);
    setTimeout(() => {
      setRedeemModal(null);
      setSubmitted(false);
      setRedeemForm({ name: '', email: '', phone: '' });
    }, 2000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
            Exclusive Offers
          </span>
          <h1 className="text-4xl md:text-6xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Elevated <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Value</span>
          </h1>
          <div className="divider-gold mt-4" />
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Luxury doesn't always have to come at full price. Explore our curated promotions.
          </p>
        </motion.div>
      </section>

      {/* Offers Grid */}
      <section className="section max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, i) => (
            <AnimatedSection key={offer.id} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                className="rounded-2xl overflow-hidden h-full flex flex-col"
              >
                <div className="p-8 flex flex-col items-center text-center text-white" style={{ background: offer.gradient }}>
                  <offer.icon size={36} className="mb-4 opacity-80" />
                  <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{offer.title}</h3>
                </div>
                <div className="p-6 flex-grow flex flex-col" style={{ background: 'rgba(255,255,255,0.8)', borderLeft: '1px solid rgba(201,169,110,0.1)', borderRight: '1px solid rgba(201,169,110,0.1)', borderBottom: '1px solid rgba(201,169,110,0.1)', borderRadius: '0 0 1rem 1rem' }}>
                  <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'var(--color-muted)' }}>{offer.description}</p>
                  <div className="text-center mb-4">
                    <span className="text-xs tracking-[0.1em] px-4 py-1.5 rounded-full" style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--color-gold)', fontWeight: 600 }}>
                      Code: {offer.code}
                    </span>
                  </div>
                  <button onClick={() => setRedeemModal(offer.id)} className="btn-gold w-full">
                    Redeem Offer
                  </button>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Redeem Modal */}
      <AnimatePresence>
        {redeemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setRedeemModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-8 rounded-2xl relative"
              style={{ background: 'var(--color-cream)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setRedeemModal(null)}
                className="absolute top-4 right-4 p-1 bg-transparent border-0 cursor-pointer"
                style={{ color: 'var(--color-muted)' }}
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <>
                  <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                    Redeem Your Offer
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
                    Enter your details and we'll apply the discount to your next visit.
                  </p>
                  <div className="flex flex-col gap-4">
                    <input className="input-field" placeholder="Full Name" value={redeemForm.name} onChange={(e) => setRedeemForm({ ...redeemForm, name: e.target.value })} />
                    <input className="input-field" placeholder="Email" value={redeemForm.email} onChange={(e) => setRedeemForm({ ...redeemForm, email: e.target.value })} />
                    <input className="input-field" placeholder="Phone" value={redeemForm.phone} onChange={(e) => setRedeemForm({ ...redeemForm, phone: e.target.value })} />
                    <button onClick={handleRedeem} className="btn-gold w-full mt-2">
                      Submit
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-gold)' }}>
                    <Gift size={28} color="#fff" />
                  </motion.div>
                  <h3 className="text-lg" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>Offer Redeemed!</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Check your email for details.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
