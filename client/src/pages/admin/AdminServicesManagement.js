import React, { useState, useMemo, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

export default function AdminServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', duration: '', price: '', image: null, active: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/services`);
      const data = await res.json();
      const mapped = data.map(s => ({
        ...s,
        imageUrl: s.image_url || s.imageUrl || '',
        price: s.price == null ? 0 : Number(s.price),
        duration: s.duration || '',
        category: s.category || '',
        active: typeof s.active === 'boolean' ? s.active : true,
      }));
      setServices(mapped);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => `NPR ${Number(value) || 0}`;

  const categories = ['All', ...new Set(services.map(s => s.category).filter(Boolean))];

  const handleUploadImage = async (service, file) => {
    if (!file) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    const fd = new FormData();
    fd.append('name', service.name || '');
    fd.append('description', service.description || '');
    fd.append('category', service.category || '');
    fd.append('duration', service.duration || '');
    fd.append('price', service.price || 0);
    fd.append('active', service.active ? 'true' : 'false');
    fd.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/api/services/${service.id}`, { method: 'PUT', body: fd });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const updated = await res.json();
      setServices(prev => prev.map(item => item.id === service.id ? { ...item, ...updated, imageUrl: updated.image_url || updated.imageUrl || item.imageUrl } : item));
    } catch (err) {
      console.error('Image upload failed', err);
    }
  };

  const handleToggleActive = async (service) => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    const fd = new FormData();
    fd.append('name', service.name || '');
    fd.append('description', service.description || '');
    fd.append('category', service.category || '');
    fd.append('duration', service.duration || '');
    fd.append('price', service.price || 0);
    fd.append('active', (!service.active).toString());
    try {
      const res = await fetch(`${API_BASE}/api/services/${service.id}`, { method: 'PUT', body: fd });
      if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
      const updated = await res.json();
      setServices(prev => prev.map(item => item.id === service.id ? { ...item, ...updated, active: typeof updated.active === 'boolean' ? updated.active : !item.active } : item));
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const filteredServices = useMemo(() => {
    let filtered = services;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(term) || (s.description||'').toLowerCase().includes(term) || (s.category||'').toLowerCase().includes(term));
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    if (sortOption === 'price_asc') {
      filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortOption === 'price_desc') {
      filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortOption === 'newest') {
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
    }
    return filtered;
  }, [services, searchTerm, selectedCategory, sortOption]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    fd.append('duration', formData.duration);
    fd.append('price', formData.price);
    fd.append('active', formData.active ? 'true' : 'false');
    if (formData.image) fd.append('image', formData.image);

    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const url = editingService ? `${API_BASE}/api/services/${editingService.id}` : `${API_BASE}/api/services`;
      const method = editingService ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error('Save failed');
      await fetchServices();
      setShowForm(false);
    } catch (err) {
      console.error('Failed to save service', err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchServices();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Service Catalog" />
        
        <main className="p-page animate-fade-in">
          {/* Top Bar inside Content */}
          <div className="flex items-center justify-between mb-section-gap">
            <div></div>
            <button onClick={() => { setEditingService(null); setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null, active: true }); setShowForm(true); }} className="btn btn-primary">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add New Service
            </button>
          </div>

          {/* White Card: Filters & Table */}
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            {/* Filters Row */}
            <div className="p-6 border-b border-light-border flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-field w-[180px]">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="input-field w-[180px]">
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FEF9ED] border-b border-light-border">
                  <tr>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Service</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Duration</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="empty-state">
                          <span className="material-symbols-outlined empty-state-icon">content_cut</span>
                          <p className="font-body text-body text-grey">No services found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service, index) => {
                      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF4]';
                      const API_BASE = process.env.REACT_APP_API_URL || '';
                      const img = service.imageUrl ? (service.imageUrl.startsWith('/') ? `${API_BASE}${service.imageUrl}` : service.imageUrl) : null;
                      
                      return (
                        <tr key={service.id} className={`${bgClass} border-b border-light-border hover:bg-[#FEF9ED] transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-[56px] h-[56px] rounded-[10px] bg-[#FEF9ED] flex items-center justify-center overflow-hidden border border-light-border shrink-0">
                                {img ? (
                                  <img src={img} alt={service.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="material-symbols-outlined text-primary text-[28px]">content_cut</span>
                                )}
                              </div>
                              <div>
                                <div className="font-body text-[14px] font-bold text-dark mb-1">{service.name}</div>
                                <div className="font-body text-[12px] text-grey max-w-[250px] truncate">{service.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full border-[1.5px] border-primary text-primary text-[11px] font-bold uppercase tracking-widest bg-white">
                              {service.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-grey">
                            {service.duration ? `${service.duration} min` : '—'}
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] font-bold text-primary">
                            {formatPrice(service.price)}
                          </td>
                          <td className="px-6 py-4">
                            <label className="flex items-center cursor-pointer">
                              <div className="relative">
                                <input type="checkbox" className="sr-only" checked={service.active} onChange={() => handleToggleActive(service)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${service.active ? 'bg-primary' : 'bg-[#E0E0E0]'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${service.active ? 'transform translate-x-4' : ''}`}></div>
                              </div>
                            </label>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingService(service); setFormData({ name: service.name||'', description: service.description||'', category: service.category||'', duration: service.duration||'', price: service.price||'', image: null, active: service.active }); setShowForm(true); }} className="btn btn-secondary !px-3 !py-1">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                Edit
                              </button>
                              <button onClick={() => handleDeleteService(service.id)} className="btn btn-secondary !px-3 !py-1 !border-error !text-error hover:!bg-[#FDEDED]">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="luxury-modal w-full max-w-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-h2 text-dark">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button onClick={() => setShowForm(false)} className="text-grey hover:text-dark">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-4">
                <div>
                  <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1">Service Name</label>
                  <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1">Category</label>
                    <input type="text" required className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1">Price</label>
                    <input type="number" required className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1">Duration (min)</label>
                  <input type="text" className="input-field" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                </div>

                <div>
                  <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1">Description</label>
                  <textarea rows={3} required className="input-field resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div>
                  <label className="block font-body text-label text-grey uppercase tracking-[0.5px] mb-1">Image Upload</label>
                  <div className="border-2 border-dashed border-primary bg-[#FEF9ED] rounded-[8px] p-6 text-center relative cursor-pointer hover:bg-[rgba(201,168,76,0.1)] transition-colors">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                    <span className="material-symbols-outlined text-primary text-[32px] mb-2">cloud_upload</span>
                    <p className="font-body text-[14px] text-dark font-medium">Drag & drop or click to upload</p>
                    {formData.image && <p className="mt-2 text-[12px] text-success">{formData.image.name}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button type="submit" className="btn btn-primary w-full text-center">Save Service</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn bg-transparent text-grey hover:text-dark hover:bg-[#F5F5F5] w-full text-center">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}