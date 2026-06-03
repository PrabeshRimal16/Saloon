import { useState, useEffect, useCallback } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';

const OffersAndRitualsPage = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [lastChecked] = useState(
    localStorage.getItem("lastCheckedOffers") || new Date().toISOString()
  );

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/offers`);
      const data = await response.json();
      const newOffers = data.filter(
        (offer) => new Date(offer.created_at) > new Date(lastChecked)
      );
      if (newOffers.length > 0) {
        addNotification("success", `New offer added: "${newOffers[0].title}"! 🎉`);
        localStorage.setItem("lastCheckedOffers", new Date().toISOString());
      }
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [{ id, type, message }, ...prev]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const handleBookWithCode = useCallback((code) => {
    console.log(`Booking with code: ${code}`);
    alert(`Code ${code} copied! Use it while booking.`);
  }, []);

  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    alert(`Thank you! ${email} has been added to our list.`);
    e.target.reset();
  }, []);

  const generatePromoCode = (title) => {
    return title.substring(0, 3).toUpperCase().replace(/\s+/g, "") + Math.floor(Math.random() * 900 + 100);
  };

  return (
    <div className="bg-[#FBF8F2] text-[#1A1A1A] font-sans overflow-x-hidden min-h-screen flex flex-col">
      <CustomerNavbar />

      {/* Notification Toasts */}
      <div className="fixed top-24 right-6 z-50 space-y-2 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg pointer-events-auto ${
              notif.type === "success" ? "bg-[#2D7A4F]" : "bg-[#1A1A1A]"
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      <main className="flex-grow pt-[80px]">

        {/* Hero */}
        <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A] text-white px-8">
          <div className="absolute inset-0 opacity-35">
            <img
              alt="Luxury salon interior"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=80"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/60" />
          <div className="relative z-10 text-center max-w-3xl">
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] mb-5 block font-bold">
              Curated Experiences
            </span>
            <h1 className="font-serif text-[48px] md:text-[72px] mb-6 leading-[1.05]">
              Exclusive Rituals &amp; Seasonal Offers
            </h1>
            <p className="text-[16px] text-white/75 max-w-xl mx-auto leading-relaxed">
              Step into a world of bespoke beauty. Our seasonal rituals are designed to harmonize your inner glow with the rhythms of the season.
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-[14px]">Loading exclusive offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-[48px] text-[#C9A84C]/40 mb-4 block">local_offer</span>
              <p className="text-gray-500 font-medium">No offers available at this time. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-14">
                <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-3 font-bold">This Season</div>
                <h2 className="font-serif text-[38px] font-bold text-[#1A1A1A] m-0">Current Rituals &amp; Offers</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map((offer, index) => {
                  const discountPercent = offer.discount_percent || 0;
                  const promoCode = generatePromoCode(offer.title);
                  const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date();

                  return (
                    <div
                      key={offer.id}
                      className={`group flex flex-col bg-white border border-[#EDE8DC] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isExpired ? 'opacity-60' : ''}`}
                      style={{ transitionDelay: `${index * 60}ms` }}
                    >
                      <div className="relative overflow-hidden bg-[#FEF9ED] h-56 flex items-center justify-center shrink-0">
                        {offer.image_url ? (
                          <img
                            src={offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[56px] text-[#C9A84C]/40">local_offer</span>
                        )}
                        {isExpired && (
                          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                            <span className="text-white font-bold text-sm uppercase tracking-[0.2em] bg-black/40 px-4 py-2 rounded">Expired</span>
                          </div>
                        )}
                        {discountPercent > 0 && !isExpired && (
                          <div className="absolute top-3 left-3 bg-[#C9A84C] text-white font-bold text-[13px] px-3 py-1 rounded">
                            {discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-grow p-6 gap-3">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-serif text-[20px] text-[#1A1A1A] leading-tight">{offer.title}</h3>
                        </div>
                        <p className="text-[13px] text-gray-500 leading-relaxed flex-grow line-clamp-3">{offer.description}</p>

                        <div className="border-t border-[#EDE8DC] pt-4 mt-2 space-y-2.5">
                          <div className="flex justify-between items-center text-[12px]">
                            <span className="uppercase tracking-widest text-gray-400 font-semibold">Valid Until</span>
                            <span className="text-[#1A1A1A] font-bold">
                              {offer.valid_until
                                ? new Date(offer.valid_until).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                : "ONGOING"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[12px]">
                            <span className="uppercase tracking-widest text-gray-400 font-semibold">Promo Code</span>
                            <span
                              className="text-[#C9A84C] font-bold cursor-pointer hover:underline select-all tracking-wider"
                              title="Click to select"
                            >
                              {promoCode}
                            </span>
                          </div>
                        </div>

                        <button
                          className={`w-full py-3.5 mt-1 text-[12px] font-bold uppercase tracking-widest rounded transition-all duration-300 ${
                            isExpired
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                          }`}
                          onClick={() => !isExpired && handleBookWithCode(promoCode)}
                          disabled={isExpired}
                        >
                          {isExpired ? "Offer Expired" : "Book with Code"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Distinction Section */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4 font-bold">Why Choose Us</div>
                <h2 className="font-serif text-[38px] font-bold text-[#1A1A1A] mb-8 m-0">The L'Atelier Distinction</h2>
                <div className="space-y-8">
                  {[
                    { icon: 'content_cut', title: 'Master Artistry', desc: 'Every professional in our atelier is a certified master, trained in the latest global trends and classic techniques.' },
                    { icon: 'star', title: 'Premium Curations', desc: 'We partner exclusively with luxury brands like Oribe and Valmont to ensure the highest standard of care.' },
                    { icon: 'spa', title: 'Holistic Experience', desc: 'From arrival to departure, every touchpoint is designed to indulge your senses and restore your spirit.' },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-5">
                      <div className="w-11 h-11 flex-shrink-0 bg-[#1A1A1A] flex items-center justify-center rounded">
                        <span className="material-symbols-outlined text-[#C9A84C] text-[20px]">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-1.5 text-[#1A1A1A]">{item.title}</h4>
                        <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="aspect-square bg-white p-3 border border-[#EDE8DC] relative z-10 shadow-lg rounded-xl overflow-hidden">
                  <img
                    alt="Stylist working in luxury salon"
                    className="w-full h-full object-cover rounded-lg"
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                  />
                </div>
                <div className="absolute -top-8 -right-8 w-48 h-48 border border-[#C9A84C]/30 rounded-xl -z-0" />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 bg-[#1A1A1A] text-white text-center px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4 font-bold">Join The Circle</div>
            <h2 className="font-serif text-[38px] font-bold mb-4 m-0">Stay in the Know</h2>
            <p className="text-[15px] text-white/60 mb-10 leading-relaxed">
              Receive exclusive early access to our seasonal rituals and private salon events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleNewsletterSubmit}>
              <input
                className="flex-grow bg-transparent border-b border-white/30 focus:border-[#C9A84C] py-3 outline-none text-base text-white placeholder:text-white/40 transition-colors"
                placeholder="Your Email Address"
                type="email"
                name="email"
                required
              />
              <button
                className="bg-[#C9A84C] text-white px-10 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-[#b59642] transition-colors rounded"
                type="submit"
              >
                Join Now
              </button>
            </form>
          </div>
        </section>

      </main>

      <CustomerFooter />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default OffersAndRitualsPage;