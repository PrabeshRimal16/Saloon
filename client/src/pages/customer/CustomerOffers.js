import { useState, useEffect, useCallback } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';

/* ──────────────────────────────────────────────
   Offers & Rituals Page Component
   ────────────────────────────────────────────── */
const OffersAndRitualsPage = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [lastChecked, setLastChecked] = useState(
    localStorage.getItem("lastCheckedOffers") || new Date().toISOString()
  );

  /* ── Fetch offers from API ──────────── */
  useEffect(() => {
    fetchOffers();
    // Check for updates every 10 seconds
    const interval = setInterval(fetchOffers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/offers`);
      const data = await response.json();
      
      // Check for new offers
      const newOffers = data.filter(
        (offer) => new Date(offer.created_at) > new Date(lastChecked)
      );
      
      if (newOffers.length > 0) {
        addNotification(
          "success",
          `New offer added: "${newOffers[0].title}"! 🎉`
        );
        localStorage.setItem("lastCheckedOffers", new Date().toISOString());
        setLastChecked(new Date().toISOString());
      }
      
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Add Notification ──
  const addNotification = (type, message) => {
    const id = Date.now();
    const newNotification = { id, type, message, timestamp: new Date() };
    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== id)
      );
    }, 5000);
  };

  /* ── Reveal on scroll ─────────────── */
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal-up");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  /* ── Promo code click-to-select ───── */
  useEffect(() => {
    const handlePromoClick = function () {
      const range = document.createRange();
      range.selectNodeContents(this);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const promoElements = document.querySelectorAll(".select-all");
    promoElements.forEach((el) => el.addEventListener("click", handlePromoClick));

    return () => {
      promoElements.forEach((el) => el.removeEventListener("click", handlePromoClick));
    };
  }, []);

  /* ── Event handlers ───────────────── */
  const handleLogout = useCallback(() => {
    console.log("Logout clicked");
    // Add real logout logic here
  }, []);

  const handleNotifications = useCallback(() => {
    console.log("Notifications clicked");
  }, []);

  const handleBookWithCode = useCallback((code) => {
    console.log(`Booking with code: ${code}`);
  }, []);

  const handleClaimOffer = useCallback((code) => {
    console.log(`Claiming offer: ${code}`);
  }, []);

  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    console.log(`Newsletter signup: ${email}`);
    e.target.reset();
  }, []);

  /* ── Generate promo code from offer title ───---- */
  const generatePromoCode = (title) => {
    return title
      .substring(0, 3)
      .toUpperCase()
      .replace(/\s+/g, "") + Math.floor(Math.random() * 100);
  };

  /* ── Main render ──────────────────── */
  return (
    <div className="bg-[#FBF8F2] text-[#1A1A1A] font-sans overflow-x-hidden min-h-screen">
      <CustomerNavbar />

      {/* ── Notification Toast ── */}
      <div className="fixed top-20 right-8 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-6 py-3 rounded-lg text-white font-medium shadow-lg animate-slide-in ${
              notif.type === "success"
                ? "bg-green-500"
                : notif.type === "error"
                ? "bg-red-500"
                : "bg-[#1A1A1A]"
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      <main className="pt-[80px]">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A] text-white px-8">
          <div className="absolute inset-0 opacity-40">
            <img
              alt="Luxury salon interior with marble floors and gold accents"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFgTsgLYfeldGjA3vrpUR32nuKY8-uTfk2w5uCWfMssuav3r3veGS6KpdQArnXFtpvx9yomiCwim7u_XYd2BDbUQxoxY9pp6GELg7IAUwGTPrTxPB2B2jzuA4R0iVlnjaUhelCS8zUpRce91F1cNW0tVuSYVONmISDMGeBMR40Y-rEBIySnXwIeY4EYuoNFI-YHeOMrhsDujMLscv8WDR73UnddeMQ1sSFsiAJSkBqkYantwV4BcJHYaMTFXtM-M0tR1r_yYaBCZZO"
            />
          </div>
          <div className="relative z-10 text-center max-w-3xl reveal-up active">
            <span className="text-sm uppercase tracking-[0.3em] text-[#C9A84C] mb-6 block font-medium">
              Curated Experiences
            </span>
            <h1 className="font-serif text-5xl md:text-[80px] mb-8 leading-tight">
              Exclusive Rituals &amp; Seasonal Offers
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Step into a world of bespoke beauty. Our seasonal rituals are designed to harmonize your inner glow with the rhythms of the season, utilizing the finest products and artisanal techniques.
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading offers...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No offers available at this time.</p>
              </div>
            ) : (
              offers.map((offer, index) => {
                const discountPercent = offer.discount_percent || 0;
                const promoCode = generatePromoCode(offer.title);
                const isExpired =
                  offer.valid_until &&
                  new Date(offer.valid_until) < new Date();

                return (
                  <div
                    key={offer.id}
                    className="group reveal-up active flex flex-col h-full bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden mb-6 shrink-0 bg-[#FBF8F2] aspect-[3/4] flex items-center justify-center">
                      {offer.image_url ? (
                        <img
                          src={offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url}
                          alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-[#C9A84C]/50">
                          local_offer
                        </span>
                      )}
                      {isExpired && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg uppercase tracking-widest">EXPIRED</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow space-y-4 px-6 pb-6">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-2xl flex-1 text-[#1A1A1A]">
                          {offer.title}
                        </h3>
                        {discountPercent > 0 && (
                          <span className="bg-[#C9A84C] text-white px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-sm ml-4">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 flex-grow line-clamp-3">
                        {offer.description}
                      </p>
                      <div className="pt-4 flex flex-col gap-2 border-t border-gray-200 shrink-0">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="uppercase tracking-widest text-gray-500">
                            Valid Until
                          </span>
                          <span className="text-[#1A1A1A] font-semibold">
                            {offer.valid_until
                              ? new Date(
                                  offer.valid_until
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                })
                              : "ONGOING"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="uppercase tracking-widest text-gray-500">
                            Promo Code
                          </span>
                          <span className="text-[#C9A84C] font-bold select-all cursor-pointer hover:underline">
                            {promoCode}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full py-4 mt-4 border border-[#1A1A1A] text-sm font-medium uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                        onClick={() =>
                          handleBookWithCode(promoCode)
                        }
                        disabled={isExpired}
                      >
                        {isExpired ? "Offer Expired" : "Book with Code"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Signature Section */}
        <section className="bg-white py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2 reveal-up active">
                <h2 className="font-serif text-4xl mb-8 text-[#1A1A1A]">The L'Atelier Distinction</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-[#1A1A1A] flex items-center justify-center rounded-sm">
                      <span className="material-symbols-outlined text-[#C9A84C]">content_cut</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-2 text-[#1A1A1A]">Master Artistry</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Every professional in our atelier is a certified master, trained in the latest global trends and classic techniques.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-[#1A1A1A] flex items-center justify-center rounded-sm">
                      <span className="material-symbols-outlined text-[#C9A84C]">star</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-2 text-[#1A1A1A]">Premium Curations</h4>
                      <p className="text-gray-600 leading-relaxed">
                        We partner exclusively with luxury brands like Oribe and Valmont to ensure the highest standard of care.
                      </p>
                    </div>
                  </div>
                </div>
                <button className="mt-12 group flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C9A84C] transition-colors">
                  Explore All Services
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </div>
              <div className="md:w-1/2 relative reveal-up active" style={{ transitionDelay: "200ms" }}>
                <div className="aspect-square bg-white p-4 border border-gray-200 relative z-10 shadow-lg">
                  <img
                    alt="Stylist working on a client's hair in a luxurious salon"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDro275hAAxz423Kgd4GlH6M7jOMSK6GPC0Jg4Yz1aia0_u4_GUNSARLN7ZBC7v1Ezyt0-Kl84OfsfalA156aHJuM2LXdnOvx17Yr7SV6lixInrsEOWIQJIPsOIAgIgUNjU_NuZyE9h4R7eU5EA2jvImZ-pT_fTGu4CEIkjV3MAKcwjwAwqqPx95vmvzI8N8MB3C8iGCo_1uYSRjIAGAMcyqk5S4zUkoVFy9dH1ArsgMneOsScRnRtITQGe8jcpW7b09vjHUyIPDUY_"
                  />
                </div>
                <div className="absolute -top-12 -right-12 w-64 h-64 border-t border-r border-[#C9A84C]/40 -z-0"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24 bg-[#1A1A1A] text-white text-center px-8">
          <div className="max-w-2xl mx-auto reveal-up active">
            <h2 className="font-serif text-4xl mb-6">Stay in the Circle</h2>
            <p className="text-lg text-white/70 mb-10">
              Receive exclusive early access to our seasonal rituals and private salon events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleNewsletterSubmit}>
              <input
                className="flex-grow bg-transparent border-b border-white/30 focus:border-[#C9A84C] py-4 outline-none text-base text-white placeholder:text-white/40 transition-colors"
                placeholder="Your Email Address"
                type="email"
                name="email"
                required
              />
              <button
                className="bg-[#C9A84C] text-white px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#b59642] transition-colors rounded-sm"
                type="submit"
              >
                Join Now
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-8 flex flex-col items-center justify-center gap-8 text-center bg-[#FBF8F2] border-t border-gray-200">
        <span className="font-serif text-3xl text-[#1A1A1A] uppercase tracking-widest">L'Atelier</span>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">Privacy Policy</a>
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">Terms of Service</a>
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">Career</a>
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">Contact Us</a>
        </div>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <span className="text-xs text-gray-400 tracking-widest uppercase mt-4">© 2024 L'Atelier Modern. All Rights Reserved.</span>
      </footer>

      {/* ── Inject Styles ── */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OffersAndRitualsPage;`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OffersAndRitualsPage;