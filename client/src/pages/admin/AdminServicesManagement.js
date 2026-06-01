import React, { useState, useMemo } from 'react';
import AdminNavbar from '../../components/AdminNavbar';

const AdminServicesManagement = () => {
  // Sample services data
  const initialServices = [
    {
      id: 1,
      name: 'Signature Balayage',
      description: 'Hand-painted highlights for a natural, sun-kissed look.',
      category: 'Hair Color',
      duration: '180 min',
      price: 350.00,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsIzWp0GDVuBfUhpvGaIA9jhtmDNVnu1YWsBShKuWKqD6D1D2xMxoAKXI356-jEt7xDiApkUKNieViCafae3zL_iBJrmKEfHulzLFV5IxkHR9LI8AHhHfVT464xz1lE2EvbwOmQxNj0jhTuxEWL3TmZs5MR4PKqRVGPMaLzCt6UWcTE0qHC_d7YXbZE3KRhF8g_xy4D0DrCLURlWFfXJoeVmJnCR_allqUHyAGmQ_8Di7Wv-k-D9SJLQ4s23V4FSCN1ixKh6bzuKHe'
    },
    {
      id: 2,
      name: 'HydraFacial Elite',
      description: 'Deep cleansing, exfoliation, and hydration with antioxidants.',
      category: 'Skincare',
      duration: '60 min',
      price: 225.00,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7jd2kkswMUlHQUP3Ro5zp9iaIi2MYir0O21kMczmjnJ729ZwE3up1XIkgDRr8U3hyxi-nEecbZ4DNLtThrvfL7T6Pe5-r2BQwTUwKhbO6X5CtaX6m_Bd_F4HSIRZ_Q9zV9zuwbidlc97HMjW3GXmNsMMN9x6SDNvy7aEeB3otLuatpgicG4OoOslCln1GJLdj7TKfH7Vrjkhbuk53l4lPUx33lpLZZtuRGUtH59e_movHJ-zmdD-nBwoEukurJIX7FPb3ozo6vs_x'
    },
    {
      id: 3,
      name: 'Executive Grooming',
      description: 'Precision cut, hot towel shave, and scalp massage.',
      category: "Men's Care",
      duration: '45 min',
      price: 85.00,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5fyQakwYNbpA3V3mXisfyAo_t8GJESCbbL3yyGERETNMiKEO8GZiox3lE1GofFWbgGG_z4N6deynrQ1E__sRHUADSEcU24fj0GUeUEmMbxrBs12OgrW0AR5xjT_rTrZIrsmvvcoqKgOmE2b6vcd0-wjaWfLc3pnin5Z1rJ_z3sPg4fLDMdTkVoH4lJd_qwFZsbL-3kYd10gaahOha5zAXjKZKXATAypQSnJXtq-6jVMSTfVVYmBZcuH7eQygbYDqpOxFVmLY9mOfF'
    }
  ];

  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocus, setSearchFocus] = useState(false);
  const itemsPerPage = 3;

  // Get unique categories for filter
  const categories = ['All', ...new Set(services.map(s => s.category))];

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
  const handleAddService = () => {
    const name = prompt('Enter service name:');
    if (!name) return;
    const description = prompt('Enter description:');
    const category = prompt('Enter category (Hair Color/Skincare/Men\'s Care):');
    const duration = prompt('Enter duration (e.g., 60 min):');
    const price = parseFloat(prompt('Enter price:'));
    if (isNaN(price)) return;
    const newId = Math.max(...services.map(s => s.id), 0) + 1;
    const newService = {
      id: newId,
      name,
      description,
      category,
      duration,
      price,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsIzWp0GDVuBfUhpvGaIA9jhtmDNVnu1YWsBShKuWKqD6D1D2xMxoAKXI356-jEt7xDiApkUKNieViCafae3zL_iBJrmKEfHulzLFV5IxkHR9LI8AHhHfVT464xz1lE2EvbwOmQxNj0jhTuxEWL3TmZs5MR4PKqRVGPMaLzCt6UWcTE0qHC_d7YXbZE3KRhF8g_xy4D0DrCLURlWFfXJoeVmJnCR_allqUHyAGmQ_8Di7Wv-k-D9SJLQ4s23V4FSCN1ixKh6bzuKHe'
    };
    setServices([...services, newService]);
    setCurrentPage(totalPages + 1); // go to last page
  };

  const handleEditService = (id) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    const newName = prompt('Edit name:', service.name);
    if (newName) service.name = newName;
    const newDesc = prompt('Edit description:', service.description);
    if (newDesc) service.description = newDesc;
    const newCategory = prompt('Edit category:', service.category);
    if (newCategory) service.category = newCategory;
    const newDuration = prompt('Edit duration:', service.duration);
    if (newDuration) service.duration = newDuration;
    const newPrice = parseFloat(prompt('Edit price:', service.price));
    if (!isNaN(newPrice)) service.price = newPrice;
    setServices([...services]); // force re-render
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
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
      <AdminNavbar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-12 pt-32">
        {/* Header */}
        <header className="flex justify-between items-end mb-16">
          <div>
            <nav className="flex gap-2 mb-4">
              <span className="font-label-sm text-label-sm text-outline uppercase">Admin</span>
              <span className="font-label-sm text-label-sm text-outline">/</span>
              <span className="font-label-sm text-label-sm text-primary uppercase">Service Catalog</span>
            </nav>
            <h2 className="font-headline-lg text-headline-lg text-primary">Service Catalog Management</h2>
          </div>
          <button onClick={handleAddService} className="flex items-center gap-3 bg-primary text-on-primary px-8 py-4 border border-primary hover:bg-white hover:text-primary transition-all duration-500 group">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="font-label-md text-label-md uppercase tracking-widest">Add New Service</span>
          </button>
        </header>

        {/* Filters & Search */}
        <section className="flex gap-gutter mb-10 items-center flex-wrap">
          <div className="flex-1 relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className={`w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-b border-outline-variant/30 focus:border-secondary focus:ring-0 transition-all font-body-md text-body-md outline-none ${searchFocus ? 'scale-[1.01]' : ''}`}
              placeholder="Search services..."
            />
          </div>
          <div className="flex gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 px-6 py-4 border border-outline-variant/30 font-label-md text-label-md uppercase hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Category
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white border border-outline-variant/30 shadow-lg hidden group-hover:block z-10 min-w-[160px]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(cat)}
                    className={`block w-full text-left px-4 py-2 hover:bg-surface-container-low ${selectedCategory === cat ? 'bg-secondary-container text-on-secondary-container' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-4 border border-outline-variant/30 font-label-md text-label-md uppercase hover:border-secondary transition-all">
              Price Range
            </button>
          </div>
        </section>

        {/* Service Table */}
        <div className="bg-white border border-outline-variant/20 overflow-hidden">
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
                        <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={service.imageUrl} alt={service.name} />
                      </div>
                      <div>
                        <p className="font-headline-md text-[20px] text-primary mb-1">{service.name}</p>
                        <p className="font-body-md text-body-md text-outline">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-1.5 border border-outline-variant/40 rounded-full font-label-sm text-label-sm uppercase">{service.category}</span>
                  </td>
                  <td className="px-8 py-8">
                    <p className="font-body-md text-body-md">{service.duration}</p>
                  </td>
                  <td className="px-8 py-8">
                    <p className="font-label-md text-label-md font-bold text-secondary">${service.price.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEditService(service.id)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 hover:bg-secondary transition-all duration-300">
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
                  <td colSpan="5" className="text-center py-12 text-on-surface-variant">No services found.</td>
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