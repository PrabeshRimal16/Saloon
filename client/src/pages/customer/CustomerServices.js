import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerServices() {
  const [services, setServices] = useState([]);
  const { user } = useAuth();
  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('py-2', 'shadow-sm');
        nav.classList.remove('py-4');
      } else {
        nav.classList.add('py-4');
        nav.classList.remove('py-2', 'shadow-sm');
      }
    };

    window.addEventListener('scroll', onScroll);

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const cards = Array.from(document.querySelectorAll('.service-card'));
    cards.forEach((card, index) => {
      card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      card.style.transitionDelay = `${index * 100}ms`;
      observer.observe(card);
    });

    // initial nav state
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/services`)
      .then(r => r.json())
      .then(data => setServices(data))
      .catch(err => console.error('Failed to load services', err));
  }, []);

  const handleBook = (service) => {
    setBookingService(service);
    setBookingDate('');
    setBookingTime('');
    setBookingPhone('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return alert('You must be signed in to book.');
    if (!bookingDate || !bookingTime) return alert('Please choose a date and time.');
    setBookingLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id, 
          service_id: bookingService.id, 
          appointment_date: bookingDate, 
          appointment_time: bookingTime, 
          phone: bookingPhone 
        })
      });
      if (!res.ok) {
        const text = await res.text();
        alert('Booking failed: ' + text);
      } else {
        const created = await res.json();
        alert('Booking created!');
        setBookingService(null);
      }
    } catch (err) {
      console.error('Booking error', err);
      alert('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <CustomerNavbar />

      <main className="pt-[80px] bg-[#FBF8F2] min-h-screen">
        {/* Hero Section */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto py-16">
          <div className="max-w-3xl">
            <span className="font-sans text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4 block font-bold">Curated Excellence</span>
            <h1 className="font-['Playfair_Display'] text-[48px] md:text-[64px] font-bold text-[#1A1A1A] mb-6 leading-tight">Our Services</h1>
            <p className="font-sans text-[16px] text-[#6B6B6B] leading-relaxed max-w-2xl">
              Experience the pinnacle of personal grooming. Each service at L'Atelier is a bespoke journey of transformation, blending traditional artistry with modern precision.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto mb-12 flex flex-wrap gap-4">
          <button className="px-6 py-2 border border-[#C9A84C] bg-[#C9A84C] text-white font-sans text-[13px] font-bold uppercase tracking-wider rounded-[6px] transition-all">All Services</button>
          <button className="px-6 py-2 border border-[#EDE8DC] hover:border-[#C9A84C] text-[#6B6B6B] hover:text-[#C9A84C] font-sans text-[13px] font-bold uppercase tracking-wider rounded-[6px] transition-all">Hair Sculpting</button>
          <button className="px-6 py-2 border border-[#EDE8DC] hover:border-[#C9A84C] text-[#6B6B6B] hover:text-[#C9A84C] font-sans text-[13px] font-bold uppercase tracking-wider rounded-[6px] transition-all">Facial Therapy</button>
          <button className="px-6 py-2 border border-[#EDE8DC] hover:border-[#C9A84C] text-[#6B6B6B] hover:text-[#C9A84C] font-sans text-[13px] font-bold uppercase tracking-wider rounded-[6px] transition-all">Nail Artistry</button>
          <button className="px-6 py-2 border border-[#EDE8DC] hover:border-[#C9A84C] text-[#6B6B6B] hover:text-[#C9A84C] font-sans text-[13px] font-bold uppercase tracking-wider rounded-[6px] transition-all">Grooming</button>
        </section>

        {/* Services Grid */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, idx) => {
              const API_BASE = process.env.REACT_APP_API_URL || '';
              const imgSrc = s.image_url && s.image_url.startsWith('/') ? `${API_BASE}${s.image_url}` : (s.image_url || s.imageUrl || '');
              return (
                <div key={s.id || idx} className="service-card group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#FEF9ED] to-[#E8D9A0] flex items-center justify-center">
                    {imgSrc ? (
                      <img alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src={imgSrc} />
                    ) : (
                      <span className="material-symbols-outlined text-[#C9A84C] text-[64px]">spa</span>
                    )}
                    <div className="absolute inset-0 bg-[#C9A84C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    {s.category && (
                      <span className="px-2.5 py-0.5 bg-[#FEF9ED] border border-[#E8D9A0] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block self-start">
                        {s.category}
                      </span>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1A1A1A]">{s.name}</h3>
                      <span className="font-['Playfair_Display'] text-[20px] font-bold text-[#C9A84C]">${Number(s.price || 0).toFixed(2)}</span>
                    </div>
                    <p className="font-sans text-[13px] text-[#6B6B6B] mb-6 line-clamp-2 flex-grow leading-relaxed">
                      {s.description}
                    </p>
                    <button onClick={()=>handleBook(s)} className="inline-flex justify-center items-center gap-1.5 px-4 py-3 bg-[#C9A84C] text-white rounded-[6px] text-[13px] font-bold hover:bg-[#b5943b] transition-all uppercase tracking-wider w-full">
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Signature Experience Banner */}
        <section className="bg-[#1C1C1E] py-24 overflow-hidden relative">
          <div className="px-8 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square p-4 bg-white/5 rounded-[12px] backdrop-blur-sm border border-white/10">
                <img alt="The Atelier Interior" className="w-full h-full object-cover rounded-[8px]" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#C9A84C] rounded-[12px] flex items-center justify-center p-6 hidden lg:flex shadow-2xl">
                <p className="font-['Playfair_Display'] text-white text-[20px] font-bold text-center leading-tight">Private Suites Available</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="font-sans text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4 font-bold">Unparalleled Luxury</div>
              <h2 className="font-['Playfair_Display'] text-[40px] font-bold text-white mb-6">The Signature Atelier Experience</h2>
              <p className="font-sans text-[16px] text-white/70 mb-8 leading-relaxed">
                Every appointment includes a complimentary consultation, a selection of artisanal teas or champagne, and access to our private relaxation lounge. We don't just provide services; we curate moments of absolute refinement.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4 font-sans text-[14px] font-bold text-white/90">
                  <span className="material-symbols-outlined text-[#C9A84C]">check_circle</span>
                  Complimentary Scalp Analysis
                </li>
                <li className="flex items-center gap-4 font-sans text-[14px] font-bold text-white/90">
                  <span className="material-symbols-outlined text-[#C9A84C]">check_circle</span>
                  Personal Style Portfolio
                </li>
                <li className="flex items-center gap-4 font-sans text-[14px] font-bold text-white/90">
                  <span className="material-symbols-outlined text-[#C9A84C]">check_circle</span>
                  Post-Treatment Maintenance Plan
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

        {/* Booking Modal */}
        {bookingService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[12px] max-w-md w-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] animate-[fadeIn_0.2s_ease-in]">
              <div className="flex items-center justify-between mb-6 border-b border-[#EDE8DC] pb-4">
                <div>
                  <h3 className="font-['Playfair_Display'] text-[24px] font-bold text-[#1A1A1A]">Book Appointment</h3>
                  <p className="font-sans text-[13px] text-[#6B6B6B] mt-1">{bookingService.name}</p>
                </div>
                <button onClick={()=>setBookingService(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#6B6B6B] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <form onSubmit={submitBooking} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Date *</label>
                    <input required value={bookingDate} onChange={e=>setBookingDate(e.target.value)} type="date" className="w-full bg-[#FAFAF8] border border-[#EDE8DC] rounded-[6px] px-4 py-2.5 text-[14px] focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Time *</label>
                    <input required value={bookingTime} onChange={e=>setBookingTime(e.target.value)} type="time" className="w-full bg-[#FAFAF8] border border-[#EDE8DC] rounded-[6px] px-4 py-2.5 text-[14px] focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Phone Number (Optional)</label>
                  <input value={bookingPhone} onChange={e=>setBookingPhone(e.target.value)} type="tel" className="w-full bg-[#FAFAF8] border border-[#EDE8DC] rounded-[6px] px-4 py-2.5 text-[14px] focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] outline-none transition-all" placeholder="Enter contact number" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE8DC] mt-6">
                  <button type="button" onClick={()=>setBookingService(null)} className="px-5 py-2.5 rounded-[6px] text-[#6B6B6B] font-bold text-[13px] hover:bg-[#F5F5F5] transition-colors">Cancel</button>
                  <button disabled={bookingLoading} type="submit" className="px-6 py-2.5 bg-[#C9A84C] text-white rounded-[6px] text-[13px] font-bold hover:bg-[#b5943b] transition-all uppercase tracking-wider disabled:opacity-50">
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Footer */}
      <footer className="bg-[#1C1C1E] px-12 py-12 text-center">
        <div className="font-['Playfair_Display'] text-[28px] text-[#C9A84C] tracking-widest uppercase mb-6">L'Atelier</div>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {['Privacy Policy', 'Terms of Service', 'Career', 'Contact Us'].map(l => (
            <a key={l} href="#" className="font-sans text-[13px] text-white/50 hover:text-[#C9A84C] transition-colors">{l}</a>
          ))}
        </div>
        <p className="font-sans text-[14px] text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <p className="font-sans text-[12px] text-white/30">© 2024 L'Atelier Modern. All Rights Reserved.</p>
      </footer>
    </>
  );
}
