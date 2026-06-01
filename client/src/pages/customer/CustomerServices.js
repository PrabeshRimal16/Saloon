import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerServices() {
  const [services, setServices] = useState([]);
  const { user } = useAuth();
  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
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
    setBookingPhone('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return alert('You must be signed in to book.');
    if (!bookingDate) return alert('Please choose a date/time.');
    setBookingLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, service_id: bookingService.id, appointment_date: bookingDate, phone: bookingPhone })
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

      <main className="pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="px-gutter max-w-container-max-width mx-auto mb-16 md:mb-24">
          <div className="max-w-3xl">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-[0.3em] mb-4 block">Curated Excellence</span>
            <h1 className="font-headline-xl text-headline-xl mb-6">Our Services</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Experience the pinnacle of personal grooming. Each service at L'Atelier is a bespoke journey of transformation, blending traditional artistry with modern precision.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-gutter max-w-container-max-width mx-auto mb-12 flex flex-wrap gap-4">
          <button className="px-8 py-2 border border-primary bg-primary text-white font-label-md text-label-md transition-all">All Services</button>
          <button className="px-8 py-2 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-label-md text-label-md transition-all">Hair Sculpting</button>
          <button className="px-8 py-2 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-label-md text-label-md transition-all">Facial Therapy</button>
          <button className="px-8 py-2 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-label-md text-label-md transition-all">Nail Artistry</button>
          <button className="px-8 py-2 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-label-md text-label-md transition-all">Grooming</button>
        </section>

        {/* Services Grid */}
        <section className="px-gutter max-w-container-max-width mx-auto pb-section-gap-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {services.map((s, idx) => {
              const API_BASE = process.env.REACT_APP_API_URL || '';
              const imgSrc = s.image_url && s.image_url.startsWith('/') ? `${API_BASE}${s.image_url}` : (s.image_url || s.imageUrl || '');
              return (
                <div key={s.id || idx} className="service-card group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                    <img alt={s.name} className="w-full h-full object-cover transition-transform duration-700 ease-out" src={imgSrc} />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-headline-md text-headline-md">{s.name}</h3>
                    <span className="font-label-md text-label-md text-secondary mt-2">${Number(s.price || 0).toFixed(2)}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                    {s.description}
                  </p>
                  <button onClick={()=>handleBook(s)} className="btn btn-primary w-full mt-auto">Book Now</button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Signature Experience Banner */}
        <section className="bg-surface-container py-section-gap-desktop overflow-hidden">
          <div className="px-gutter max-w-container-max-width mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square border border-outline-variant/20 p-8">
                <img alt="The Atelier Interior" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9kFzYMVEJTkyCBlinp0fmnmgRaWmCKBkh3zQtuhzmR_9j8jzP9QaUxni_sSJBzGbTOM3Cnt9IPnbbbOr2_3jGBMwgv7jqtxulPav6mbU96vnooL_4UcSWtOyTVjqYnLBL6aPH_XyjIlo4NYtDM_TASLwSf1tC5NEMpfNpXZ1mYY9gS73aMPphePtSxtBuYeGPcjsA01nr9FlBP0WlNWoA64fl1UHaNQmrjecVOB1MpjI-9D2k6V8LXtafJmdqiwSrEQR6rA6mFovG" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary-container flex items-center justify-center p-6 hidden lg:flex">
                <p className="font-headline-md text-primary text-center leading-tight">Private Suites Available</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="font-headline-lg text-headline-lg mb-8">The Signature Atelier Experience</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                Every appointment includes a complimentary consultation, a selection of artisanal teas or champagne, and access to our private relaxation lounge. We don't just provide services; we curate moments of absolute refinement.
              </p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-4 font-label-md text-label-md">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  Complimentary Scalp Analysis
                </li>
                <li className="flex items-center gap-4 font-label-md text-label-md">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  Personal Style Portfolio
                </li>
                <li className="flex items-center gap-4 font-label-md text-label-md">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  Post-Treatment Maintenance Plan
                </li>
              </ul>
              <a className="inline-block px-12 py-5 bg-primary text-white font-label-md text-label-md uppercase tracking-[0.2em] hover:bg-on-surface-variant transition-colors" href="#">Book Your Journey</a>
            </div>
          </div>
        </section>
      </main>

        {/* Booking Modal */}
        {bookingService && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded max-w-md w-full">
              <h3 className="font-headline-md text-headline-md mb-4">Book: {bookingService.name}</h3>
              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm text-outline mb-1">Date &amp; Time</label>
                  <input value={bookingDate} onChange={e=>setBookingDate(e.target.value)} type="datetime-local" className="w-full border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-outline mb-1">Phone</label>
                  <input value={bookingPhone} onChange={e=>setBookingPhone(e.target.value)} type="text" className="w-full border px-3 py-2" placeholder="Optional contact number" />
                </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={()=>setBookingService(null)} className="btn">Cancel</button>
                    <button disabled={bookingLoading} type="submit" className="btn btn-primary">{bookingLoading? 'Booking...' : 'Confirm Booking'}</button>
                  </div>
              </form>
            </div>
          </div>
        )}

      {/* Footer */}
      <footer className="w-full py-section-gap-mobile md:py-section-gap-desktop px-gutter flex flex-col items-center justify-center gap-base text-center bg-surface border-t border-outline-variant/20">
        <span className="font-headline-lg text-headline-lg text-primary uppercase mb-8">L'Atelier</span>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Privacy Policy</a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Terms of Service</a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Career</a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Contact Us</a>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-8">Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.</p>
        <span className="font-label-sm text-label-sm text-outline">© 2024 L'Atelier Modern. All Rights Reserved.</span>
      </footer>
    </>
  );
}
