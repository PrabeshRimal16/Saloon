import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // button press micro-interaction
    const onMouseDown = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      btn.classList.add('scale-95');
      setTimeout(() => btn.classList.remove('scale-95'), 150);
    };
    document.addEventListener('mousedown', onMouseDown);

    // navbar shadow on scroll
    const onScroll = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('shadow-sm');
      } else {
        nav.classList.remove('shadow-sm');
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div>
      <CustomerNavbar />

      <main className="pb-section-gap-desktop px-gutter max-w-container-max-width mx-auto">
        <section className="mb-section-gap-desktop">
          <div className="relative w-full h-[60vh] overflow-hidden rounded-lg">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKooKxy_b_oOWcyexhYfY0nuRsR9xj68RF2a-MdqP0nsB0QdjgvagQQOcdAZxGmAcz_R3Gd9_zXrBz4Q8_ThoRD185UdjfjHs_Zb90vsA3fCYVlD3FYhsqNp_R1wUL24nId52-auYHYAsV7BLw5LCIxHyoMF_mAeCKyGsB0kFmbjtmhTImuvbtnuDRN_vozgHvF8lYc8ypJolM3bgk2Bw4eOgug-o0rF8d2EFnxvBAIp-2ZHJej83op3mOR6iwj74Tm5w4Dwa72nPop" alt="Salon interior" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 md:px-24">
              <h1 className="font-headline-xl text-headline-xl text-white mb-4 max-w-2xl">Redefine Your<br/>Signature Aesthetic</h1>
              <p className="font-body-lg text-body-lg text-white/80 mb-8 max-w-lg">Experience the pinnacle of professional grooming where precision meets artisanal flair in our modern atelier.</p>
              <button onClick={() => navigate('/services')} className="btn-interactive w-fit px-10 py-4 bg-secondary text-on-secondary font-label-md text-label-md uppercase tracking-widest border border-secondary hover:bg-black hover:border-black transition-all duration-300">Explore Collection</button>
            </div>
          </div>
        </section>

        <section className="mb-section-gap-desktop">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Featured Services</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Meticulously crafted experiences for the modern individual.</p>
            </div>
            <button className="btn-interactive flex items-center gap-2 px-8 py-3 bg-primary text-white font-label-md text-label-md uppercase tracking-widest hover:bg-secondary transition-all duration-300" onClick={() => navigate('/services')}>View All Services <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Service cards - simplified */}
            <div className="group card-hover relative overflow-hidden rounded-lg border border-outline-variant/30 bg-surface md:col-span-6">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz3roTghTI54HnoXA5n13AjrBWWIB-dUp8NMPDOAxk19WIzS_BUSJFhcfWkhNXujAwo_ny1lvatTbJbN0Pr477j4b6g3v-aYPD-ineEWnjDYfTlIy2dEnFAhVi4Kku_fvJIkL3gRJ4arjtYymiD5et2meJoggHu3HmcInmO-ZbzGnmZ1o29qpPmG8pfR-ATiTgCWRZw6GDR0cmOXSiGU7EIELfUR0NotR1uRqwf2lPm19uCvfC4J9jV92IzvJP1IdY9_WI-N9SAfBB" alt="Artisanal Hair" />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline-md text-headline-md">Artisanal Hair Sculpting</h3>
                      <span className="font-label-md text-label-md text-secondary">$120</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">A bespoke cutting experience tailored to your facial structure and personal style, including a signature scalp massage and finish.</p>
                  </div>
                  <button className="btn-interactive w-full py-4 border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">Book Now</button>
                </div>
              </div>
            </div>

            <div className="group card-hover relative flex flex-col rounded-lg border border-outline-variant/30 bg-surface p-8 md:col-span-6">
              <div className="h-48 overflow-hidden mb-6 rounded">
                <img className="w-full h-full object-cover transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHlsaUmNydS_TLBMnaHAJ1FohE4bgNY_8nyfiU8iq1ieYwUaU5V2NWNl6A4A_KCoJPUXrFUNGEH_EsB4VdVpam-paOvfATG8_077VRuvUXZYvwcQvEcMTqHDdkhyY0SoO8PHBlsedQw3eVKgNKa1kiLCZcxPButN2A-DXOTbTjfb7MUVc8nv_pesZmghujZFMaLZWiemAQlkwVZBVJeuemocA6iLj5Xm2eLkKr3TfXhmyXLV2AK-fzJsjgRYrk5ZKWHemtrkJSt43c" alt="Radiance Facial" />
              </div>
              <div className="mb-auto">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-label-md text-label-md text-primary uppercase">Radiance Facial</h3>
                  <span className="font-label-md text-label-md text-secondary">$150</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Advanced oxygen-infused hydration therapy for a luminous, rested complexion.</p>
              </div>
              <button className="btn-interactive w-full py-3 border border-outline text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-300">Book Appointment</button>
            </div>

            <div className="md:col-span-8 group card-hover relative overflow-hidden rounded-lg border border-outline-variant/30 bg-surface">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between order-2 md:order-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline-md text-headline-md">Noir Beard Grooming</h3>
                      <span className="font-label-md text-label-md text-secondary">$80</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">The ultimate ritual featuring hot towel service, straight razor detailing, and artisanal oil treatment for a perfectly defined silhouette.</p>
                  </div>
                  <button className="btn-interactive w-full py-4 border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">Book Now</button>
                </div>
                <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden order-1 md:order-2">
                  <img className="w-full h-full object-cover transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2e616FJijDcxoBx-YToM77AsnVa9sEG1WizVrwJl3oY-tePbnPgUPyMPudzTFlw3YEjsVht7JTGNlg9oL3LeXxipzqQAIK29MmNVseXgHfua5zOxgpSevFIU2Nf1_Xv7iVjxJRgJzevS7oPNFWrTyNexx51T-GDj0jFe0q3iHDx8Vld0sRkI2U8fwjjpn5d4pFhLfFFH3obLm4Gi_s9lu_XOmuJl6UCrbgwL2LQQeiLPSQpXwEkWl-B2kNgh6qT-f3rkdQBUEy9IT" alt="Noir Beard" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
}