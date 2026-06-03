import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/services`)
      .then(r => r.json())
      .then(data => setServices(data.slice(0, 3)))
      .catch(() => {});
    fetch(`${API_BASE}/api/offers`)
      .then(r => r.json())
      .then(data => setOffers(data.filter(o => !o.valid_until || new Date(o.valid_until) > new Date()).slice(0, 4)))
      .catch(() => {});
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Guest';

  const fallbackServices = [
    { title: 'Artisanal Hair Sculpting', desc: 'A bespoke cutting experience tailored to your facial structure and personal style.', price: 2500, icon: 'content_cut' },
    { title: 'Radiance Facial', desc: 'Advanced oxygen-infused hydration therapy for a luminous, rested complexion.', price: 3500, icon: 'spa' },
    { title: 'Noir Beard Grooming', desc: 'The ultimate ritual featuring hot towel service, razor detailing, and oil treatment.', price: 1800, icon: 'face' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F2] flex flex-col">
      <CustomerNavbar />

      <main className="flex-grow pt-[80px]">

        {/* ── Hero Banner ── */}
        <section className="relative w-full h-[88vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=80"
            alt="Luxury Salon Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24">
            <div>
              <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4 font-bold">Welcome back</div>
              <h1 className="font-serif text-[52px] md:text-[72px] text-white font-bold leading-[1.1] mb-5 max-w-2xl">
                {firstName},<br />Look Stunning.
              </h1>
              <p className="text-[16px] text-white/70 mb-10 max-w-md leading-relaxed">
                Experience luxury grooming tailored to your unique style at L'Atelier.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/appointments')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] text-white text-[13px] font-bold rounded uppercase tracking-wider hover:bg-[#b5943b] shadow-[0_4px_24px_rgba(201,168,76,0.5)] transition-all hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Book Now
                </button>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-[13px] font-bold rounded border border-white/30 hover:bg-white/20 transition-all uppercase tracking-wider"
                >
                  View Services
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Strip ── */}
        <section className="bg-[#1A1A1A] px-8 py-5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'verified', text: 'Certified Stylists' },
              { icon: 'spa', text: 'Luxury Products' },
              { icon: 'schedule', text: 'Flexible Booking' },
              { icon: 'star', text: 'Premium Service' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3 py-2">
                <span className="material-symbols-outlined text-[#C9A84C] text-[22px]">{f.icon}</span>
                <span className="text-[13px] text-white/80 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Services ── */}
        <section className="px-8 md:px-16 py-20 bg-[#FBF8F2]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-2 font-bold">Our Expertise</div>
                <h2 className="font-serif text-[38px] font-bold text-[#1A1A1A] m-0">Featured Services</h2>
              </div>
              <button onClick={() => navigate('/services')} className="inline-flex items-center gap-2 text-[#C9A84C] text-[13px] font-bold hover:gap-3 transition-all uppercase tracking-wider">
                View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(services.length > 0 ? services : fallbackServices).map((s, i) => {
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const imgSrc = s.image_url || s.imageUrl;
                const fullImg = imgSrc ? (imgSrc.startsWith('/') ? `${API_BASE}${imgSrc}` : imgSrc) : null;
                return (
                  <div key={s.id || s.title || i} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)] hover:-translate-y-1.5 transition-all duration-300 group">
                    <div className="h-52 bg-gradient-to-br from-[#FEF9ED] to-[#EAD9A0] flex items-center justify-center overflow-hidden">
                      {fullImg
                        ? <img src={fullImg} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <span className="material-symbols-outlined text-[#C9A84C] text-[64px]">{s.icon || 'content_cut'}</span>
                      }
                    </div>
                    <div className="p-6">
                      {s.category && (
                        <span className="px-2.5 py-0.5 bg-[#FEF9ED] border border-[#E8D9A0] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">
                          {s.category}
                        </span>
                      )}
                      <h3 className="font-serif text-[18px] font-bold text-[#1A1A1A] mb-2">{s.name || s.title}</h3>
                      <p className="text-[13px] text-[#6B6B6B] leading-relaxed mb-5 line-clamp-2">{s.description || s.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-[22px] font-bold text-[#C9A84C]">${s.price}</span>
                        <button onClick={() => navigate('/appointments')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C9A84C] text-white rounded text-[12px] font-bold hover:bg-[#b5943b] transition-all uppercase tracking-wide">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Active Offers ── */}
        {offers.length > 0 && (
          <section className="px-8 md:px-16 pb-20 bg-[#FBF8F2]">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-2 font-bold">Exclusive Deals</div>
                  <h2 className="font-serif text-[38px] font-bold text-[#1A1A1A] m-0">Active Offers</h2>
                </div>
                <button onClick={() => navigate('/offers')} className="inline-flex items-center gap-2 text-[#C9A84C] text-[13px] font-bold hover:gap-3 transition-all uppercase tracking-wider">
                  See All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
                {offers.map(offer => {
                  const API_BASE = process.env.REACT_APP_API_URL || '';
                  const imgSrc = offer.image_url ? (offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url) : null;
                  return (
                    <div key={offer.id} className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] border-t-4 border-[#C9A84C] min-w-[280px] max-w-[280px] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200">
                      <div className="h-40 bg-gradient-to-br from-[#FEF9ED] to-[#EAD9A0] relative flex items-center justify-center overflow-hidden">
                        {imgSrc
                          ? <img src={imgSrc} alt={offer.title} className="w-full h-full object-cover" />
                          : <span className="material-symbols-outlined text-[#C9A84C] text-[48px] opacity-40">local_offer</span>
                        }
                        {offer.discount_percent > 0 && (
                          <div className="absolute top-3 left-3 bg-[#C9A84C] text-white font-bold text-[13px] px-3 py-1 rounded">
                            {offer.discount_percent}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-[15px] font-bold text-[#1A1A1A] mb-1">{offer.title}</h3>
                        <p className="text-[12px] text-[#6B6B6B] line-clamp-2 mb-3">{offer.description}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#888]">
                          <span className="material-symbols-outlined text-[14px] text-[#C9A84C]">event</span>
                          {offer.valid_until ? `Until ${new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Limited time'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA Banner ── */}
        <section className="px-8 md:px-16 pb-20 bg-[#FBF8F2]">
          <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[#1A1A1A] relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-12">
              <div>
                <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-2 font-bold">Manage</div>
                <h2 className="font-serif text-[34px] font-bold text-white mb-2 m-0">Your Appointments</h2>
                <p className="text-[14px] text-white/60">View, manage and track all your upcoming and past bookings.</p>
              </div>
              <button onClick={() => navigate('/appointments')} className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] text-white text-[13px] font-bold rounded uppercase tracking-wider hover:bg-[#b5943b] shadow-[0_4px_20px_rgba(201,168,76,0.4)] transition-all hover:scale-[1.02] whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                My Appointments
              </button>
            </div>
          </div>
        </section>

      </main>

      <CustomerFooter />
    </div>
  );
}