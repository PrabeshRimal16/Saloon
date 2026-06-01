import { useState, useEffect, useCallback } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';

/* ──────────────────────────────────────────────
   Offers & Rituals Page Component
   ────────────────────────────────────────────── */
const OffersAndRitualsPage = () => {
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

  /* ── Offer data ───────────────────── */
  const offers = [
    {
      id: "summer-glow",
      title: "Summer Glow Ritual",
      description:
        "A restorative 90-minute treatment including a signature gold-leaf facial, silk protein hair mask, and a refreshing chilled prosecco reception. Perfect for rehydrating after sun exposure.",
      badge: "20% OFF",
      badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
      validUntil: "AUG 31, 2024",
      promoCode: "GLOW20",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnTudoU8gg9okU4SQSHG1-eNziJzyrD_0c08-24AgB9Fk56eu61-OyYckI-Yo_LsDAFK17D6MbDPLbxSSKFiJELxNP7uXD2zsVX7_JYNQ-KQfiB7ipEB5uThbjsMxENL1mlKxAlL7cVVUfBOjcHCj4Wy5UGiM798-1KoyORteJ9LGSAIpg9Kkcw3Cgdm-SYJMtMDPOojNUGFVjVO7etasDp3wC-k4yq-e61cO_m8k1AtcVwyBajy3woorg8GSvCBEcY4PEMUS8y4L6",
      imageAlt: "A close-up photograph of a luxury 24-karat gold leaf facial treatment being applied...",
      actionLabel: "Book with Code",
      onAction: () => handleBookWithCode("GLOW20"),
    },
    {
      id: "welcome-ritual",
      title: "The Welcome Ritual",
      description:
        "An exclusive introduction to L'Atelier excellence. First-time guests receive a complimentary stylistic consultation and a $50 credit toward any master-level color or styling service.",
      badge: "$50 CREDIT",
      badgeClass: "bg-primary text-on-primary",
      validUntil: "DEC 31, 2024",
      promoCode: "WELCOME50",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCVyZNUnyAS7tworS13M1P9pYAYYHFGkYmDxq4U0ginA_inM0Eq_99cgR4U96YylPDmfb9jl7jYZUQoPQhURfrSa8sshBNR2lprpio9LXAkJyNIlt9CxS7D4b4FQ8TmNXQ3MfgMYOoS3DxRq1h6emUYICMb5AAkRGYFXozfL6GHxnhWz4dJOFqiTe6T78bnYWwz7RwBzkCPcLAU0vlUIzArOPpps_3Yypl8COFH_oJ7vQ2Ek4QlQI9iR2esNrnoj294EkDS7NNBTc5Z",
      imageAlt: "A high-fashion portrait of a woman with perfectly styled, voluminous hair...",
      actionLabel: "Claim Offer",
      onAction: () => handleClaimOffer("WELCOME50"),
    },
    {
      id: "weekend-solstice",
      title: "Weekend Solstice",
      description:
        "Transform your Friday or Saturday appointment. Book any full-service color and receive a complimentary upgrade to our Oribe Gold Lust restorative treatment and a hand-massage ritual.",
      badge: "FREE UPGRADE",
      badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
      validUntil: "ONGOING",
      promoCode: "WEEKEND",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDwBLZDaHM5Xku16LwmhG_bD0r2PNPJDHKpAkxWn-FZmn5UpHyKTBEpE0R-9Y3fwOjg-2cTUwnuwTaDAmuTeFwssIG0ncea81qk6FRPyOSf6JLf7XRceF9w0RW9GdO2ohc9yKqpzwCgfTe_EUW0nnnxaNDvz4D5VHSJyo0oLz6LrdIWzjNrHDP5JvYhiuNb31VdISK5az7YkYbH0890TLEEcQGm9lqHQVmN4jHxpp20OmbRI7D361csuyY86WpqzuZ57PwTyyfjg__M",
      imageAlt: "Two elegant crystal champagne flutes filled with bubbling champagne...",
      actionLabel: "Book with Code",
      onAction: () => handleBookWithCode("WEEKEND"),
    },
  ];

  /* ── Main render ──────────────────── */
  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden">
      <CustomerNavbar />

      <main className="pt-24">
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
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className="group reveal-up active flex flex-col h-full"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden card-img-zoom mb-6 shrink-0">
                  <img
                    alt={offer.imageAlt}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700"
                    src={offer.imageSrc}
                  />
                  <div className={`absolute top-4 right-4 px-4 py-1 font-label-md text-label-md uppercase tracking-wider shadow-sm ${offer.badgeClass}`}>
                    {offer.badge}
                  </div>
                </div>
                <div className="flex flex-col flex-grow space-y-4">
                  <h3 className="font-headline-md text-headline-md">{offer.title}</h3>
                  <p className="font-body-md text-on-surface-variant flex-grow line-clamp-3">{offer.description}</p>
                  <div className="pt-4 flex flex-col gap-2 border-t border-outline-variant/50 shrink-0">
                    <div className="flex justify-between items-center font-label-sm text-label-sm">
                      <span className="uppercase tracking-widest text-outline">Valid Until</span>
                      <span className="text-primary font-semibold">{offer.validUntil}</span>
                    </div>
                    <div className="flex justify-between items-center font-label-sm text-label-sm">
                      <span className="uppercase tracking-widest text-outline">Promo Code</span>
                      <span className="text-secondary font-bold select-all cursor-pointer hover:underline">
                        {offer.promoCode}
                      </span>
                    </div>
                  </div>
                  <button
                    className="w-full py-4 mt-2 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 shrink-0"
                    onClick={offer.onAction}
                  >
                    {offer.actionLabel}
                  </button>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default OffersAndRitualsPage;