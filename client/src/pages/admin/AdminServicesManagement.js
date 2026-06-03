import React, { useState, useEffect, useMemo } from 'react';

const INPUT_CLS = "w-full bg-white border-[1.5px] border-[#EDE8DC] rounded-[8px] px-4 py-2.5 text-[14px] font-body outline-none transition-all focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] placeholder:text-[#AAAAAA]";
const API_BASE = process.env.REACT_APP_API_URL || '';

export default function AdminServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', duration: '', price: '', image: null, active: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : (data.services || []));
    } catch (err) {
      console.error('fetchServices', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('duration', formData.duration || '');
      fd.append('price', formData.price || '0');
      fd.append('active', formData.active ? '1' : '0');
      if (formData.image) fd.append('image', formData.image);
      if (editingService) {
        await fetch(`${API_BASE}/api/services/${editingService.id}`, { method: 'PUT', body: fd });
      } else {
        await fetch(`${API_BASE}/api/services`, { method: 'POST', body: fd });
      }
      setShowForm(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error('save service', err);
    }
  }

  async function handleToggleActive(service) {
    try {
      await fetch(`${API_BASE}/api/services/${service.id}/toggle-active`, { method: 'POST' });
      fetchServices();
    } catch (err) { console.error(err); }
  }

  async function handleUploadImage(service, file) {
    try {
      const fd = new FormData(); fd.append('image', file);
      await fetch(`${API_BASE}/api/services/${service.id}/image`, { method: 'POST', body: fd });
      fetchServices();
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_BASE}/api/services/${id}`, { method: 'DELETE' });
      setDeleteConfirm(null);
      fetchServices();
    } catch (err) { console.error(err); }
  }

  const categories = useMemo(() => ['All', ...new Set(services.map(s => s.category).filter(Boolean))], [services]);
  const filteredServices = useMemo(() => {
    let f = services || [];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      f = f.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q));
    }
    if (selectedCategory !== 'All') f = f.filter(s => s.category === selectedCategory);
    if (sortOption === 'price_asc') f = [...f].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (sortOption === 'price_desc') f = [...f].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    else if (sortOption === 'newest') f = [...f].sort((a, b) => (b.id || 0) - (a.id || 0));
    return f;
  }, [services, searchTerm, selectedCategory, sortOption]);

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <main className="p-8 animate-[fadeIn_0.3s_ease-in]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.35em] mb-1">Catalog</div>
            <p className="text-[#6B6B6B] text-[14px]">{services.length} services · {Math.max(0, categories.length - 1)} categories</p>
          </div>
          <button
            onClick={() => { setEditingService(null); setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null, active: true }); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#b5943b] shadow-[0_4px_16px_rgba(201,168,76,0.3)] transition-all hover:scale-[1.02] uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C] text-[20px] pointer-events-none">search</span>
            <input type="text" placeholder="Search services..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#F5F5F5] border border-transparent rounded-full py-2.5 pl-10 pr-4 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]" />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="border border-[#EDE8DC] bg-white rounded-full py-2.5 px-4 text-[14px] outline-none focus:border-[#C9A84C] cursor-pointer text-[#1A1A1A]">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}
            className="border border-[#EDE8DC] bg-white rounded-full py-2.5 px-4 text-[14px] outline-none focus:border-[#C9A84C] cursor-pointer text-[#1A1A1A]">
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest First</option>
          </select>
          {(searchTerm || selectedCategory !== 'All' || sortOption) && (
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSortOption(''); }}
              className="text-[13px] text-[#6B6B6B] hover:text-[#C0392B] font-medium transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">close</span> Reset
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#EDE8DC] border-t-[#C9A84C] rounded-full animate-spin" />
              <p className="text-[14px] text-[#6B6B6B]">Loading services…</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#FAFAF8] border-b border-[#EDE8DC]">
                <tr>
                  {['Service', 'Category', 'Duration', 'Price', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-4 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[#FEF9ED] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#C9A84C] text-[32px]">content_cut</span>
                      </div>
                      <p className="font-bold text-[16px] text-[#1A1A1A]">No services found</p>
                      <p className="text-[14px] text-[#6B6B6B]">Try adjusting filters or add a new service</p>
                    </div>
                  </td></tr>
                ) : (
                  filteredServices.map((service, index) => {
                    const img = service.imageUrl ? (service.imageUrl.startsWith('/') ? `${API_BASE}${service.imageUrl}` : service.imageUrl) : null;
                    const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]';
                    return (
                      <tr key={service.id} className={`${rowBg} border-b border-[#EDE8DC] hover:bg-[#FEF9ED] transition-colors`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <label className="w-[52px] h-[52px] rounded-[10px] bg-[#FEF9ED] border border-[#E8D9A0] flex items-center justify-center overflow-hidden cursor-pointer relative shrink-0 group hover:border-[#C9A84C] transition-colors">
                              {img
                                ? <img src={img} alt={service.name} className="w-full h-full object-cover" />
                                : <span className="material-symbols-outlined text-[#C9A84C] text-[24px]">content_cut</span>
                              }
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[18px]">upload</span>
                              </div>
                              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                onClick={e => e.stopPropagation()}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadImage(service, f); }} />
                            </label>
                            <div>
                              <div className="font-bold text-[14px] text-[#1A1A1A]">{service.name}</div>
                              <div className="text-[12px] text-[#6B6B6B] max-w-[220px] truncate">{service.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-[#FEF9ED] border border-[#E8D9A0] text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest rounded-full">
                            {service.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6B6B6B]">
                          {service.duration ? `${service.duration} min` : '—'}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-bold text-[#C9A84C]">
                          ${Number(service.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <div className="relative">
                              <input type="checkbox" className="sr-only" checked={service.active} onChange={() => handleToggleActive(service)} />
                              <div className={`w-10 h-5 rounded-full transition-colors ${service.active ? 'bg-[#C9A84C]' : 'bg-[#E0E0E0]'}`} />
                              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${service.active ? 'translate-x-5' : ''}`} />
                            </div>
                            <span className={`text-[12px] font-bold ${service.active ? 'text-[#2D7A4F]' : 'text-[#AAAAAA]'}`}>
                              {service.active ? 'Active' : 'Off'}
                            </span>
                          </label>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingService(service); setFormData({ name: service.name || '', description: service.description || '', category: service.category || '', duration: service.duration || '', price: service.price || '', image: null, active: service.active }); setShowForm(true); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-bold border border-[#EDE8DC] text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
                              <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                            </button>
                            <button onClick={() => setDeleteConfirm(service)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-bold border border-[#FBBAB7] text-[#C0392B] hover:bg-[#FDEDED] transition-all">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-right text-[12px] text-[#AAAAAA] mt-4">{filteredServices.length} of {services.length} services shown</p>

        {/* Create / Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 animate-[fadeIn_0.2s_ease]">
            <div className="bg-white rounded-[12px] w-full max-w-[520px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#EDE8DC] bg-[#FEF9ED] flex items-center justify-between">
                <div>
                  <h2 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1A1A1A]">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <p className="text-[13px] text-[#6B6B6B] mt-0.5">{editingService ? 'Update service details below' : 'Fill in the details for the new service'}</p>
                </div>
                <button onClick={() => { setShowForm(false); setEditingService(null); }} className="w-8 h-8 rounded-full bg-white border border-[#EDE8DC] flex items-center justify-center text-[#6B6B6B] hover:text-[#C0392B] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Service Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={INPUT_CLS} placeholder="e.g., Luxury Hair Sculpting" />
                </div>

                <div className="grid grid-cols-2 gap-4">
*** End Patch