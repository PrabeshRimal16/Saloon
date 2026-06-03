import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminOfferManagement() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "", description: "", discount_percent: "", valid_until: "", image: null, image_url: "",
  });
  const [toast, setToast] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => { fetchOffers(); }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/offers`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const offerImagePreview = formData.image
    ? URL.createObjectURL(formData.image)
    : formData.image_url
      ? (formData.image_url.startsWith("/") ? `${API_BASE}${formData.image_url}` : formData.image_url)
      : null;

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE}/api/offers/${editingId}` : `${API_BASE}/api/offers`;
      const body = new FormData();
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("discount_percent", formData.discount_percent);
      body.append("valid_until", formData.valid_until);
      if (formData.image) body.append("image", formData.image);
      const res = await fetch(url, { method, body });
      if (res.ok) {
        await fetchOffers();
        handleCloseModal();
        showToast(editingId ? "Offer updated successfully!" : "New offer created!");
      }
    } catch (err) {
      showToast("Failed to save offer", 'error');
    }
  };

  const handleDeleteOffer = async (id) => {
    setPendingDelete(id);
    setConfirmProps({
      title: 'Delete this offer?',
      message: 'This cannot be undone.',
      confirmText: 'Delete',
      confirmColor: '#C0392B',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/offers/${id}`, { method: "DELETE" });
          if (res.ok) { await fetchOffers(); showToast("Offer deleted."); }
        } catch (err) {
          showToast("Failed to delete offer", 'error');
        } finally {
          setConfirmOpen(false);
          setPendingDelete(null);
        }
      }
    });
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleEditOffer = (offer) => {
    setEditingId(offer.id);
    setFormData({ title: offer.title, description: offer.description, discount_percent: offer.discount_percent || "", valid_until: offer.valid_until || "", image: null, image_url: offer.image_url || "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", description: "", discount_percent: "", valid_until: "", image: null, image_url: "" });
  };

  const now = new Date();
  const filteredOffers = offers.filter(offer => {
    const isExpired = offer.valid_until && new Date(offer.valid_until) <= now;
    if (statusFilter === "active" && isExpired) return false;
    if (statusFilter === "expired" && !isExpired) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (offer.title || '').toLowerCase().includes(q) || (offer.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: offers.length,
    active: offers.filter(o => !o.valid_until || new Date(o.valid_until) > now).length,
    expired: offers.filter(o => o.valid_until && new Date(o.valid_until) <= now).length,
    avgDiscount: offers.length > 0 ? Math.round(offers.reduce((s, o) => s + (o.discount_percent || 0), 0) / offers.length) : 0,
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Offers & Promotions" />

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-[8px] text-white text-[14px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-fade-in ${toast.type === 'error' ? 'bg-[#C0392B]' : 'bg-[#2D7A4F]'}`}>
            <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            {toast.msg}
          </div>
        )}

        <main className="p-8 animate-fade-in">
          {/* Stats Row */}
          <div className="font-body text-[11px] text-[#C9A84C] uppercase tracking-widest mb-3">Overview</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Offers', value: stats.total, icon: 'local_offer', border: 'border-[#C9A84C]' },
              { label: 'Active', value: stats.active, icon: 'check_circle', border: 'border-[#2D7A4F]' },
              { label: 'Expired', value: stats.expired, icon: 'schedule', border: 'border-[#6B6B6B]' },
              { label: 'Avg Discount', value: `${stats.avgDiscount}%`, icon: 'percent', border: 'border-[#C9A84C]' },
            ].map(s => (
              <div key={s.label} className={`bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 border-l-4 ${s.border} flex items-center justify-between`}>
                <div>
                  <div className="text-[36px] font-bold font-heading text-[#1A1A1A] leading-none mb-1">{s.value}</div>
                  <div className="text-[11px] text-[#6B6B6B] uppercase tracking-widest font-bold">{s.label}</div>
                </div>
                <span className="material-symbols-outlined text-[#C9A84C] text-[24px]">{s.icon}</span>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C] text-[20px] pointer-events-none">search</span>
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-white border border-[#EDE8DC] rounded-full py-2.5 pl-10 pr-4 text-[14px] font-body w-56 outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] transition-all"
                />
              </div>
              <div className="flex gap-2">
                {["all", "active", "expired"].map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    className={`px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all ${
                      statusFilter === f
                        ? 'bg-[#C9A84C] text-white shadow-[0_4px_16px_rgba(201,168,76,0.3)]'
                        : 'bg-white border border-[#EDE8DC] text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                    }`}
                  >
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-white rounded-[8px] font-body text-[14px] font-bold hover:bg-[#b5943b] shadow-[0_4px_16px_rgba(201,168,76,0.3)] transition-all hover:scale-[1.02]">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add New Offer
            </button>
          </div>

          {/* Offers Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-[#EDE8DC] border-t-[#C9A84C] rounded-full animate-spin"></div>
              <p className="text-[14px] text-[#6B6B6B]">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center py-24 gap-4">
              <span className="material-symbols-outlined text-[#C9A84C] text-[56px] opacity-50">local_offer</span>
              <p className="font-heading text-[20px] font-bold text-[#1A1A1A]">No offers yet</p>
              <p className="text-[14px] text-[#6B6B6B]">Add your first promotion to get started</p>
              <button onClick={() => setShowModal(true)} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-white rounded-[8px] font-body text-[14px] font-bold hover:bg-[#b5943b] transition-all">
                <span className="material-symbols-outlined text-[20px]">add</span> Create Offer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOffers.map(offer => {
                const isExpired = offer.valid_until && new Date(offer.valid_until) <= now;
                const imgSrc = offer.image_url
                  ? (offer.image_url.startsWith('/') ? `${API_BASE}${offer.image_url}` : offer.image_url)
                  : null;

                return (
                  <article key={offer.id} className={`bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col border-t-4 border-[#C9A84C] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200 ${isExpired ? 'opacity-60' : ''}`}>
                    {/* Image / Placeholder */}
                    <div className="h-44 bg-gradient-to-br from-[#FEF9ED] to-[#E8D9A0] relative flex items-center justify-center overflow-hidden">
                      {imgSrc ? (
                        <img src={imgSrc} alt={offer.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#C9A84C] text-[64px] opacity-40">local_offer</span>
                      )}
                      {/* Discount Badge */}
                      {offer.discount_percent > 0 && (
                        <div className="absolute top-3 left-3 bg-[#C9A84C] text-white text-[18px] font-bold font-heading px-3 py-1 rounded-[6px] shadow">
                          {offer.discount_percent}% OFF
                        </div>
                      )}
                      {/* Status */}
                      <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isExpired ? 'bg-[#6B6B6B] text-white' : 'bg-[#2D7A4F] text-white'}`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-heading text-[18px] font-bold text-[#1A1A1A] mb-2 leading-snug">{offer.title}</h3>
                      <p className="font-body text-[13px] text-[#6B6B6B] leading-relaxed flex-1 line-clamp-2 mb-3">{offer.description}</p>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6B6B6B] mb-4">
                        <span className="material-symbols-outlined text-[16px] text-[#C9A84C]">event</span>
                        {offer.valid_until ? `Valid until ${new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'No expiry set'}
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-[#EDE8DC]">
                        <button onClick={() => handleEditOffer(offer)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-[6px] text-[13px] font-bold hover:bg-[#FEF9ED] transition-all">
                          <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                        </button>
                        <button onClick={() => handleDeleteOffer(offer.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-[#FBBAB7] text-[#C0392B] rounded-[6px] text-[13px] font-bold hover:bg-[#FDEDED] transition-all">
                          <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
        <ConfirmModal
          isOpen={confirmOpen}
          title={confirmProps.title}
          message={confirmProps.message}
          confirmText={confirmProps.confirmText}
          confirmColor={confirmProps.confirmColor}
          onConfirm={() => confirmProps.onConfirm && confirmProps.onConfirm()}
          onCancel={() => setConfirmOpen(false)}
        />

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
            <div className="bg-white rounded-[10px] w-full max-w-[500px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="p-5 border-b border-[#EDE8DC] bg-[#FEF9ED] flex justify-between items-center">
                <h2 className="font-heading text-[22px] font-bold text-[#1A1A1A]">
                  {editingId ? 'Edit Offer' : 'Create New Offer'}
                </h2>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#EDE8DC] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Offer Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white border-[1.5px] border-[#EDE8DC] rounded-[8px] px-4 py-2.5 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
                    placeholder="e.g., Summer Glow Package" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Description *</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white border-[1.5px] border-[#EDE8DC] rounded-[8px] px-4 py-2.5 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] resize-none"
                    placeholder="Describe your offer..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Discount % *</label>
                    <input type="number" required min="0" max="100" value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: e.target.value})}
                      className="w-full bg-white border-[1.5px] border-[#EDE8DC] rounded-[8px] px-4 py-2.5 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
                      placeholder="20" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Valid Until *</label>
                    <input type="date" required value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})}
                      className="w-full bg-white border-[1.5px] border-[#EDE8DC] rounded-[8px] px-4 py-2.5 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Offer Image</label>
                  <div className="relative border-2 border-dashed border-[#C9A84C] bg-[#FEF9ED] rounded-[8px] h-36 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-[rgba(201,168,76,0.08)] transition-colors">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})} />
                    {offerImagePreview ? (
                      <img src={offerImagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[#C9A84C] text-[36px] mb-2">cloud_upload</span>
                        <p className="text-[13px] font-medium text-[#1A1A1A]">Click to upload image</p>
                        <p className="text-[11px] text-[#6B6B6B]">JPG, PNG up to 5MB</p>
                      </>
                    )}
                  </div>
                  {formData.image && <p className="mt-1.5 text-[12px] text-[#2D7A4F] font-medium">{formData.image.name}</p>}
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#EDE8DC]">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 border border-[#EDE8DC] text-[#6B6B6B] rounded-[8px] text-[14px] font-medium hover:bg-[#F5F5F5] transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#C9A84C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#b5943b] shadow-[0_4px_16px_rgba(201,168,76,0.3)] transition-all">
                    {editingId ? 'Update Offer' : 'Create Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}