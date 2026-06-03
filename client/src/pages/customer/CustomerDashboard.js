import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/services`)
      .then(r => r.json())
      .then(data => setServices(data.slice(0, 6)))
      .catch(() => {});
    fetch(`${API_BASE}/api/offers`)
      .then(r => r.json())
      .then(data => setOffers(data.filter(o => !o.valid_until || new Date(o.valid_until) > new Date()).slice(0, 4)))
      .catch(() => {});
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Guest';

  return (
    <div className="min-h-screen bg-[#F4F4F6] animate-fade-in">
      <CustomerNavbar />

      <main className="pt-[80px]">
        {/* Hero Banner */}
        <section className="relative w-full h-[75vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=80"
            alt="Luxury Salon"
            className="w-full h-full object-cover"
          />
          {/* Gold overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-[rgba(201,168,76,0.15)]" />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24">
            <div className="animate-fade-in">
              <div className="font-body text-[12px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4">Welcome back</div>
              <h1 className="font-heading text-[56px] md:text-[72px] text-white font-bold leading-tight mb-4 max-w-2xl">
                {firstName},<br />Look Stunning.
              </h1>
              <p className="font-body text-[16px] text-white/70 mb-8 max-w-md leading-relaxed">
                Experience luxury grooming tailored to your unique style at L'Atelier.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/appointments')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A84C] text-white font-body font-bold text-[14px] rounded-[8px] hover:bg-[#b5943b] shadow-[0_4px_20px_rgba(201,168,76,0.5)] transition-all hover:scale-[1.02] uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  Book Now
                </button>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-body font-bold text-[14px] rounded-[8px] border border-white/30 hover:bg-white/20 transition-all uppercase tracking-wider"
                >
                  View Services
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F4F4F6] to-transparent pointer-events-none" />
        </section>

        {/* Features Strip */}
        <section className="bg-[#1C1C1E] px-12 py-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'verified', text: 'Certified Stylists' },
              { icon: 'spa', text: 'Luxury Products' },
              { icon: 'schedule', text: 'Flexible Booking' },
              { icon: 'star', text: 'Premium Service' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#C9A84C] text-[22px]">{f.icon}</span>
                <span className="font-body text-[13px] text-white/80 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="px-8 md:px-16 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="font-body text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-2">Our Expertise</div>
              <h2 className="font-heading text-[36px] font-bold text-[#1A1A1A]">Featured Services</h2>
            </div>
            <button onClick={() => navigate('/services')} className="inline-flex items-center gap-2 text-[#C9A84C] font-body text-[14px] font-bold hover:gap-3 transition-all">
              View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {services.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Artisanal Hair Sculpting',
                  desc: 'A bespoke cutting experience tailored to your facial structure and personal style.',
                  price: 2500,
                  icon: 'content_cut',
                },
                {
                  title: 'Radiance Facial',
                  desc: 'Advanced oxygen-infused hydration therapy for a luminous, rested complexion.',
                  price: 3500,
                  icon: 'spa',
                },
                {
                  title: 'Noir Beard Grooming',
                  desc: 'The ultimate ritual featuring hot towel service, razor detailing, and oil treatment.',
                  price: 1800,
                  icon: 'face',
                },
              ].map(s => (
                <div key={s.title} className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-52 bg-gradient-to-br from-[#FEF9ED] to-[#E8D9A0] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#C9A84C] text-[64px]">{s.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-[18px] font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
                    <p className="font-body text-[13px] text-[#6B6B6B] leading-relaxed mb-4">{s.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-[20px] font-bold text-[#C9A84C]">${s.price}</span>
                      <button onClick={() => navigate('/appointments')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C9A84C] text-white rounded-[6px] text-[13px] font-bold hover:bg-[#b5943b] transition-all">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map(s => {
                const imgSrc = s.image_url || s.imageUrl;
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const fullImg = imgSrc ? (imgSrc.startsWith('/') ? `${API_BASE}${imgSrc}` : imgSrc) : null;
                return (
                  <div key={s.id} className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-52 bg-gradient-to-br from-[#FEF9ED] to-[#E8D9A0] flex items-center justify-center overflow-hidden">
                      {fullImg
                        ? <img src={fullImg} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <span className="material-symbols-outlined text-[#C9A84C] text-[64px]">content_cut</span>
                      }
                    </div>
                    <div className="p-6">
                      {s.category && (
                        <span className="px-2.5 py-0.5 bg-[#FEF9ED] border border-[#E8D9A0] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">
                          {s.category}
                        </span>
                      )}
                      <h3 className="font-heading text-[18px] font-bold text-[#1A1A1A] mb-2">{s.name}</h3>
                      <p className="font-body text-[13px] text-[#6B6B6B] leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-[20px] font-bold text-[#C9A84C]">${s.price}</span>
                        <button onClick={() => navigate('/appointments')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C9A84C] text-white rounded-[6px] text-[13px] font-bold hover:bg-[#b5943b] transition-all">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Active Offers Section */}
        {offers.length > 0 && (
          <section className="px-8 md:px-16 pb-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="font-body text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-2">Exclusive Deals</div>
                <h2 className="font-heading text-[36px] font-bold text-[#1A1A1A]">Active Offers</h2>
              </div>
              <button onClick={() => navigate('/offers')} className="inline-flex items-center gap-2 text-[#C9A84C] font-body text-[14px] font-bold hover:gap-3 transition-all">
                See All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin">
              {offers.map(offer => {
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const imgSrc = offer.image_url ? (offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url) : null;
                return (
                  <div key={offer.id} className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-t-4 border-[#C9A84C] min-w-[280px] max-w-[280px] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200">
                    <div className="h-36 bg-gradient-to-br from-[#FEF9ED] to-[#E8D9A0] relative flex items-center justify-center overflow-hidden">
                      {imgSrc
                        ? <img src={imgSrc} alt={offer.title} className="w-full h-full object-cover" />
                        : <span className="material-symbols-outlined text-[#C9A84C] text-[48px] opacity-40">local_offer</span>
                      }
                      {offer.discount_percent > 0 && (
                        <div className="absolute top-2 left-2 bg-[#C9A84C] text-white font-bold text-[16px] px-2.5 py-0.5 rounded-[4px]">
                          {offer.discount_percent}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-[15px] font-bold text-[#1A1A1A] mb-1">{offer.title}</h3>
                      <p className="font-body text-[12px] text-[#6B6B6B] line-clamp-2 mb-3">{offer.description}</p>
                      <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B]">
                        <span className="material-symbols-outlined text-[14px] text-[#C9A84C]">event</span>
                        {offer.valid_until ? `Until ${new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Limited time'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* My Appointments Quick CTA */}
        <section className="mx-8 md:mx-16 mb-16 rounded-[10px] overflow-hidden relative">
          <div className="absolute inset-0 bg-[#1C1C1E]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-10 md:p-12">
            <div>
              <div className="font-body text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-2">Manage</div>
              <h2 className="font-heading text-[32px] font-bold text-white mb-2">Your Appointments</h2>
              <p className="font-body text-[14px] text-white/60">View, manage and track all your upcoming and past bookings.</p>
            </div>
            <button onClick={() => navigate('/appointments')} className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A84C] text-white font-body font-bold text-[14px] rounded-[8px] hover:bg-[#b5943b] shadow-[0_4px_20px_rgba(201,168,76,0.4)] transition-all hover:scale-[1.02] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              My Appointments
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1C1C1E] px-12 py-12 text-center">
          <div className="font-heading text-[28px] text-[#C9A84C] tracking-widest uppercase mb-6">L'Atelier</div>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
              <a key={l} href="#" className="font-body text-[13px] text-white/50 hover:text-[#C9A84C] transition-colors">{l}</a>
            ))}
          </div>
          <p className="font-body text-[12px] text-white/30">© 2024 L'Atelier. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}