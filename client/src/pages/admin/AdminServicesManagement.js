import React, { useState, useMemo, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

const AdminServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', duration: '', price: '', image: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocus, setSearchFocus] = useState(false);
  const itemsPerPage = 3;

  const getBadgeColor = (category) => {
    if (!category) return 'bg-surface-container';
    const key = category.toLowerCase();
    if (key.includes('hair')) return 'bg-amber-100 text-amber-800';
    if (key.includes('skin') || key.includes('facial')) return 'bg-pink-100 text-pink-800';
    if (key.includes('nail')) return 'bg-sky-100 text-sky-800';
    if (key.includes('men')) return 'bg-slate-100 text-slate-800';
    return 'bg-surface-container';
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
      // map backend image_url to imageUrl for existing UI
      const mapped = data.map(s => ({
        ...s,
        imageUrl: s.image_url || s.imageUrl || '/uploads/placeholder.png',
        price: s.price == null ? 0 : Number(s.price)
      }));
      setServices(mapped);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = ['All', ...new Set(services.map(s => s.category || '').filter(Boolean))];

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    let filtered = services;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    return filtered;
  }, [services, searchTerm, selectedCategory]);

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
    setFormData({ name: service.name || '', description: service.description || '', category: service.category || '', duration: service.duration || '', price: service.price || '', image: null });
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
    <div className="bg-surface font-body-md text-on-surface">
      <AdminSidebar />

      <AdminHeader title="Service Catalog Management" />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen px-6 pb-12">
        <div className="mb-8 flex justify-end">
          <button onClick={openCreateForm} className="btn-accent flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="font-label-md text-label-md uppercase tracking-widest">Add New Service</span>
          </button>
        </div>

        {/* Filters & Search */}
        <section className="flex gap-gutter mb-8 items-center flex-wrap">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className={`w-full pl-12 pr-12 py-3 bg-surface-container-lowest border border-outline-variant/10 focus:border-secondary focus:ring-0 transition-all font-body-md text-body-md outline-none search-input ${searchFocus ? 'ring-1 ring-secondary/30' : ''}`}
              placeholder="Search services by name or description..."
            />
            {searchTerm && <button onClick={()=>{ setSearchTerm(''); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">✕</button>}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="font-label-sm text-label-sm text-outline">Category</label>
              <select value={selectedCategory} onChange={(e)=>handleFilterChange(e.target.value)} className="p-2 border search-input">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-label-sm text-label-sm text-outline">Sort</label>
              <select onChange={(e)=>{ const v=e.target.value; if(v==='price_asc') setServices(prev=>[...prev].sort((a,b)=>a.price-b.price)); if(v==='price_desc') setServices(prev=>[...prev].sort((a,b)=>b.price-a.price)); }} className="p-2 border">
                <option value="">Default</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
            <button onClick={()=>{ setSearchTerm(''); setSelectedCategory('All'); fetchServices(); }} className="btn">Reset</button>
          </div>
        </section>

        {/* Create / Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 w-full max-w-3xl rounded shadow-lg grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <h3 className="font-headline-md mb-3">{editingService ? 'Edit Service' : 'Create Service'}</h3>
                <label className="block mb-2 font-label-sm">Name</label>
                <input required className="w-full p-3 border mb-3" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />

                <label className="block mb-2 font-label-sm">Description</label>
                <textarea required className="w-full p-3 border mb-3" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-2 font-label-sm">Category</label>
                    <select required className="w-full p-2 border" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                      <option value="">Select category</option>
                      {Array.from(new Set([...(services.map(s=>s.category).filter(Boolean)), 'Hair Color', 'Skincare', "Men's Care", 'Grooming', 'Nail Artistry', 'Facial Therapy'])).map(cat=> (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-label-sm">Duration</label>
                    <input required className="w-full p-2 border" value={formData.duration} onChange={(e)=>setFormData({...formData, duration: e.target.value})} placeholder="e.g., 60" />
                    <p className="text-xs text-on-surface-variant mt-1">Duration in minutes</p>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block mb-2 font-label-sm">Price</label>
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
                      return <img src={url} alt="preview" className="w-full h-full object-cover" />;
                    }
                    if (editingService && (editingService.image_url || editingService.imageUrl)) {
                      const imgPath = editingService.image_url && editingService.image_url.startsWith('/') ? `${API_BASE}${editingService.image_url}` : (editingService.imageUrl || editingService.image_url);
                      return <img src={imgPath} alt="current" className="w-full h-full object-cover" />;
                    }
                    return <div className="text-on-surface-variant p-4">No image selected</div>;
                  })()}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={()=>{ setShowForm(false); setEditingService(null); setFormData({ name: '', description: '', category: '', duration: '', price: '', image: null }); }} className="px-4 py-2 border">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary text-on-primary">Save</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Service Table */}
        <div className="card bg-white border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-8 py-6 font-label-md text-label-md uppercase tracking-wider text-outline">Service Details</th>
                <th className="px-8 py-6 font-label-md text-label-md uppercase tracking-wider text-outline">Category</th>
                <th className="px-8 py-6 font-label-md text-label-md uppercase tracking-wider text-outline">Duration</th>
                <th className="px-8 py-6 font-label-md text-label-md uppercase tracking-wider text-outline">Price</th>
                <th className="px-8 py-6 font-label-md text-label-md uppercase tracking-wider text-outline text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedServices.map((service) => (
                <tr key={service.id} className="service-row group hover:bg-surface-container-low transition-all duration-300">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant/10">
                            {(() => {
                              const API_BASE = process.env.REACT_APP_API_URL || '';
                              const src = service.imageUrl && service.imageUrl.startsWith('/') ? `${API_BASE}${service.imageUrl}` : service.imageUrl;
                              return <img className="w-full h-full object-cover transition-all duration-700" src={src} alt={service.name} />;
                            })()}
                      </div>
                      <div>
                        <p className="font-headline-md text-[20px] text-primary mb-1">{service.name}</p>
                        <p className="font-body-md text-body-md text-outline">{service.description}</p>
                      </div>
                    </div>
                  </td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm uppercase ${getBadgeColor(service.category)}`}>{service.category}</span>
                      </td>
                  <td className="px-8 py-8">
                    <p className="font-body-md text-body-md">{service.duration}</p>
                  </td>
                  <td className="px-8 py-8">
                    <p className="font-label-md text-label-md font-bold text-secondary">${(Number(service.price) || 0).toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEditService(service)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 hover:bg-secondary transition-all duration-300">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        <span className="font-label-sm text-label-sm uppercase tracking-wider">Edit</span>
                      </button>
                      <button onClick={() => handleDeleteService(service.id)} className="flex items-center justify-center p-2 border border-outline-variant/30 hover:border-error hover:text-error transition-all group/remove" title="Remove Service">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedServices.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-on-surface-variant">
                    <div className="space-y-4">
                      <div>No services found.</div>
                      <div>
                        <button onClick={openCreateForm} className="px-4 py-2 bg-primary text-on-primary">Add your first service</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="mt-10 flex justify-between items-center px-2 flex-wrap gap-4">
          <p className="font-label-sm text-label-sm text-outline">
            Showing {filteredServices.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} services
          </p>
          <div className="flex gap-2">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 text-outline hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 3 && currentPage > 2) {
                pageNum = currentPage - 1 + i;
                if (pageNum > totalPages) return null;
              }
              return (
                <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-10 h-10 flex items-center justify-center font-label-md transition-all ${currentPage === pageNum ? 'bg-primary text-on-primary' : 'border border-outline-variant/30 hover:border-primary'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="w-10 h-10 flex items-center justify-center border border-outline-variant/30 text-outline hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
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