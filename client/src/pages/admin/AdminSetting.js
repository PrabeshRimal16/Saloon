import React, { useState } from "react";

const AdminSettings = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Hover effect for security cards
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.transition = "all 0.3s ease";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  };

  return (
    <div className="font-body-md text-body-md">
      {/* Custom Styles */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
        .active-icon {
          font-variation-settings: 'FILL' 1;
        }
        body {
          background-color: #f9f9f9;
          color: #1a1c1c;
        }
        .glass-nav {
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
        .active-tab-border {
          border-left: 2px solid #735c00;
        }
        .custom-input {
          border: none;
          border-bottom: 1px solid #cfc4c5;
          background: transparent;
          transition: border-color 0.3s ease;
        }
        .custom-input:focus {
          outline: none;
          border-bottom: 1px solid #735c00;
          ring: 0;
          box-shadow: none;
        }
      `}</style>

      {/* ── TopNavBar ── */}
      <nav className="flex justify-between items-center px-gutter w-full sticky top-0 z-40 bg-surface/90 border-b border-outline-variant/30 backdrop-blur-xl h-16">
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-headline-md text-primary tracking-tight">
            L'Atelier
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <div className="relative group">
            <input
              className="bg-surface-container-low border-none rounded-full px-4 py-1.5 text-label-sm focus:ring-1 focus:ring-secondary w-64 transition-all"
              placeholder="Search..."
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="material-symbols-outlined absolute right-3 top-1.5 text-on-surface-variant text-body-md">
              search
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              notifications
            </span>
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              mail
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
              <img
                alt="A professional studio portrait of a sophisticated male administrator with a clean-cut appearance. He is wearing a minimalist black designer shirt against a neutral, high-key studio background. The lighting is soft and directional, emphasizing the clean lines and premium professional aesthetic of the L'Atelier brand."
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO5KHHp2BqFDFaRON10_cTjfyMJWGg2BuCNMJKvQY37z9HkSJF5UZChGcfUZYbE-C85qqPcFbFv0T7QEenhuICaPqiTzYoysB_oAMA8iU_ZbHcWnS6zIYVbWQJLtflkrhizzeOLXh3vSCPr3n3BTR0NU28_MGT6x6GsielfsrKCRPdNLmCA7jWvZ5ro0VfPifYRGEoStvepNUdkr-0h-EFDP8f_o9miCnGItqHLEazDFndhJoTAUvunHf76oAiNsiQqc6evGwYyZpp"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar & Layout Wrapper */}
      <div className="flex">
        {/* ── SideNavBar ── */}
        <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant/30 py-8 z-50">
          <div className="px-6 mb-12">
            <h1 className="font-headline-md text-headline-md text-primary">L'Atelier</h1>
            <p className="text-label-sm text-on-surface-variant tracking-widest uppercase mt-1">
              Admin Suite
            </p>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-1">
              <li className="group">
                <a
                  className="flex items-center gap-4 text-on-surface-variant pl-4 py-3 hover:bg-surface-container-high transition-all duration-300"
                  href="#"
                >
                  <span className="material-symbols-outlined group-hover:translate-x-1 duration-200">
                    dashboard
                  </span>
                  <span className="font-label-md text-label-md">Overview</span>
                </a>
              </li>
              <li className="group">
                <a
                  className="flex items-center gap-4 text-on-surface-variant pl-4 py-3 hover:bg-surface-container-high transition-all duration-300"
                  href="#"
                >
                  <span className="material-symbols-outlined group-hover:translate-x-1 duration-200">
                    content_cut
                  </span>
                  <span className="font-label-md text-label-md">Services</span>
                </a>
              </li>
              <li className="group">
                <a
                  className="flex items-center gap-4 text-on-surface-variant pl-4 py-3 hover:bg-surface-container-high transition-all duration-300"
                  href="#"
                >
                  <span className="material-symbols-outlined group-hover:translate-x-1 duration-200">
                    calendar_today
                  </span>
                  <span className="font-label-md text-label-md">Appointments</span>
                </a>
              </li>
              <li className="group">
                <a
                  className="flex items-center gap-4 text-on-surface-variant pl-4 py-3 hover:bg-surface-container-high transition-all duration-300"
                  href="#"
                >
                  <span className="material-symbols-outlined group-hover:translate-x-1 duration-200">
                    group
                  </span>
                  <span className="font-label-md text-label-md">Clients</span>
                </a>
              </li>
              {/* Active State: Settings */}
              <li className="group">
                <a
                  className="flex items-center gap-4 text-primary bg-surface-container-low border-l-2 border-secondary pl-4 py-3 transition-all duration-300"
                  href="#"
                >
                  <span
                    className="material-symbols-outlined group-hover:translate-x-1 duration-200 active-icon"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    settings
                  </span>
                  <span className="font-label-md text-label-md font-bold">Settings</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="px-4 mt-auto">
            <button className="w-full py-4 px-2 border border-primary text-label-md bg-primary text-on-primary hover:bg-white hover:text-primary transition-all duration-300 uppercase tracking-widest">
              Book New Appointment
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-grow md:ml-64 p-gutter lg:p-12">
          <div className="max-w-4xl mx-auto space-y-section-gap-desktop">
            {/* Page Header */}
            <header className="space-y-4">
              <h2 className="font-headline-xl text-headline-xl text-primary">Profile Settings</h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                Manage your account preferences, personal information, and security settings to
                ensure your administrative experience at L'Atelier remains seamless.
              </p>
            </header>

            {/* Settings Sections Container */}
            <div className="grid grid-cols-1 gap-24">
              {/* Account Details Section */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-outline-variant/30 pt-12">
                <div className="md:col-span-4">
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">
                    Account Details
                  </h3>
                  <p className="text-label-md text-on-surface-variant uppercase tracking-wider">
                    Identity &amp; Contact
                  </p>
                </div>
                <div className="md:col-span-8 bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg shadow-sm">
                  <div className="space-y-12">
                    <div className="flex flex-col space-y-2">
                      <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">
                        Full Name
                      </label>
                      <input
                        className="custom-input py-2 font-body-md text-primary"
                        readOnly
                        type="text"
                        value="Julian V."
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">
                        Email Address
                      </label>
                      <input
                        className="custom-input py-2 font-body-md text-primary"
                        readOnly
                        type="email"
                        value="julian.v@latelier.com"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="px-8 py-3 border border-secondary text-secondary font-label-md hover:bg-secondary hover:text-white transition-all duration-300">
                        Request Information Change
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Section */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-outline-variant/30 pt-12">
                <div className="md:col-span-4">
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Security</h3>
                  <p className="text-label-md text-on-surface-variant uppercase tracking-wider">
                    Access Control
                  </p>
                </div>
                <div className="md:col-span-8 space-y-6">
                  {/* Password Card */}
                  <div
                    className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg flex justify-between items-center group cursor-pointer hover:border-secondary transition-colors"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="space-y-1">
                      <h4 className="font-body-lg font-bold text-primary">Password</h4>
                      <p className="text-body-md text-on-surface-variant">Last updated 3 months ago</p>
                    </div>
                    <button className="flex items-center gap-2 text-secondary group-hover:translate-x-1 transition-transform">
                      <span className="font-label-md uppercase tracking-widest">Update</span>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                  {/* 2FA Card */}
                  <div
                    className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-lg flex justify-between items-center group cursor-pointer hover:border-secondary transition-colors"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="space-y-1">
                      <h4 className="font-body-lg font-bold text-primary">Two-Factor Authentication</h4>
                      <p className="text-body-md text-on-surface-variant">
                        Recommended for high-level administrative access
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-label-sm bg-error-container text-on-error-container px-3 py-1 rounded-full">
                        Inactive
                      </span>
                      <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Atelier Profile Section */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-outline-variant/30 pt-12 mb-20">
                <div className="md:col-span-4">
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">
                    Atelier Profile
                  </h3>
                  <p className="text-label-md text-on-surface-variant uppercase tracking-wider">
                    Public Presence
                  </p>
                </div>
                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 border border-outline-variant/20 bg-white space-y-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-secondary mb-4">
                      <img
                        alt="A close-up shot of a meticulously dressed professional in a sharp charcoal suit. The focus is on the textures of the fabric and the clean, organized workspace in the blurred background. The image reflects a high-end atelier environment with a focus on precision and professional excellence."
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ2QxkhMDC0k_2DaIzN8SsHcn95zpFlGobCvy5nRV0KhQJTYc0BU0B_s-GFrX3Kg0YSK_57sU3E9GfCS-4GjfC5PFpDd90EIWUOVKZw-Q0V5yfQ-jx1WMnVFW8AEtJxhJ4Xc69Yse4pLbiw491UN0FVJOHUFGATyJzmGMvFCUognVuX60gzoJeB9NnD5IGOUQv0OLBRf8iO0geHW91ltxtIng-ZUpTOILefQ_9bmMuDXUpIhk1eaAhyIzCF0_NeGcc5Rc9yqAiQdBr"
                      />
                    </div>
                    <h4 className="text-label-md uppercase tracking-widest text-primary">Avatar Style</h4>
                    <p className="text-label-sm text-on-surface-variant">
                      Your photo is visible to clients during the booking confirmation process.
                    </p>
                    <button className="text-secondary font-label-md border-b border-secondary pt-2">
                      Replace Image
                    </button>
                  </div>
                  <div className="p-8 border border-outline-variant/20 bg-primary text-on-primary flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="material-symbols-outlined text-tertiary-fixed text-4xl">
                        verified_user
                      </span>
                      <h4 className="font-headline-md text-headline-md">Admin Level 4</h4>
                      <p className="text-body-md opacity-80">
                        Full access to service catalogs, employee scheduling, and financial reporting.
                      </p>
                    </div>
                    <p className="text-label-sm tracking-widest mt-8 opacity-60">ID: LAT-0922-JV</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav (hidden on desktop) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 z-50 flex items-center justify-around px-4">
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label-sm">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px] font-label-sm">Book</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            settings
          </span>
          <span className="text-[10px] font-label-sm font-bold">Settings</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-label-sm">Clients</span>
        </a>
      </nav>
    </div>
  );
};

export default AdminSettings;