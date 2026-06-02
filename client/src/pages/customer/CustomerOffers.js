import { useState, useEffect, useCallback } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';

/* ──────────────────────────────────────────────
   Offers & Rituals Page Component
   ────────────────────────────────────────────── */
const OffersAndRitualsPage = () => {
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
      const response = await fetch("http://localhost:5000/api/offers");
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
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden">
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
                : "bg-blue-500"
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-primary text-on-primary px-gutter">
          <div className="absolute inset-0 opacity-40">
            <img
              alt="Luxury salon interior with marble floors and gold accents"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFgTsgLYfeldGjA3vrpUR32nuKY8-uTfk2w5uCWfMssuav3r3veGS6KpdQArnXFtpvx9yomiCwim7u_XYd2BDbUQxoxY9pp6GELg7IAUwGTPrTxPB2B2jzuA4R0iVlnjaUhelCS8zUpRce91F1cNW0tVuSYVONmISDMGeBMR40Y-rEBIySnXwIeY4EYuoNFI-YHeOMrhsDujMLscv8WDR73UnddeMQ1sSFsiAJSkBqkYantwV4BcJHYaMTFXtM-M0tR1r_yYaBCZZO"
            />
          </div>
          <div className="relative z-10 text-center max-w-3xl reveal-up active">
            <span className="font-label-md text-label-md uppercase tracking-[0.3em] text-secondary-fixed mb-6 block">
              Curated Experiences
            </span>
            <h1 className="font-headline-xl text-headline-xl md:text-[80px] mb-8">
              Exclusive Rituals &amp; Seasonal Offers
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl mx-auto leading-relaxed">
              Step into a world of bespoke beauty. Our seasonal rituals are designed to harmonize your inner glow with the rhythms of the season, utilizing the finest products and artisanal techniques.
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="max-w-container-max-width mx-auto px-gutter py-section-gap-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-on-surface-variant">Loading offers...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-on-surface-variant">No offers available at this time.</p>
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
                    className="group reveal-up active flex flex-col h-full"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden card-img-zoom mb-6 shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 aspect-[3/4] flex items-center justify-center">
                      {offer.image_url ? (
                        <img
                          src={offer.image_url}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-indigo-300">
                          local_offer
                        </span>
                      )}
                      {isExpired && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">EXPIRED</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-headline-md flex-1">
                          {offer.title}
                        </h3>
                        {discountPercent > 0 && (
                          <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <p className="font-body-md text-on-surface-variant flex-grow line-clamp-3">
                        {offer.description}
                      </p>
                      <div className="pt-4 flex flex-col gap-2 border-t border-outline-variant/50 shrink-0">
                        <div className="flex justify-between items-center font-label-sm text-label-sm">
                          <span className="uppercase tracking-widest text-outline">
                            Valid Until
                          </span>
                          <span className="text-primary font-semibold">
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
                        <div className="flex justify-between items-center font-label-sm text-label-sm">
                          <span className="uppercase tracking-widest text-outline">
                            Promo Code
                          </span>
                          <span className="text-secondary font-bold select-all cursor-pointer hover:underline">
                            {promoCode}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full py-4 mt-2 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <section className="bg-surface-container-low py-section-gap-desktop overflow-hidden">
          <div className="max-w-container-max-width mx-auto px-gutter">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2 reveal-up active">
                <h2 className="font-headline-lg text-headline-lg mb-8">The L'Atelier Distinction</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary">content_cut</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md uppercase tracking-widest mb-2">Master Artistry</h4>
                      <p className="text-on-surface-variant">
                        Every professional in our atelier is a certified master, trained in the latest global trends and classic techniques.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary">star</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md uppercase tracking-widest mb-2">Premium Curations</h4>
                      <p className="text-on-surface-variant">
                        We partner exclusively with luxury brands like Oribe and Valmont to ensure the highest standard of care.
                      </p>
                    </div>
                  </div>
                </div>
                <button className="mt-12 group flex items-center gap-4 font-label-md text-label-md uppercase tracking-[0.2em] hover:text-secondary transition-colors">
                  Explore All Services
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </div>
              <div className="md:w-1/2 relative reveal-up active" style={{ transitionDelay: "200ms" }}>
                <div className="aspect-square bg-white p-8 border border-outline-variant/30 relative z-10">
                  <img
                    alt="Stylist working on a client's hair in a luxurious salon"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDro275hAAxz423Kgd4GlH6M7jOMSK6GPC0Jg4Yz1aia0_u4_GUNSARLN7ZBC7v1Ezyt0-Kl84OfsfalA156aHJuM2LXdnOvx17Yr7SV6lixInrsEOWIQJIPsOIAgIgUNjU_NuZyE9h4R7eU5EA2jvImZ-pT_fTGu4CEIkjV3MAKcwjwAwqqPx95vmvzI8N8MB3C8iGCo_1uYSRjIAGAMcyqk5S4zUkoVFy9dH1ArsgMneOsScRnRtITQGe8jcpW7b09vjHUyIPDUY_"
                  />
                </div>
                <div className="absolute -top-12 -right-12 w-64 h-64 border-l border-b border-secondary/30 -z-0"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-section-gap-desktop bg-primary text-on-primary text-center px-gutter">
          <div className="max-w-2xl mx-auto reveal-up active">
            <h2 className="font-headline-lg text-headline-lg mb-6">Stay in the Circle</h2>
            <p className="font-body-lg text-body-lg text-on-primary/70 mb-10">
              Receive exclusive early access to our seasonal rituals and private salon events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleNewsletterSubmit}>
              <input
                className="flex-grow bg-transparent border-b border-on-primary/30 focus:border-secondary-fixed py-4 outline-none font-label-md text-on-primary placeholder:text-on-primary/40 transition-colors"
                placeholder="Your Email Address"
                type="email"
                name="email"
                required
              />
              <button
                className="bg-secondary-fixed text-on-secondary-fixed px-12 py-4 font-label-md text-label-md uppercase tracking-widest hover:opacity-90 transition-opacity"
                type="submit"
              >
                Join Now
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap-mobile md:py-section-gap-desktop px-gutter flex flex-col items-center justify-center gap-base text-center bg-surface border-t border-outline-variant/20">
        <span className="font-headline-lg text-headline-lg text-primary uppercase mb-8">L'Atelier</span>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Privacy Policy</a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Terms of Service</a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Career</a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">Contact Us</a>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-8">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <span className="font-label-sm text-label-sm text-outline">© 2024 L'Atelier Modern. All Rights Reserved.</span>
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

export default OffersAndRitualsPage;