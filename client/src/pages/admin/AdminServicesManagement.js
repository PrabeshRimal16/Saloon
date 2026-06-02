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
    <div className="bg-gray-50 font-body-md text-on-surface">
      <AdminSidebar />

      <AdminHeader title="Service Catalog Management" />

      {/* Main Content */}
      <main className="ml-64 pt-20 px-8 pb-8">
        <div className="sticky top-16 z-30 mb-4 flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Services ({totalServices} total)</div>
            <div className="text-xs text-gray-500">{uniqueCategoriesCount} categories</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openCreateForm} className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg">
              <span className="material-symbols-outlined">add</span>
              Add New Service
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <section className="flex justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex-1 flex items-center gap-3">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Search services by name or description..."
            />
          </div>

          <div className="flex items-center gap-3">
            <select value={selectedCategory} onChange={(e)=>handleFilterChange(e.target.value)} className="p-2 border rounded-lg">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select onChange={(e)=>{ const v=e.target.value; if(v==='price_asc') setServices(prev=>[...prev].sort((a,b)=>a.price-b.price)); if(v==='price_desc') setServices(prev=>[...prev].sort((a,b)=>b.price-a.price)); }} className="p-2 border rounded-lg">
              <option value="">Sort</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
            <button onClick={()=>{ setSearchTerm(''); setSelectedCategory('All'); fetchServices(); }} className="px-3 py-2 border rounded-lg">Reset</button>
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
        <div className="rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden border-t-4 border-indigo-500">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-8 py-4 text-xs text-gray-500 font-semibold tracking-wider">Service details</th>
                <th className="px-8 py-4 text-xs text-gray-500 font-semibold tracking-wider">Category</th>
                <th className="px-8 py-4 text-xs text-gray-500 font-semibold tracking-wider">Duration</th>
                <th className="px-8 py-4 text-xs text-gray-500 font-semibold tracking-wider">Price</th>
                <th className="px-8 py-4 text-xs text-gray-500 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((service) => (
                <tr key={service.id} className={`group hover:bg-gray-50 transition-colors duration-150 ${getRowAccent(service.category)}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant/10">
                            {(() => {
                              const API_BASE = process.env.REACT_APP_API_URL || '';
                              const src = service.imageUrl && service.imageUrl.startsWith('/') ? `${API_BASE}${service.imageUrl}` : service.imageUrl;
                              return <img className="w-full h-full object-cover rounded-lg transition-all duration-700" src={src} alt={service.name} onError={(e)=>{ e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'; }} />;
                            })()}
                      </div>
                      <div>
                        <p className="font-headline-md text-[20px] text-primary mb-1">{service.name}</p>
                        <p className="font-body-md text-sm text-gray-400">{service.description}</p>
                      </div>
                    </div>
                  </td>
                      <td className="px-8 py-6">
                        {service.category ? (
                          <span className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm uppercase ${getBadgeColor(service.category)}`}>{service.category}</span>
                        ) : (
                          <div className="text-xs text-gray-400 italic">Not set</div>
                        )}
                      </td>
                  <td className="px-8 py-6">
                    <p className="font-body-md text-sm text-gray-700">{service.duration ? `${service.duration} min` : <span className="text-xs text-gray-400 italic">Not set</span>}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-label-md text-label-md font-bold text-secondary">${(Number(service.price) || 0).toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEditService(service)} className="border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteService(service.id)} className="border border-red-200 text-red-400 hover:bg-red-50 rounded-lg p-2" title="Remove Service">
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
                        <button onClick={openCreateForm} className="px-4 py-2 bg-primary text-on-primary rounded-md">Add your first service</button>
                      </div>
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