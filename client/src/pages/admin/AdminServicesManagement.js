import React, { useState, useMemo, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

const AdminServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', duration: '', price: '', image: null, active: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const itemsPerPage = 5;

  const getBadgeColor = (category) => {
    return 'gold-badge';
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/services`);
      const data = await res.json();
      // map backend image_url to imageUrl and set defaults
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

  const formatPrice = (value) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortOption('');
    setCurrentPage(1);
  };

  const sortServices = (list) => {
    const sorted = [...list];
    if (sortOption === 'price_asc') {
      sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortOption === 'price_desc') {
      sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortOption === 'newest') {
      sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortOption === 'oldest') {
      sorted.sort((a, b) => (a.id || 0) - (b.id || 0));
    }
    return sorted;
  };

  const handleRowSelect = (service) => {
    setSelectedServiceId(service.id === selectedServiceId ? null : service.id);
  };

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
      const res = await fetch(`${API_BASE}/api/services/${service.id}`, {
        method: 'PUT',
        body: fd,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const updated = await res.json();
      setServices((prev) => prev.map((item) => (item.id === service.id ? { ...item, ...updated, imageUrl: updated.image_url || updated.imageUrl || item.imageUrl } : item)));
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Image upload failed. Please try again.');
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
      const res = await fetch(`${API_BASE}/api/services/${service.id}`, {
        method: 'PUT',
        body: fd,
      });
      if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
      const updated = await res.json();
      setServices((prev) => prev.map((item) => (item.id === service.id ? { ...item, ...updated, active: typeof updated.active === 'boolean' ? updated.active : !item.active } : item)));
    } catch (err) {
      console.error('Status update failed', err);
      alert('Status could not be updated.');
    }
  };

  // Get unique categories for filter
  const categories = ['All', ...new Set(services.map(s => s.category || '').filter(Boolean))];

  // Summary stats for UI
  const totalServices = services.length;
  const uniqueCategoriesCount = new Set(services.map(s => s.category).filter(Boolean)).size;
  const avgPrice = totalServices ? (services.reduce((sum, s) => sum + (Number(s.price) || 0), 0) / totalServices) : 0;

  const getRowAccent = (category) => {
    if (!category) return '';
    const key = category.toLowerCase();
    if (key.includes('hair')) return 'border-l-4 border-l-amber-400';
    if (key.includes('skin') || key.includes('facial')) return 'border-l-4 border-l-pink-300';
    if (key.includes('nail')) return 'border-l-4 border-l-sky-300';
    return '';
  };

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    let filtered = services;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          (service.category || '').toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    return sortServices(filtered);
  }, [services, searchTerm, selectedCategory, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(start, start + itemsPerPage);
  }, [filteredServices, currentPage]);

  // Reset page when filters change
  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // CRUD operations
  const openCreateForm = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null });
    setShowForm(true);
  };

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
      if (editingService) {
        const res = await fetch(`${API_BASE}/api/services/${editingService.id}`, { method: 'PUT', body: fd });
        if (!res.ok) {
          const text = await res.text();
          console.error('Save failed', res.status, text);
          alert(`Save failed: ${res.status} ${text}`);
          return;
        }
        const updated = await res.json();
        await fetchServices();
        setShowForm(false);
        setEditingService(null);
        setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null });
      } else {
        const res = await fetch(`${API_BASE}/api/services`, { method: 'POST', body: fd });
        if (!res.ok) {
          const text = await res.text();
          console.error('Create failed', res.status, text);
          alert(`Create failed: ${res.status} ${text}`);
          return;
        }
        const created = await res.json();
        await fetchServices();
        // go to last page
        setCurrentPage(Math.ceil((services.length + 1) / itemsPerPage));
        setShowForm(false);
        setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null });
      }
    } catch (err) {
      console.error('Failed to save service', err);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      category: service.category || '',
      duration: service.duration || '',
      price: service.price || '',
      image: null,
      active: typeof service.active === 'boolean' ? service.active : true,
    });
    setShowForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        console.error('Delete failed', res.status, text);
        alert(`Delete failed: ${res.status} ${text}`);
        return;
      }
      await fetchServices();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  // Sidebar and top bar actions
  const handleNewAppointment = () => alert('Create new appointment');
  const handleSignOut = () => alert('Signing out...');
  const handleNotification = () => alert('No new notifications');
  const handleHelp = () => alert('Help & support');
  const handlePortalSearch = (e) => setSearchTerm(e.target.value);

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 font-body-md text-on-surface">
      <AdminSidebar />

      <AdminHeader title="Service Catalog Management" />

      {/* Main Content */}
      <main className="ml-64 pt-20 px-8 pb-8">
        <div className="sticky top-16 z-30 mb-4 card" style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>Services ({totalServices} total)</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{uniqueCategoriesCount} categories</div>
          </div>
          <div>
            <button onClick={openCreateForm} className="btn gold-btn" type="button">
              <span className="material-symbols-outlined">add</span>
              Add New Service
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <section className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(15,23,42,0.08)', padding: '1rem' }}>
          <div style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <span className="material-symbols-outlined" style={{ color: '#6b7280' }}>search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="input"
              placeholder="Search services by name or description..."
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <select value={selectedCategory} onChange={(e) => handleFilterChange(e.target.value)} className="input" style={{ minWidth: '180px' }}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={sortOption} onChange={(e) => handleSortChange(e.target.value)} className="input" style={{ minWidth: '180px' }}>
              <option value="">Sort</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <button onClick={handleResetFilters} className="btn btn-secondary" type="button">Reset</button>
          </div>
        </section>

        {/* Create / Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 w-full max-w-3xl rounded-xl shadow-xl grid grid-cols-3 gap-6">
                <div className="col-span-3 flex items-start justify-between">
                  <h3 className="font-headline-md mb-3">{editingService ? 'Edit Service' : 'Create Service'}</h3>
                  <button type="button" aria-label="Close" onClick={() => { setShowForm(false); setEditingService(null); }} className="text-gray-500 text-2xl">×</button>
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 font-label-sm">Name <span className="text-red-500">*</span></label>
                  <input required className="w-full p-3 border mb-3" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />

                  <label className="block mb-2 font-label-sm">Description <span className="text-red-500">*</span></label>
                  <textarea required maxLength={500} className="w-full p-3 border mb-1" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} />
                  <div className="text-xs text-gray-400 mb-3">{formData.description.length} / 500 characters</div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2 font-label-sm">Category <span className="text-red-500">*</span></label>
                      <select required className="w-full p-2 border" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                        <option value="">Select category</option>
                        {Array.from(new Set([...(services.map(s=>s.category).filter(Boolean)), 'Hair Color', 'Skincare', "Men's Care", 'Grooming', 'Nail Artistry', 'Facial Therapy'])).map(cat=> (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-label-sm">Duration <span className="text-red-500">*</span></label>
                      <input required className="w-full p-2 border" value={formData.duration} onChange={(e)=>setFormData({...formData, duration: e.target.value})} placeholder="e.g., 60" />
                      <p className="text-xs text-on-surface-variant mt-1">Duration in minutes</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block mb-2 font-label-sm">Price <span className="text-red-500">*</span></label>
                    <input required type="number" step="0.01" className="w-40 p-2 border" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="mb-4">
                    <label className="block mb-2 font-label-sm">Image</label>
                    <input type="file" accept="image/*" onChange={(e)=>setFormData({...formData, image: e.target.files[0]})} />
                  </div>
                  <div className="w-full h-48 bg-surface-container border border-outline-variant/10 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const API_BASE = process.env.REACT_APP_API_URL || '';
                      if (formData.image) {
                        const url = URL.createObjectURL(formData.image);
                        return <img src={url} alt="preview" className="w-full h-full object-cover rounded-lg" />;
                      }
                      if (editingService && (editingService.image_url || editingService.imageUrl)) {
                        const imgPath = editingService.image_url && editingService.image_url.startsWith('/') ? `${API_BASE}${editingService.image_url}` : (editingService.imageUrl || editingService.image_url);
                        return <img src={imgPath} alt="current" className="w-full h-full object-cover rounded-lg" />;
                      }
                      return <div className="text-on-surface-variant p-4 text-sm">Drop image here or click to upload</div>;
                    })()}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={()=>{ setShowForm(false); setEditingService(null); setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null }); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg">Save</button>
                  </div>
                </div>
              </form>
            </div>
        )}

        {/* Service Table */}
        <div className="card" style={{ border: '1px solid rgba(15,23,42,0.08)', overflow: 'hidden' }}>
          <table className="table-slim" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f4e9', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4b5563', fontSize: '0.78rem', letterSpacing: '0.08em' }}>Service</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4b5563', fontSize: '0.78rem', letterSpacing: '0.08em' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4b5563', fontSize: '0.78rem', letterSpacing: '0.08em' }}>Duration</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4b5563', fontSize: '0.78rem', letterSpacing: '0.08em' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#4b5563', fontSize: '0.78rem', letterSpacing: '0.08em' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#4b5563', fontSize: '0.78rem', letterSpacing: '0.08em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((service) => {
                const isSelected = service.id === selectedServiceId;
                const rowStyle = {
                  background: isSelected ? 'rgba(201,168,76,0.08)' : 'transparent',
                  borderLeft: isSelected ? '4px solid #C9A84C' : '4px solid transparent',
                  cursor: 'pointer',
                };
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const imageSrc = service.imageUrl ? (service.imageUrl.startsWith('/') ? `${API_BASE}${service.imageUrl}` : service.imageUrl) : '';
                return (
                  <tr key={service.id} style={rowStyle} className="service-row" onClick={() => handleRowSelect(service)}>
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ position: 'relative', display: 'block', width: 64, height: 64, borderRadius: 16, overflow: 'hidden', background: '#faf5e6', border: '1px solid rgba(15,23,42,0.08)', cursor: 'pointer' }}>
                          {imageSrc ? (
                            <img src={imageSrc} alt={service.name || 'Service'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a16207' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>content_cut</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadImage(service, file);
                            }}
                          />
                        </label>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{service.name}</div>
                          <div style={{ fontSize: '0.88rem', color: '#6b7280', maxWidth: 420 }}>{service.description || 'No service description yet.'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      {service.category ? (
                        <span className="badge gold-badge">{service.category}</span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>Not set</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <span style={{ color: service.duration ? '#111827' : '#9ca3af', fontStyle: service.duration ? 'normal' : 'italic' }}>
                        {service.duration ? `${service.duration} min` : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(service.price)}</span>
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <label className="status-switch" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={service.active}
                          onChange={() => handleToggleActive(service)}
                          style={{ display: 'none' }}
                        />
                        <span className="switch-track" style={{ width: 42, height: 22, borderRadius: 9999, background: service.active ? '#C9A84C' : '#d1d5db', position: 'relative', transition: 'background 0.2s ease' }}>
                          <span style={{ position: 'absolute', top: 2, left: service.active ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease' }} />
                        </span>
                        <span style={{ fontSize: '0.85rem', color: service.active ? '#115e59' : '#6b7280' }}>{service.active ? 'Active' : 'Inactive'}</span>
                      </label>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleEditService(service); }} className="btn gold-outline-btn">
                          <span className="material-symbols-outlined">edit</span>
                          Edit
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }} className="btn danger-outline-btn">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedServices.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '4rem 1rem', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#C9A84C' }}>search_off</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>No services found.</div>
                      <div style={{ maxWidth: 420, color: '#6b7280' }}>Try a different search or reset filters to discover services.</div>
                      <button type="button" onClick={handleResetFilters} className="btn gold-btn">Reset filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="mt-6 flex justify-between items-center px-2 flex-wrap gap-4">
          <p className="text-sm text-gray-500">
            Showing {filteredServices.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} services
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) return null;
              }
              return (
                <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-8 h-8 flex items-center justify-center text-sm ${currentPage === pageNum ? 'bg-indigo-600 text-white rounded-md' : 'border border-outline-variant/30 rounded-md'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border rounded-lg disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </footer>

        {/* Footer */}
        <footer className="mt-24 py-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-outline font-label-sm text-label-sm">
            © 2024 L'ATELIER MANAGEMENT SUITE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <a className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors uppercase tracking-wider" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors uppercase tracking-wider" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors uppercase tracking-wider" href="#">Support</a>
          </div>
        </footer>
      </main>

      {/* Background texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}></div>
    </div>
  );
};

export default AdminServicesManagement;