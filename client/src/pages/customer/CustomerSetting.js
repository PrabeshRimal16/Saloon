import React, { useState, useEffect } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';
import { useAuth } from '../../context/AuthContext';

const CustomerSetting = () => {
  // ── Preferences State ──
  const [prefs, setPrefs] = useState({
    emailReminders: true,
    smsReminders: true,
    newsletterOffers: false,
  });

  const { user, loading } = useAuth();

  // local editable profile state
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '', avatar: '' });

  // Toggle handlers
  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  // ── Inject Custom CSS ──
  useEffect(() => {
    // populate profile from auth user when available
    if (!loading && user) {
      const parts = (user.name || user.displayName || '').split(' ');
      setProfile({
        firstName: parts.slice(0, -1).join(' ') || parts[0] || '',
        lastName: parts.length > 1 ? parts.slice(-1).join(' ') : '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
        avatar: user.photo || user.avatar || user.avatarUrl || user.picture || '',
      });
    }

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
        box-shadow: inset 1em 1em var(--form-control-color, #C9A84C);
        background-color: #C9A84C;
        transform-origin: center;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      }
      .custom-checkbox:checked { border-color: #C9A84C; }
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
    <div className="bg-[#FBF8F2] text-[#1A1A1A] antialiased min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      {/* ── Main Content ── */}
      <main className="flex-grow pt-[120px] pb-24 px-8 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">
            Account Profile
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Manage your personal details, secure your account, and tailor your
            atelier experience.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Left Column ── */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Identity Card */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col items-center text-center rounded-lg shadow-sm">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border border-gray-200 p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    alt={profile.firstName || user?.name || 'User avatar'}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    src={profile.avatar || user?.avatar_url || user?.photo || 'https://ui-avatars.com/api/?name=' + (profile.firstName || 'User')}
                  />
                </div>
              </div>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-1">
                {`${profile.firstName || user?.name || ''} ${profile.lastName || ''}`.trim() || user?.email || 'User'}
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                Client since 2021
              </p>
              <button className="w-full py-3 px-6 border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 rounded-sm">
                Update Photo
              </button>
            </div>

            {/* Membership Card */}
            <div className="bg-[#1A1A1A] p-8 relative overflow-hidden group border border-[#1A1A1A] rounded-lg shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-12 relative z-10">
                <h3 className="font-serif text-3xl text-[#C9A84C] leading-tight">
                  Atelier
                  <br />
                  Privilege
                </h3>
                <span
                  className="material-symbols-outlined text-[#C9A84C]"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}
                >
                  diamond
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-2">
                  Current Status
                </p>
                <p className="text-xl text-white font-medium mb-6">
                  Noir Membership
                </p>
                <div className="w-full bg-white/20 h-[1px] mb-6"></div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="material-symbols-outlined text-[#C9A84C] text-[18px]">
                      check
                    </span>
                    Priority Booking Access
                  </li>
                  <li className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="material-symbols-outlined text-[#C9A84C] text-[18px]">
                      check
                    </span>
                    Complimentary Styling Consult
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Personal Details Form */}
            <section className="bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 pb-4 border-b border-gray-100">
                Personal Details
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="relative">
                    <input
                      className="input-minimal w-full bg-transparent border-0 border-b border-gray-300 focus:border-[#C9A84C] focus:ring-0 py-2 text-base text-[#1A1A1A] transition-colors peer outline-none"
                      id="firstName"
                      placeholder=" "
                      type="text"
                      value={profile.firstName}
                      onChange={(e)=>setProfile(p=>({...p, firstName: e.target.value}))}
                    />
                    <label
                      className="absolute left-0 top-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all duration-300 origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A84C]"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      className="input-minimal w-full bg-transparent border-0 border-b border-gray-300 focus:border-[#C9A84C] focus:ring-0 py-2 text-base text-[#1A1A1A] transition-colors peer outline-none"
                      id="lastName"
                      placeholder=" "
                      type="text"
                      value={profile.lastName}
                      onChange={(e)=>setProfile(p=>({...p, lastName: e.target.value}))}
                    />
                    <label
                      className="absolute left-0 top-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all duration-300 origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A84C]"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                  </div>
                <div className="relative md:col-span-2">
                  <input
                    className="input-minimal w-full bg-transparent border-0 border-b border-gray-300 focus:border-[#C9A84C] focus:ring-0 py-2 text-base text-[#1A1A1A] transition-colors peer outline-none"
                    id="email"
                    placeholder=" "
                    type="email"
                    value={profile.email}
                    onChange={(e)=>setProfile(p=>({...p, email: e.target.value}))}
                  />
                  <label
                    className="absolute left-0 top-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all duration-300 origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A84C]"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative md:col-span-2">
                  <input
                    className="input-minimal w-full bg-transparent border-0 border-b border-gray-300 focus:border-[#C9A84C] focus:ring-0 py-2 text-base text-[#1A1A1A] transition-colors peer outline-none"
                    id="phone"
                    placeholder=" "
                    type="tel"
                    value={profile.phone}
                    onChange={(e)=>setProfile(p=>({...p, phone: e.target.value}))}
                  />
                  <label
                    className="absolute left-0 top-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all duration-300 origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A84C]"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                </div>
                <div className="md:col-span-2 mt-4">
                  <button
                    className="bg-[#1A1A1A] text-white border border-[#1A1A1A] px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#1A1A1A] transition-colors duration-300 w-full md:w-auto rounded-sm"
                    type="button"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Security Section */}
            <section className="bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 pb-4 border-b border-gray-100">
                Security
              </h2>
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                    Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="relative">
                      <input
                        className="input-minimal w-full bg-transparent border-0 border-b border-gray-300 focus:border-[#C9A84C] focus:ring-0 py-2 text-base text-[#1A1A1A] transition-colors peer outline-none"
                        id="currentPassword"
                        placeholder=" "
                        type="password"
                      />
                      <label
                        className="absolute left-0 top-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all duration-300 origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A84C]"
                        htmlFor="currentPassword"
                      >
                        Current Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        className="input-minimal w-full bg-transparent border-0 border-b border-gray-300 focus:border-[#C9A84C] focus:ring-0 py-2 text-base text-[#1A1A1A] transition-colors peer outline-none"
                        id="newPassword"
                        placeholder=" "
                        type="password"
                      />
                      <label
                        className="absolute left-0 top-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all duration-300 origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-[#C9A84C]"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                    </div>
                  </div>
                  <button className="mt-8 border border-gray-300 text-gray-600 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-gray-50 transition-colors duration-300 rounded-sm">
                    Update Password
                  </button>
                </div>
                <div className="w-full bg-gray-100 h-[1px]"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1A1A]"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 pb-4 border-b border-gray-100">
                Preferences
              </h2>
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
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
                  <span className="text-base text-gray-600 group-hover:text-[#1A1A1A] transition-colors">
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
                  <span className="text-base text-gray-600 group-hover:text-[#1A1A1A] transition-colors">
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
                  <span className="text-base text-gray-600 group-hover:text-[#1A1A1A] transition-colors">
                    Exclusive Offers &amp; Atelier News (Email)
                  </span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-[#FBF8F2] border-t border-gray-200 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 gap-8 max-w-7xl mx-auto">
          <div className="font-serif text-2xl text-[#1A1A1A]">
            The Modern Atelier
          </div>
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            <a
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors duration-300"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors duration-300"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors duration-300"
              href="#"
            >
              Careers
            </a>
            <a
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors duration-300"
              href="#"
            >
              Press
            </a>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center md:text-right">
            © 2024 The Modern Atelier. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerSetting;