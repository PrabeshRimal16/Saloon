import React, { useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerServices() {
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
            {/* Card 1 */}
            <div className="service-card group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: '0ms' }}>
              <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                <img alt="Artisanal Hair Sculpting" className="w-full h-full object-cover transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz5mjuXgz7tHm1X0-xBKX3yvfKGbHQQxqCh7xgZxAWBY5pfEbvgK_KN6AG5Hxgr6jvHPe4wrCHAmO5SsfNlmvM0wBFjCTxjp5UqtwM2Aj57KxGaw3FacHvgAziQAPIeQrEa9NYBL5yeBrJsN2CnbdhYSnXMWcge_Cnv9Tt0XOV0_D7xxZHzAXP6eO6eIzK0pKpxUzgBI9eTZY2mk4Q90mivHce0kdlCyLy3k8uTSvuIffLF1gbvkXSss5yTUMGsQazrT2ZIwaypQE7" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-headline-md text-headline-md">Artisanal Hair Sculpting</h3>
                <span className="font-label-md text-label-md text-secondary mt-2">$120+</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                Precision cutting and avant-garde styling tailored to your unique facial architecture and hair texture.
              </p>
              <button className="w-full py-4 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-auto">
                Book Now
              </button>
            </div>

            {/* Card 2 */}
            <div className="service-card group cursor-pointer lg:mt-12 transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: '100ms' }}>
              <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                <img alt="Radiance Facial" className="w-full h-full object-cover transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoe-EaKKTsy4o-Rz7GI4XVq2ahuI5nL7P0c4Vt5zimd-WMcPalNBVuDKj_zvpKHyu7J7r3Qbc8DWksp7egi4TDQhlbLRewdT8mKUpy90OT08LEqePYjafIbBaehgEVsegfcoTSzWqEO5ZV-Laf4M1UiuiFpUmtu7Lmy10emgXq8q0i7paXSMhiASZCFAFZoVb1OyesRaMO1AwlVgzPU64KsofDeW00uwO4A5G1e_iifBjFSPWaJC17uUEhblipslIJXsGJeEgYCkyd" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-headline-md text-headline-md">Radiance Facial</h3>
                <span className="font-label-md text-label-md text-secondary mt-2">$180</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                An immersive molecular skin treatment that restores luminosity through 24k gold extracts and deep hydration.
              </p>
              <button className="w-full py-4 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-auto">
                Book Now
              </button>
            </div>

            {/* Card 3 */}
            <div className="service-card group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: '200ms' }}>
              <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                <img alt="Precision Mani" className="w-full h-full object-cover transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgSUd0f2G-2jmSONIz1AxggU5uYE01BSmxAmoF0xiYv1EXNJ8MICGuwBpKcMGB3RfUAfHb4LN8klxPbrPi9RD3q3G6QzmBYLvt9UwbjCAG_EUU9DG8g1rDLds6OQhd-fhytwV6eR130WoT9ELYi19Jg2FiU242BZtL8L3ngH3Gjw2TJ6hSgLPwKpSuQIQGe3Lmel0c4Zf3edLDBTUliN1bAMOVPnaT88dJ5PvIxZEwLeuBFRitmTfuFmnpy8mJgdSiFXpcgHnt1ZYd" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-headline-md text-headline-md">Precision Mani</h3>
                <span className="font-label-md text-label-md text-secondary mt-2">$85</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                Impeccable nail grooming followed by custom artistry that mirrors the latest Parisian runway trends.
              </p>
              <button className="w-full py-4 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-auto">
                Book Now
              </button>
            </div>

            {/* Card 4 */}
            <div className="service-card group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: '300ms' }}>
              <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                <img alt="Noir Beard Grooming" className="w-full h-full object-cover transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa4aEIudpQpzrKtWLfx2FSRlUtKSA4Ne-ldMGkhScSsrDnu3wHOCt3dD794X90-Rw5X8pPlC8bfdfQB6_KcMO-djCQiFgp-idxn32QqG9gX9115CfHSBhWAyVywtoiKYLvhHPoRLAAedR-LVgw9k5L6KdltQP_A46X6-XmP_3aHEzPZOWsKSzePOTHi01wZ2ZcJ46vsXf9d0H8uO6ih7KMGAK78lfKolHrpeCBYTn0J2srOUPsppB04wsq7VURaqyBPrt1bgYBPzwU" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-headline-md text-headline-md">Noir Beard Grooming</h3>
                <span className="font-label-md text-label-md text-secondary mt-2">$65</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                A sensory ritual involving hot steam, straight razor precision, and artisanal oils for the modern gentleman.
              </p>
              <button className="w-full py-4 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-auto">
                Book Now
              </button>
            </div>

            {/* Card 5 */}
            <div className="service-card group cursor-pointer lg:mt-12 transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: '400ms' }}>
              <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                <img alt="Balayage Couture" className="w-full h-full object-cover transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-3fMHE-N-qYe29DPlJZz-2ZkcpV2fZfruQxcjdFJXJGofRQxNc3s-MchbBC5Ig1Oh0zeKOmnwk0NCjkFnamIVCpMDyPGm9-Sby6eBsSY3kBZwvEq9ihR3ilo8CUccag5nKE2rvLIgWL2D_QS57M-npdEFWsv4uNNFqq-SVO8-5tWPd0SEH9RcP1P_8XzT52qab3v4jg5EHo1SpFgxdBenFXUWP2YiH94iSQ8BEl2js3x72esqd7MuFpwLvnrw68G4HHL4J3jHXYHu" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-headline-md text-headline-md">Balayage Couture</h3>
                <span className="font-label-md text-label-md text-secondary mt-2">$250+</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                Hand-painted dimension that mimics natural light. A bespoke color journey for effortless sophistication.
              </p>
              <button className="w-full py-4 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-auto">
                Book Now
              </button>
            </div>

            {/* Card 6 */}
            <div className="service-card group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 flex flex-col h-full" style={{ transitionDelay: '500ms' }}>
              <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 mb-6">
                <img alt="Sculpting Massage" className="w-full h-full object-cover transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcq__okdPN9z4V2SF7bnI6PBZAN6AY6f_7_Dxnd0hz1sKSdzplSJAeqr1QqmYtMokjI4lQFmjzjENqtJ-wVi9K6Uxsq9mJn0ZwIopO0W5ujJQClKhdzaU-mDYwzXwvXdDStFzlrSNkcyuPAXh7PnHVU1JAYbl0L1RGMEb0JjIi1HgmnxSbhLpicTpvTsOgrbFn4e5wap5onoktC85nfG2jUz1UJZawxhmjw08_kLtevlaWjaRmy8hcIS6B-BQHgDHG8KqGFlqvfF-0" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-headline-md text-headline-md">Sculpting Massage</h3>
                <span className="font-label-md text-label-md text-secondary mt-2">$150</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                Deep tissue work combined with lymphatic drainage to contour the body and release systemic tension.
              </p>
              <button className="w-full py-4 border border-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-auto">
                Book Now
              </button>
            </div>
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
