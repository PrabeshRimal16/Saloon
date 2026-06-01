import React, { useState, useRef } from "react";

const OffersAndPromotionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const editIconRefs = useRef([]);

  // ── Card hover effect for edit icon scale ──
  const handleCardMouseEnter = (index) => {
    if (editIconRefs.current[index]) {
      editIconRefs.current[index].classList.add("scale-110");
    }
  };
  const handleCardMouseLeave = (index) => {
    if (editIconRefs.current[index]) {
      editIconRefs.current[index].classList.remove("scale-110");
    }
  };

  // ── Offer Data ──
  const offers = [
    {
      id: 1,
      title: "Summer Glow Package",
      discount: "20% OFF",
      status: "ACTIVE",
      statusClass: "bg-tertiary text-on-primary",
      description:
        "A curated 3-step ritual including deep exfoliation, hydration therapy, and our signature gold-leaf finishing mist.",
      dateLabel: "Jun 01 - Aug 31, 2024",
      codeLabel: "Code: GOLDGLOW20",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAZnWcKfXwYOeOqyDBMR766aAB4aJjOhhqFdst6Wbr6U0mLe0T_pMvsatqfVYRT_OyPw8qGhVDmTH_pzbh639gFw7NllQA8peXAbBUSjWtAH4ONk0VhMovip2NXAPYRjOYltqGpqeErVnk_kRpOU1Z5uun1uM8a9Eq956i1NMOGnhHqTtB7sxWcKaqzd8qvt4tHvmwNryrSbTF9-OJ4FwiseL7Gwve9oBSSHZJDYil4-zIleTRSO6swGYGdLHQQ3-hiwPbp_SgDUTK6",
      imageAlt:
        "A luxurious aesthetic close-up of a woman receiving a golden-hued facial treatment in a high-end salon.",
      opacity: "",
      grayscale: "",
    },
    {
      id: 2,
      title: "First-Time Client Special",
      discount: "$50 CREDIT",
      status: "SCHEDULED",
      statusClass: "bg-secondary-container text-on-secondary-container",
      description:
        "A warm welcome to the L'Atelier family. Applicable on any service over $150 for new members.",
      dateLabel: "Starts Sep 01, 2024",
      codeLabel: "Exclusive for New Accounts",
      icon: "group_add",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB9HPkT7Doi-MNV3m9enz0tqgiUy71P4eTpuJaP4h8nvYDmV9l5YKnVEBHy-mtnidAsLgtAD12XUUQgW8Xq8mbwjHLSUzWjF2Lzh1pW5FGms-gf-pGEkU2HuWQW5OyydfYYvBrewTEgWlWR2VcMvf0YAUyWO_soJ0vnPQ0zJYN7dzgzthfMH2hrJpsZKSlEnJtmgMsClga7t0ht9JUaW9j52VC6oz_oJ4JuPPJlGFuOvyAMXdFLI_D9uwJ6FoK7aIp1_B3p2j9OEY07",
      imageAlt:
        "A minimalist overhead shot of luxury hair styling tools arranged on a white marble surface.",
      opacity: "",
      grayscale: "",
    },
    {
      id: 3,
      title: "Bridal Party Ritual",
      discount: "15% OFF",
      status: "EXPIRED",
      statusClass: "bg-outline-variant text-on-surface-variant",
      description:
        "Group styling and champagne breakfast for parties of five or more.",
      dateLabel: "Ended May 31, 2024",
      codeLabel: null,
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAd200X_lEyQmtfblFZvVKNlZP0QsOmoqW_GV8Iy4X1zHF0CRHxOcLwCskt8IUvkLdk34A1qyCq8qqdaKzP32uIXAatm0xHYHGc79iXphdGfa46Zd8ZSIphs_F47S3lvBIesXZoGMrGKHQmqQ3obMRrzlCCE9FydsNESmDdEE1YBv24CZw_Cqi2LeLeSvWwp41kTNo1SK_qPEsBs7P-Yu8YDJa6-3KQWsO0NUViMaXLGZ1qpk-H3p9abe-pm2n37oPgGj0jI0heR8O_",
      imageAlt:
        "A sophisticated scene of elegant champagne flutes and delicate white flowers on a silver tray.",
      opacity: "opacity-75",
      grayscale: "grayscale-[0.5]",
      deactivateDisabled: true,
    },
  ];

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      {/* ── Inject Styles ── */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .glass-nav {
          background: rgba(249, 249, 249, 0.9);
          backdrop-filter: blur(30px);
        }
        .luxury-card {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;
        }
        .luxury-card:hover {
          transform: translateY(-4px);
          border-color: #735c00;
        }
        .offer-image-container {
          overflow: hidden;
        }
        .offer-image-container img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .offer-image-container:hover img {
          transform: scale(1.05);
        }
        .scale-110 {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
      `}</style>

      {/* ── SideNavBar ── */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-6 z-50 bg-surface dark:bg-surface-container border-r border-outline-variant/30 w-64 md:flex hidden">
        <div className="mb-8">
          <h1 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
            L'Atelier
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.2em]">
            Admin Suite
          </p>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { icon: "dashboard", label: "Overview", active: false },
            { icon: "content_cut", label: "Services", active: false },
            { icon: "calendar_today", label: "Appointments", active: false },
            { icon: "group", label: "Clients", active: false },
            { icon: "local_offer", label: "Offers", active: true },
            { icon: "settings", label: "Settings", active: false },
          ].map((item) => (
            <a
              key={item.label}
              className={`flex items-center gap-4 py-3 transition-all duration-200 pl-4 ${
                item.active
                  ? "text-primary dark:text-primary-fixed font-bold border-l-2 border-secondary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-secondary"
              }`}
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-4 pt-6">
          <button className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md transition-transform active:scale-95">
            Book New Service
          </button>
        </div>
      </aside>

      {/* ── TopAppBar ── */}
      <header className="flex justify-between items-center w-full px-gutter h-20 sticky top-0 z-40 bg-surface/90 dark:bg-surface-container/90 backdrop-blur-[30px] border-b border-outline-variant/30 md:pl-72">
        <div className="flex items-center gap-4 md:hidden">
          <span
            className="material-symbols-outlined text-primary cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            menu
          </span>
          <span className="font-headline-md text-headline-md text-primary tracking-tight">
            L'Atelier
          </span>
        </div>
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 gap-3 w-96 border-outline rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-md w-full"
            placeholder="Search promotions..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-secondary transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button className="relative text-on-surface-variant hover:text-secondary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full border border-surface"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <div className="text-right hidden lg:block">
              <p className="text-label-sm font-bold text-primary">Admin User</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                Managing Director
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 overflow-hidden">
              <img
                alt="Administrator Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjsKMAtUsG8IobPyZkAi1CwkZBFxmgzLb87r1cF5IGu5SG-_l70WIJ921jIgl3X1Fkg5ks1L4yPpSGh0NshKMbEwXifhVz5UP7kSOTRT82eS_2anPFlDdqRMsJUlJ5vXt3VNlfYi74QQSwgS370vOQksd0JsI-AqVaqg4sNkPygTjnjc8fK8-_eh7EjwV48ofKpMkhbxPyl1W3bZzQ_ErpsGywuCvrNSXKkgfbsU8jam40Cb0h6HUdUdb47_kbaGnTp_-WRNB3k0WQ"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full bg-surface border-b border-outline-variant/30 z-50 p-4 space-y-2">
          {["Overview", "Services", "Appointments", "Clients", "Offers", "Settings"].map(
            (item) => (
              <a
                key={item}
                className={`block py-2 px-4 font-label-md text-label-md ${
                  item === "Offers"
                    ? "text-primary font-bold border-l-2 border-secondary"
                    : "text-on-surface-variant"
                }`}
                href="#"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            )
          )}
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="md:ml-64 p-gutter max-w-container-max-width mx-auto">
        {/* Hero Header */}
        <section className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
              Offers &amp; Promotions Management
            </h2>
            <p className="text-on-surface-variant font-body-lg">
              Curate exclusive experiences and seasonal rituals to reward our most
              discerning clientele.
            </p>
          </div>
          <button className="px-8 py-4 bg-tertiary text-on-primary font-label-md text-label-md flex items-center gap-3 hover:bg-secondary transition-colors duration-300">
            <span className="material-symbols-outlined">add</span>
            CREATE NEW OFFER
          </button>
        </section>

        {/* Summary Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-16">
          {[
            {
              label: "Total Active Offers",
              value: "12",
              suffix: "+2 this month",
              suffixClass: "text-secondary font-label-sm",
            },
            {
              label: "Redemption Rate",
              value: "24.8%",
              suffix: "trending_up",
              suffixClass: "material-symbols-outlined text-secondary",
              isIcon: true,
            },
            {
              label: "Total Revenue Impact",
              value: "$18.4k",
              suffix: "May 2024",
              suffixClass: "text-on-surface-variant font-label-sm",
            },
            {
              label: "Client Retention",
              value: "68%",
              suffix: "analytics",
              suffixClass: "material-symbols-outlined text-outline",
              isIcon: true,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest border border-outline-variant/30 p-8 flex flex-col gap-2"
            >
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                {stat.label}
              </span>
              <div className="flex items-end justify-between">
                <span className="font-headline-md text-headline-md text-primary">
                  {stat.value}
                </span>
                {stat.isIcon ? (
                  <span className={stat.suffixClass}>{stat.suffix}</span>
                ) : (
                  <span className={stat.suffixClass}>{stat.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Offers Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {offers.map((offer, index) => (
            <article
              key={offer.id}
              className={`luxury-card bg-surface-container-lowest border border-outline-variant/30 flex flex-col h-full ${offer.opacity} ${offer.grayscale}`}
              onMouseEnter={() => handleCardMouseEnter(index)}
              onMouseLeave={() => handleCardMouseLeave(index)}
            >
              <div className="offer-image-container h-56 w-full bg-surface-container relative">
                <img
                  alt={offer.imageAlt}
                  className="w-full h-full object-cover"
                  src={offer.imageSrc}
                />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 font-label-sm text-label-sm ${offer.statusClass}`}
                >
                  {offer.status}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {offer.title}
                  </h3>
                  <span className="font-headline-md text-secondary">
                    {offer.discount}
                  </span>
                </div>
                <p className="text-on-surface-variant font-body-md mb-8 flex-1">
                  {offer.description}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">event</span>
                    <span className="font-label-sm text-label-sm">{offer.dateLabel}</span>
                  </div>
                  {offer.codeLabel && (
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">
                        {offer.icon || "confirmation_number"}
                      </span>
                      <span className="font-label-sm text-label-sm">{offer.codeLabel}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30">
                  <div className="flex gap-4">
                    <button
                      className="text-primary hover:text-secondary transition-colors"
                      title="Edit"
                    >
                      <span
                        className="material-symbols-outlined"
                        ref={(el) => (editIconRefs.current[index] = el)}
                      >
                        edit
                      </span>
                    </button>
                    <button
                      className={`text-on-surface-variant hover:text-error transition-colors ${
                        offer.deactivateDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Deactivate"
                      disabled={offer.deactivateDisabled}
                    >
                      <span className="material-symbols-outlined">block</span>
                    </button>
                  </div>
                  <button
                    className="text-on-surface-variant hover:text-error transition-colors"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Pagination Footer */}
        <footer className="mt-16 flex items-center justify-between py-8 border-t border-outline-variant/30">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Showing 3 of 12 Promotions
          </span>
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 hover:border-primary transition-colors"
              disabled={activePage === 1}
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 font-label-sm text-label-sm ${
                  activePage === page
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/30 hover:border-primary"
                }`}
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 hover:border-primary transition-colors"
              disabled={activePage === 3}
              onClick={() => setActivePage((p) => Math.min(3, p + 1))}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </footer>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-outline-variant/30 flex items-center justify-around z-50">
        {[
          { icon: "dashboard", label: "Overview" },
          { icon: "content_cut", label: "Services" },
          { icon: "local_offer", label: "Offers", active: true },
          { icon: "group", label: "Clients" },
        ].map((item) => (
          <a
            key={item.label}
            className={`flex flex-col items-center gap-1 ${
              item.active ? "text-primary" : "text-on-surface-variant"
            }`}
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={
                item.active
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              {item.icon}
            </span>
            <span
              className={`text-[10px] font-label-sm uppercase ${
                item.active ? "font-bold" : ""
              }`}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default OffersAndPromotionsPage;