import React, { useState, useEffect, useRef } from "react";

const AdminAppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchContainerRef = useRef(null);

  // Row hover effect (translateX)
  const handleRowMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateX(8px)";
    e.currentTarget.style.transition = "transform 0.3s ease";
  };
  const handleRowMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateX(0)";
  };

  // Search input focus effect via class
  const handleSearchFocus = () => {
    searchContainerRef.current?.classList.add("scale-105");
  };
  const handleSearchBlur = () => {
    searchContainerRef.current?.classList.remove("scale-105");
  };

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Inject custom styles */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .glass-nav {
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
        .luxury-shadow {
          box-shadow: 0 4px 20px -5px rgba(212, 175, 55, 0.15);
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f9f9f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cfc4c5;
          border-radius: 10px;
        }
      `}</style>

      {/* SideNavBar */}
      <aside className="bg-surface dark:bg-inverse-surface h-screen w-64 fixed left-0 top-0 border-r border-outline-variant dark:border-outline flex flex-col h-full py-8 px-6 z-50" id="sidebar">
        <div className="mb-12">
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-secondary-fixed-dim">L'Atelier</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase mt-1">Admin Suite</p>
        </div>
        <nav className="flex-1 space-y-4">
          <a className="flex items-center gap-4 px-3 py-2 text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-body-md text-body-md">Overview</span>
          </a>
          <a className="flex items-center gap-4 px-3 py-2 text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined text-[20px]">content_cut</span>
            <span className="font-body-md text-body-md">Services</span>
          </a>
          {/* Active State: Appointments */}
          <a className="flex items-center gap-4 px-3 py-2 text-secondary dark:text-secondary-fixed-dim font-bold border-r-2 border-secondary hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span className="font-body-md text-body-md">Appointments</span>
          </a>
          <a className="flex items-center gap-4 px-3 py-2 text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="font-body-md text-body-md">Clients</span>
          </a>
          <a className="flex items-center gap-4 px-3 py-2 text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined text-[20px]">local_offer</span>
            <span className="font-body-md text-body-md">Offers</span>
          </a>
          <a className="flex items-center gap-4 px-3 py-2 text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
        <button className="mt-auto w-full bg-primary text-on-primary py-4 px-4 font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-95 border border-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Appointment
        </button>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant dark:border-outline flex justify-between items-center h-20 px-gutter z-40">
        <div className="flex items-center gap-8 w-1/2">
          <h2 className="font-headline-sm text-headline-sm text-primary dark:text-secondary-fixed-dim whitespace-nowrap">L'Atelier Admin Suite</h2>
          <div ref={searchContainerRef} className="relative w-full max-w-md transition-transform duration-300 ease">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md px-10 py-1 transition-all outline-none"
              placeholder="Search appointments..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-secondary transition-all scale-95 active:scale-100">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-secondary transition-all scale-95 active:scale-100">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-surface-container border border-outline-variant overflow-hidden">
            <img
              alt="A professional headshot of an elegant salon administrator in her 30s with dark hair, wearing a high-fashion black blazer. The lighting is sophisticated and soft, typical of a high-end atelier, with a minimalist marble and warm gold background that maintains the luxury brand identity."
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3fLXlrfSC-CpOf9EXBWyHn18iLz_o1qZADliKtYmBmoddrqWct91GzgGCV260_L2Ls3ro91RMJ55ZjN2HDLkU-BYr6J33valxUX2Bz9yLwdt_WO-LDDYp_TaJbtouHx7DriKM7LQIdckfk2J9lAmWvXB5E1xAwAjhYNPSTNJ6dK91FEEcYdaesGdJVUzyg3JoF3NVQ2M7zIPvG43EH2WPt5U7VCjVkF_WEkngIElWDSI8SSoA13qTxuPonrlJMEMkVQaTLJRYob0R"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-20 min-h-screen">
        <div className="p-gutter max-w-container-max-width mx-auto">
          {/* Breadcrumb & Title */}
          <section className="mb-12">
            <nav className="flex items-center gap-2 mb-4">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Admin</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Appointments</span>
            </nav>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary">Appointment Management</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
                  Oversee and coordinate every luxury experience. From master stylists to exclusive spa treatments, manage the flow of the modern atelier.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-4 py-2">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                  <span className="font-label-md text-label-md uppercase">Oct 24 - Oct 31, 2023</span>
                  <span className="material-symbols-outlined text-on-surface-variant ml-2 cursor-pointer">expand_more</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-4 py-2 relative group">
                  <span className="material-symbols-outlined text-secondary">filter_list</span>
                  <span className="font-label-md text-label-md uppercase">All Statuses</span>
                  <span className="material-symbols-outlined text-on-surface-variant ml-2 cursor-pointer group-hover:rotate-180 transition-transform">expand_more</span>
                  <div className="absolute top-full left-0 mt-1 w-full bg-surface border border-outline-variant shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                    <ul className="py-2">
                      <li className="px-4 py-2 font-label-md text-label-md uppercase hover:bg-surface-container-low hover:text-secondary cursor-pointer">All</li>
                      <li className="px-4 py-2 font-label-md text-label-md uppercase hover:bg-surface-container-low hover:text-secondary cursor-pointer">Approved/Confirmed</li>
                      <li className="px-4 py-2 font-label-md text-label-md uppercase hover:bg-surface-container-low hover:text-secondary cursor-pointer">New/Pending</li>
                      <li className="px-4 py-2 font-label-md text-label-md uppercase hover:bg-surface-container-low hover:text-secondary cursor-pointer">Canceled</li>
                    </ul>
                  </div>
                </div>
                <button className="bg-surface border border-primary text-primary px-6 py-2 font-label-md text-label-md uppercase hover:bg-primary hover:text-on-primary transition-all">
                  Export List
                </button>
              </div>
            </div>
          </section>

          {/* Table Section */}
          <section className="bg-surface border border-outline-variant overflow-hidden luxury-shadow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Customer Name</th>
                  <th className="px-6 py-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Service Requested</th>
                  <th className="px-6 py-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Date &amp; Time</th>
                  <th className="px-6 py-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Stylist</th>
                  <th className="px-6 py-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {/* Pending Appointment Row */}
                <tr className="hover:bg-surface-bright transition-colors group" onMouseEnter={handleRowMouseEnter} onMouseLeave={handleRowMouseLeave}>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">EB</div>
                      <div>
                        <div className="font-body-md text-body-md font-bold text-primary">Eleanor Bennett</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">VVIP Member</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="font-body-md text-body-md">Signature Balayage &amp; Blowout</div>
                    <div className="font-label-sm text-label-sm text-secondary-fixed-dim">180 mins</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant">
                    <div className="font-body-md text-body-md">Oct 28, 2023</div>
                    <div className="font-label-sm text-label-sm">11:30 AM</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant">
                    <div className="font-body-md text-body-md">Julian Rossi</div>
                    <div className="font-label-sm text-label-sm">Master Stylist</div>
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className="px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full font-label-sm text-label-sm uppercase tracking-wider">Pending</span>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="bg-secondary-fixed-dim text-on-secondary-fixed font-label-sm text-label-sm uppercase px-4 py-2 border border-secondary-fixed-dim hover:bg-secondary hover:text-white transition-all">Approve</button>
                      <button className="bg-transparent border border-outline-variant text-on-surface-variant font-label-sm text-label-sm uppercase px-4 py-2 hover:bg-error hover:text-white hover:border-error transition-all">Cancel</button>
                    </div>
                  </td>
                </tr>
                {/* Confirmed Appointment Row */}
                <tr className="hover:bg-surface-bright transition-colors group" onMouseEnter={handleRowMouseEnter} onMouseLeave={handleRowMouseLeave}>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                        <img className="w-full h-full object-cover" alt="A portrait of a sophisticated woman with styled auburn hair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrF14xwJERAMOc3Xnsmeic_S_ToK-fsr2haDjPa5rfZn4w35LjTyjOwP3OZzfGmHDqBPR1bXNuEt0oF4T69iLs702rmtb1Yp67jOJAEIawxDk-8IGA3kxdOueg2vPmPx72rQ5o_-2YrHNCek5DunAq3VyY7G05CtcawCPeX6cYNqj09PaQwEojDq5-9E17vGByu6QqsFv1NPhYwZGRiHLlRUj8hfdan7i764h7zyRLZGQXRfUYyU1bqM_APQJzqX0TQEfvma-8-Ug1" />
                      </div>
                      <div>
                        <div className="font-body-md text-body-md font-bold text-primary">Sienna Moretti</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">New Client</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="font-body-md text-body-md">Velvet Pedicure &amp; Paraffin Wax</div>
                    <div className="font-label-sm text-label-sm text-secondary-fixed-dim">60 mins</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant">
                    <div className="font-body-md text-body-md">Oct 28, 2023</div>
                    <div className="font-label-sm text-label-sm">02:15 PM</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant">
                    <div className="font-body-md text-body-md">Clara Bloom</div>
                    <div className="font-label-sm text-label-sm">Senior Technician</div>
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className="px-3 py-1 bg-primary text-on-primary border border-primary rounded-full font-label-sm text-label-sm uppercase tracking-wider">Confirmed</span>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <button className="text-on-surface-variant hover:text-primary p-2">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* Pending Appointment Row 2 */}
                <tr className="hover:bg-surface-bright transition-colors group" onMouseEnter={handleRowMouseEnter} onMouseLeave={handleRowMouseLeave}>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">MC</div>
                      <div>
                        <div className="font-body-md text-body-md font-bold text-primary">Marcus Sterling</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">Regular</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="font-body-md text-body-md">Executive Men's Cut &amp; Grooming</div>
                    <div className="font-label-sm text-label-sm text-secondary-fixed-dim">45 mins</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant">
                    <div className="font-body-md text-body-md">Oct 29, 2023</div>
                    <div className="font-label-sm text-label-sm">09:00 AM</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant">
                    <div className="font-body-md text-body-md">Sebastian Hart</div>
                    <div className="font-label-sm text-label-sm">Barber Director</div>
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className="px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full font-label-sm text-label-sm uppercase tracking-wider">Pending</span>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="bg-secondary-fixed-dim text-on-secondary-fixed font-label-sm text-label-sm uppercase px-4 py-2 border border-secondary-fixed-dim hover:bg-secondary hover:text-white transition-all">Approve</button>
                      <button className="bg-transparent border border-outline-variant text-on-surface-variant font-label-sm text-label-sm uppercase px-4 py-2 hover:bg-error hover:text-white hover:border-error transition-all">Cancel</button>
                    </div>
                  </td>
                </tr>
                {/* Completed Appointment Row */}
                <tr className="hover:bg-surface-bright transition-colors group" onMouseEnter={handleRowMouseEnter} onMouseLeave={handleRowMouseLeave}>
                  <td className="px-6 py-8 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                        <img className="w-full h-full object-cover" alt="A portrait of a sophisticated man with silver-flecked dark hair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOY8F7vW5gISAZGe3ZFRlY4FERVquMQhUHSbfQIG7zg2Pcnjts9l1hl-OYHsENbsPrhiub9VAAJjMjxE6uVIPqAGtop2_0_TYipm8g59edTYs9VeBn2Nw4LselG8tOosCISn1ldWzZ1SDoC8S9LDvyze0wlQvWtrPoJj3t0vDc6BHZYpu0AcGxd5z1_FgLbro2t3Lb9Ll3zFgZwpG-IViNidIjximPv9RA6PZRJj0Y1tKNdWiF8iKTVuJ7ZxJzzP5pFsR-mLneunnh" />
                      </div>
                      <div>
                        <div className="font-body-md text-body-md font-bold text-primary">Julianna Vane</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">VVIP Member</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 opacity-60">
                    <div className="font-body-md text-body-md">Full Body Himalayan Salt Scrub</div>
                    <div className="font-label-sm text-label-sm text-secondary-fixed-dim">90 mins</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant opacity-60">
                    <div className="font-body-md text-body-md">Oct 26, 2023</div>
                    <div className="font-label-sm text-label-sm">04:00 PM</div>
                  </td>
                  <td className="px-6 py-8 text-on-surface-variant opacity-60">
                    <div className="font-body-md text-body-md">Elena Sokolova</div>
                    <div className="font-label-sm text-label-sm">Spa Director</div>
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant border border-outline-variant rounded-full font-label-sm text-label-sm uppercase tracking-wider">Completed</span>
                  </td>
                  <td className="px-6 py-8 text-right opacity-60">
                    <button className="text-on-surface-variant hover:text-primary p-2">
                      <span className="material-symbols-outlined">receipt</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-6 py-6 border-t border-outline-variant flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Showing 4 of 24 appointments this week</p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-outline-variant hover:border-primary transition-all disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-label-sm text-label-sm px-4">Page 1 of 6</span>
                <button className="p-2 border border-outline-variant hover:border-primary transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Stats Section */}
          <section className="mt-section-gap-desktop grid grid-cols-12 gap-gutter mb-20">
            <div className="col-span-12 lg:col-span-4 bg-primary text-on-primary p-8 border border-primary flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl mb-6 text-secondary-fixed-dim">auto_awesome</span>
                <h3 className="font-headline-md text-headline-md">Client Experience</h3>
              </div>
              <div className="mt-12">
                <p className="font-body-md text-body-md opacity-80 mb-4">Total luxury sessions managed this month across all atelier departments.</p>
                <div className="text-4xl font-bold font-headline-lg">1,284</div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-surface border border-outline-variant p-8 hover:border-secondary transition-all">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-12 w-12 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">pending_actions</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">+12% vs LW</span>
                </div>
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-2">Awaiting Approval</h4>
                <div className="text-3xl font-bold font-headline-md">18</div>
              </div>
              <div className="bg-surface border border-outline-variant p-8 hover:border-secondary transition-all">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-12 w-12 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">+5% vs LW</span>
                </div>
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-2">Confirmed Today</h4>
                <div className="text-3xl font-bold font-headline-md">42</div>
              </div>
              <div className="col-span-1 md:col-span-2 bg-surface border border-outline-variant p-8 flex items-center justify-between">
                <div>
                  <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-2">Daily Revenue Pace</h4>
                  <div className="text-3xl font-bold font-headline-md text-secondary">$12,450.00</div>
                </div>
                <div className="w-1/2 h-12 bg-surface-container-low flex items-end gap-1 px-4">
                  <div className="flex-1 bg-outline-variant h-1/4"></div>
                  <div className="flex-1 bg-outline-variant h-2/4"></div>
                  <div className="flex-1 bg-outline-variant h-1/4"></div>
                  <div className="flex-1 bg-outline-variant h-3/4"></div>
                  <div className="flex-1 bg-secondary-fixed-dim h-full"></div>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-20 py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              © 2023 L'Atelier Admin Suite. All rights reserved.
            </div>
            <div className="flex gap-8">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors" href="#">Terms of Service</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors" href="#">Support</a>
            </div>
          </footer>
        </div>
      </main>

      {/* Contextual FAB */}
      <button className="fixed bottom-10 right-10 h-16 w-16 bg-primary text-on-primary rounded-full luxury-shadow flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all group">
        <span className="material-symbols-outlined text-[32px]">add</span>
        <span className="absolute right-full mr-4 bg-primary text-white font-label-md text-label-md uppercase px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-outline">Schedule New</span>
      </button>
    </div>
  );
};

export default AdminAppointmentsPage;