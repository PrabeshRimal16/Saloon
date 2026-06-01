import React, { useState, useEffect } from "react";

const ClientProfilePage = () => {
  // ── Preferences State ──
  const [prefs, setPrefs] = useState({
    emailReminders: true,
    smsReminders: true,
    newsletterOffers: false,
  });

  // Toggle handlers
  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  // ── Inject Custom CSS ──
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .glass-nav { backdrop-filter: blur(30px); }
      .input-minimal:focus ~ label,
      .input-minimal:not(:placeholder-shown) ~ label {
        transform: translateY(-1.5rem) scale(0.85);
        color: #000000;
      }
      .input-minimal.not-empty ~ label {
        transform: translateY(-1.5rem) scale(0.85);
        color: #000000;
      }
      .custom-checkbox {
        appearance: none;
        background-color: transparent;
        margin: 0;
        font: inherit;
        color: currentColor;
        width: 1.15em;
        height: 1.15em;
        border: 1px solid #cfc4c5;
        display: grid;
        place-content: center;
        border-radius: 0;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }
      .custom-checkbox::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em var(--form-control-color, #735c00);
        background-color: #735c00;
        transform-origin: center;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      }
      .custom-checkbox:checked { border-color: #735c00; }
      .custom-checkbox:checked::before { transform: scale(1); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ── Floating label behaviour ──
  useEffect(() => {
    const inputs = document.querySelectorAll(".input-minimal");

    const handleInputChange = (e) => {
      if (e.target.value.trim() !== "") {
        e.target.classList.add("not-empty");
      } else {
        e.target.classList.remove("not-empty");
      }
    };

    inputs.forEach((input) => {
      // Set initial state
      if (input.value.trim() !== "") {
        input.classList.add("not-empty");
      }
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputs.forEach((input) =>
        input.removeEventListener("input", handleInputChange)
      );
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      {/* ── Header / Navbar ── */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-xl border-b border-outline-variant/30 glass-nav">
        <div className="flex justify-between items-center px-12 py-6 max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md text-primary dark:text-primary-fixed tracking-tighter">
            The Modern Atelier
          </div>
          <nav className="hidden md:flex gap-8">
            <a
              className="font-body-md text-body-md tracking-wider uppercase text-on-surface-variant dark:text-surface-variant pb-1 hover:text-secondary transition-colors duration-300"
              href="#"
            >
              Services
            </a>
            <a
              className="font-body-md text-body-md tracking-wider uppercase text-on-surface-variant dark:text-surface-variant pb-1 hover:text-secondary transition-colors duration-300"
              href="#"
            >
              Appointments
            </a>
            <a
              className="font-body-md text-body-md tracking-wider uppercase text-on-surface-variant dark:text-surface-variant pb-1 hover:text-secondary transition-colors duration-300"
              href="#"
            >
              Offers
            </a>
            <a
              className="font-body-md text-body-md tracking-wider uppercase text-on-surface-variant dark:text-surface-variant pb-1 hover:text-secondary transition-colors duration-300"
              href="#"
            >
              Contact Us
            </a>
          </nav>
          <div className="flex gap-6 text-primary dark:text-primary-fixed">
            <button
              aria-label="Notifications"
              className="hover:text-secondary transition-colors duration-300"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                notifications
              </span>
            </button>
            <button
              aria-label="Profile"
              className="text-secondary opacity-80 transition-all duration-200"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-grow pt-32 pb-section-gap-desktop px-6 md:px-12 max-w-[1280px] mx-auto w-full">
        <header className="mb-16">
          <h1 className="font-headline-xl text-headline-xl text-primary md:font-headline-xl text-headline-lg-mobile md:text-headline-xl mb-4">
            Account Profile
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Manage your personal details, secure your account, and tailor your
            atelier experience.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* ── Left Column ── */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* Identity Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/50 p-8 flex flex-col items-center text-center rounded-xl shadow-sm">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-surface">
                <img
                  alt="A close-up, high-fashion editorial portrait of a sophisticated man with well-groomed dark hair and a subtle beard. The lighting is soft, natural, and directional, highlighting his strong jawline against a pristine, minimalist white background. He is wearing a tailored charcoal turtleneck. The overall aesthetic is clean, luxurious, and modern, fitting for a high-end salon profile picture."
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtXcmHpmJJuTzqW08-oneYkb0H_R4NiqipqSPwdrTelKsHRLcuqCjpupVXvQ06ufwnJVHWhwE0tHYCLvPPAM0KD5zwEjbwHzEPY02XGPOA4cX-wTxwA03M9yZZ6VCqc_2-5r-tPCG2dkpggHjzTvCV39oAr2dHAftvU5Snl3lzhZIAGOLe2SFqQf_La3c9pg_v0pEBbK_yH3aVISOEbOGWzPyCrpz1OCp_iqR6vTjrV3vRdN7Dz44_MN205rB0tj_VBYJSrN_pCZBH"
                />
              </div>
              <h2 className="font-headline-md text-headline-md text-primary mb-1">
                Alexander V.
              </h2>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-6">
                Client since 2021
              </p>
              <button className="w-full py-3 px-6 border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors duration-300">
                Update Photo
              </button>
            </div>

            {/* Membership Card */}
            <div className="bg-primary p-8 relative overflow-hidden group border border-primary rounded-xl shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-12 relative z-10">
                <h3 className="font-headline-md text-headline-md text-secondary-fixed">
                  Atelier
                  <br />
                  Privilege
                </h3>
                <span
                  className="material-symbols-outlined text-secondary-fixed"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}
                >
                  diamond
                </span>
              </div>
              <div className="relative z-10">
                <p className="font-label-sm text-label-sm text-surface-container-low uppercase tracking-[0.1em] mb-2 opacity-80">
                  Current Status
                </p>
                <p className="font-body-lg text-body-lg text-on-primary mb-6">
                  Noir Membership
                </p>
                <div className="w-full bg-surface-tint/30 h-[1px] mb-6"></div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-surface-container-low font-body-md text-body-md">
                    <span className="material-symbols-outlined text-secondary-fixed text-sm">
                      check
                    </span>
                    Priority Booking Access
                  </li>
                  <li className="flex items-center gap-3 text-surface-container-low font-body-md text-body-md">
                    <span className="material-symbols-outlined text-secondary-fixed text-sm">
                      check
                    </span>
                    Complimentary Styling Consult
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Personal Details Form */}
            <section className="bg-surface-container-lowest border border-outline-variant/30 p-10 rounded-xl shadow-sm">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-8 pb-4 border-b border-outline-variant/30">
                Personal Details
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="relative">
                  <input
                    className="input-minimal w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-2 font-body-lg text-body-lg text-primary transition-colors peer"
                    id="firstName"
                    placeholder=" "
                    type="text"
                    defaultValue="Alexander"
                  />
                  <label
                    className="absolute left-0 top-2 font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant transition-all duration-300 origin-left pointer-events-none -translate-y-6 scale-85 text-primary"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="input-minimal w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-2 font-body-lg text-body-lg text-primary transition-colors peer"
                    id="lastName"
                    placeholder=" "
                    type="text"
                    defaultValue="V."
                  />
                  <label
                    className="absolute left-0 top-2 font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant transition-all duration-300 origin-left pointer-events-none -translate-y-6 scale-85 text-primary"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                </div>
                <div className="relative md:col-span-2">
                  <input
                    className="input-minimal w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-2 font-body-lg text-body-lg text-primary transition-colors peer"
                    id="email"
                    placeholder=" "
                    type="email"
                    defaultValue="alexander.v@example.com"
                  />
                  <label
                    className="absolute left-0 top-2 font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant transition-all duration-300 origin-left pointer-events-none -translate-y-6 scale-85 text-primary"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative md:col-span-2">
                  <input
                    className="input-minimal w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-2 font-body-lg text-body-lg text-primary transition-colors peer"
                    id="phone"
                    placeholder=" "
                    type="tel"
                    defaultValue="+1 (555) 019-8234"
                  />
                  <label
                    className="absolute left-0 top-2 font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant transition-all duration-300 origin-left pointer-events-none -translate-y-6 scale-85 text-primary"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                </div>
                <div className="md:col-span-2 mt-4">
                  <button
                    className="bg-primary text-on-primary border border-primary px-10 py-4 font-label-md text-label-md uppercase tracking-[0.1em] hover:bg-transparent hover:text-primary transition-colors duration-300 w-full md:w-auto"
                    type="button"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Security Section */}
            <section className="bg-surface-container-lowest border border-outline-variant/30 p-10 rounded-xl shadow-sm">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-8 pb-4 border-b border-outline-variant/30">
                Security
              </h2>
              <div className="space-y-10">
                <div>
                  <h3 className="font-label-md text-label-md text-primary uppercase tracking-[0.1em] mb-6">
                    Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="relative">
                      <input
                        className="input-minimal w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-2 font-body-lg text-body-lg text-primary transition-colors peer"
                        id="currentPassword"
                        placeholder=" "
                        type="password"
                      />
                      <label
                        className="absolute left-0 top-2 font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant transition-all duration-300 origin-left pointer-events-none"
                        htmlFor="currentPassword"
                      >
                        Current Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        className="input-minimal w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-2 font-body-lg text-body-lg text-primary transition-colors peer"
                        id="newPassword"
                        placeholder=" "
                        type="password"
                      />
                      <label
                        className="absolute left-0 top-2 font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant transition-all duration-300 origin-left pointer-events-none"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                    </div>
                  </div>
                  <button className="mt-8 border border-primary text-primary px-8 py-3 font-label-sm text-label-sm uppercase tracking-[0.1em] hover:bg-primary hover:text-on-primary transition-colors duration-300">
                    Update Password
                  </button>
                </div>
                <div className="w-full bg-outline-variant/30 h-[1px]"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="font-label-md text-label-md text-primary uppercase tracking-[0.1em] mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-surface-container-lowest border border-outline-variant/30 p-10 rounded-xl shadow-sm">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-8 pb-4 border-b border-outline-variant/30">
                Preferences
              </h2>
              <div className="space-y-6">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-[0.1em] mb-4">
                  Communication
                </h3>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    name="emailReminders"
                    checked={prefs.emailReminders}
                    onChange={handlePrefChange}
                  />
                  <span className="font-body-lg text-body-lg text-primary group-hover:text-secondary transition-colors">
                    Email Reminders for Appointments
                  </span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    name="smsReminders"
                    checked={prefs.smsReminders}
                    onChange={handlePrefChange}
                  />
                  <span className="font-body-lg text-body-lg text-primary group-hover:text-secondary transition-colors">
                    SMS Reminders for Appointments
                  </span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    name="newsletterOffers"
                    checked={prefs.newsletterOffers}
                    onChange={handlePrefChange}
                  />
                  <span className="font-body-lg text-body-lg text-primary group-hover:text-secondary transition-colors">
                    Exclusive Offers &amp; Atelier News (Email)
                  </span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-surface dark:bg-inverse-surface border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
            The Modern Atelier
          </div>
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            <a
              className="font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors duration-300 hover:underline underline-offset-4"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors duration-300 hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors duration-300 hover:underline underline-offset-4"
              href="#"
            >
              Careers
            </a>
            <a
              className="font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors duration-300 hover:underline underline-offset-4"
              href="#"
            >
              Press
            </a>
          </div>
          <div className="font-label-sm text-label-sm uppercase tracking-[0.1em] text-on-surface-variant dark:text-surface-variant text-center md:text-right">
            © 2024 The Modern Atelier. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerSetting;