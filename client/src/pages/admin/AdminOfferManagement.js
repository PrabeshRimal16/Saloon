import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const AdminOfferManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percent: "",
    valid_until: "",
    image_url: "",
  });
  const editIconRefs = useRef([]);

  // ── Fetch offers from API ──
  useEffect(() => {
    fetchOffers();
    fetchNotifications();
    // Poll for notifications every 5 seconds
    const notificationInterval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(notificationInterval);
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/offers");
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch Notifications ──
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications/admin");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
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

    // Save to localStorage for persistence
    const saved = JSON.parse(localStorage.getItem("notifications") || "[]");
    saved.unshift(newNotification);
    localStorage.setItem("notifications", JSON.stringify(saved.slice(0, 20)));
  };

  // ── Calculate Stats ──
  const calculateStats = () => {
    const now = new Date();
    const activeOffers = offers.filter(
      (offer) => !offer.valid_until || new Date(offer.valid_until) > now
    );
    const expiredOffers = offers.filter(
      (offer) => offer.valid_until && new Date(offer.valid_until) <= now
    );
    const totalRevenue = offers.reduce(
      (sum, offer) => sum + (offer.discount_percent || 0),
      0
    );
    const avgDiscountRate =
      offers.length > 0
        ? (totalRevenue / offers.length).toFixed(1)
        : 0;

    return {
      totalOffers: offers.length,
      activeOffers: activeOffers.length,
      expiredOffers: expiredOffers.length,
      avgDiscount: avgDiscountRate,
      totalRevenue: (activeOffers.length * 500).toLocaleString(),
    };
  };

  const stats = calculateStats();

  // ── Filter Offers by Status ──
  const getFilteredOffers = () => {
    let filtered = offers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((offer) =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    const now = new Date();
    if (statusFilter === "active") {
      filtered = filtered.filter(
        (offer) => !offer.valid_until || new Date(offer.valid_until) > now
      );
    } else if (statusFilter === "scheduled") {
      filtered = filtered.filter(
        (offer) => offer.valid_until && new Date(offer.valid_until) > now
      );
    } else if (statusFilter === "expired") {
      filtered = filtered.filter(
        (offer) => offer.valid_until && new Date(offer.valid_until) <= now
      );
    }

    return filtered;
  };

  const filteredOffers = getFilteredOffers();

  // ── Create or Update Offer ──
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/api/offers/${editingId}`
        : "http://localhost:5000/api/offers";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchOffers();
        setShowModal(false);
        setEditingId(null);
        setFormData({
          title: "",
          description: "",
          discount_percent: "",
          valid_until: "",
        });
        // Trigger notification
        addNotification(
          "success",
          editingId ? `Offer "${formData.title}" updated successfully!` : `New offer "${formData.title}" created!`
        );
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      addNotification("error", "Failed to save offer");
    }
  };

  // ── Delete Offer ──
  const handleDeleteOffer = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchOffers();
          addNotification("success", "Offer deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting offer:", error);
        addNotification("error", "Failed to delete offer");
      }
    }
  };

  // ── Edit Offer ──
  const handleEditOffer = (offer) => {
    setEditingId(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_percent: offer.discount_percent || "",
      valid_until: offer.valid_until || "",
      image_url: offer.image_url || "",
    });
    setShowModal(true);
  };

  // ── Close Modal ──
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      discount_percent: "",
      valid_until: "",
      image_url: "",
    });
  };

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

  // ── Static offers data (kept for backup/reference) ──
  const staticOffers = [
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

      <AdminSidebar />

      <AdminHeader title="Offers & Promotions Management" />

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

      {/* ── Main Content ── */}
      <main className="ml-64 pt-20 px-8 pb-12 max-w-6xl mx-auto">
        {/* Sticky Action Bar with Notification Bell */}
        <div className="sticky top-20 bg-background z-40 mb-8 -mx-8 px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Offers</h2>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            notif.type === "success"
                              ? "bg-green-50"
                              : notif.type === "error"
                              ? "bg-red-50"
                              : "bg-blue-50"
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold flex items-center gap-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Create New Offer
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total active offers",
              value: stats.activeOffers.toString(),
              suffix: `+${Math.max(0, stats.activeOffers - Math.floor(stats.activeOffers * 0.83))} active`,
              borderColor: "border-l-4 border-l-indigo-600",
            },
            {
              label: "Average discount",
              value: `${stats.avgDiscount}%`,
              suffix: `${stats.totalOffers} total offers`,
              borderColor: "border-l-4 border-l-amber-500",
            },
            {
              label: "Revenue potential",
              value: `$${stats.totalRevenue}`,
              suffix: `${stats.activeOffers} active × $500 avg`,
              borderColor: "border-l-4 border-l-green-500",
            },
            {
              label: "Expired offers",
              value: stats.expiredOffers.toString(),
              suffix: "ready to renew",
              borderColor: "border-l-4 border-l-blue-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${stat.borderColor}`}
            >
              <p className="text-sm font-medium text-gray-600 mb-3">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.suffix}</p>
            </div>
          ))}
        </section>

        {/* Filter & Search Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <input
            type="text"
            placeholder="Search offers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "active", "scheduled", "expired"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 mb-4">No offers found</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create your first offer
              </button>
            </div>
          ) : (
            filteredOffers.map((offer, index) => {
              const discountPercent = offer.discount_percent || 0;
              const isExpired =
                offer.valid_until &&
                new Date(offer.valid_until) < new Date();
              const statusText = isExpired ? "EXPIRED" : "ACTIVE";
              const statusStyles = isExpired
                ? "bg-gray-400 text-white"
                : "bg-green-500 text-white";

              return (
                <article
                  key={offer.id}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full ${
                    isExpired ? "opacity-60 grayscale" : ""
                  }`}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={() => handleCardMouseLeave(index)}
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
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
                    <div className="absolute inset-0 bg-black/10" />
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles}`}
                    >
                      {statusText}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title & Discount Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1">
                        {offer.title}
                      </h3>
                      {discountPercent > 0 && (
                        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 whitespace-nowrap">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 mb-3">
                      {offer.description}
                    </p>

                    {/* Valid Until Date */}
                    <p className="text-xs text-gray-400 mb-4">
                      {offer.valid_until
                        ? `Valid until: ${new Date(
                            offer.valid_until
                          ).toLocaleDateString()}`
                        : "No expiry set"}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                      <button
                        onClick={() => handleEditOffer(offer)}
                        className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-base">
                          edit
                        </span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-medium text-sm rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Pagination Footer */}
        <footer className="mt-12 flex items-center justify-between py-6 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing 3 of 12 Promotions
          </span>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={activePage === 1}
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePage === page
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-indigo-600"
                }`}
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={activePage === 3}
              onClick={() => setActivePage((p) => Math.min(3, p + 1))}
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </footer>
      </main>

      {/* ── Modal for Create/Edit Offer ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Offer" : "Create New Offer"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Summer Glow Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  placeholder="Describe your offer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_percent: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until *
                </label>
                <input
                  type="date"
                  required
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valid_until: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/offer-image.jpg"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Add a link to the offer image so it appears on both admin and customer cards.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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