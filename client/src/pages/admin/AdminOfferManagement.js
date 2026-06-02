import React, { useState, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const AdminOfferManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

      <AdminSidebar />

      <AdminHeader title="Offers & Promotions Management" />

      {/* ── Main Content ── */}
      <main className="ml-64 pt-20 px-8 pb-8 max-w-container-max-width mx-auto">
        {/* Action Bar */}
        <div className="mb-8 flex justify-end">
          <button className="px-8 py-4 bg-tertiary text-on-primary font-label-md text-label-md flex items-center gap-3 hover:bg-secondary transition-colors duration-300">
            <span className="material-symbols-outlined">add</span>
            CREATE NEW OFFER
          </button>
        </div>

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

export default AdminOfferManagement;