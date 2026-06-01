import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const AdminAppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchContainerRef = useRef(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/appointments`)
      .then(r => r.json())
      .then(data => setAppointments(data))
      .catch(err => console.error('Failed to load appointments', err));
  }, []);

  const updateAppointmentStatus = async (id, status) => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a));
    } catch (err) {
      console.error('Update appointment status error', err);
      alert('Failed to update appointment status');
    }
  };

  // Derived values for UI
  const stats = appointments.reduce((acc, a) => {
    acc.total++;
    const s = (a.status || 'pending').toLowerCase();
    if (!acc.byStatus[s]) acc.byStatus[s] = 0;
    acc.byStatus[s]++;
    return acc;
  }, { total: 0, byStatus: {} });

  const filteredAppointments = appointments.filter(a => {
    if (filterStatus !== 'All' && (a.status || '').toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (a.customer_name || '').toLowerCase().includes(q) || (a.service_name || '').toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q);
  });

  // Row hover effect (translateX)
  const handleRowMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateX(8px)";
    e.currentTarget.style.transition = "transform 0.3s ease";
  };
  const handleRowMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateX(0)";
  };

  // Search input focus effect via class
  const handleSearchFocus = () => {
    searchContainerRef.current?.classList.add("scale-105");
  };
  const handleSearchBlur = () => {
    searchContainerRef.current?.classList.remove("scale-105");
  };

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Inject custom styles */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .glass-nav {
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
        .luxury-shadow {
          box-shadow: 0 4px 20px -5px rgba(212, 175, 55, 0.15);
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f9f9f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cfc4c5;
          border-radius: 10px;
        }
      `}</style>

      <AdminSidebar />

      {/* Main Content */}
      <main className="md:ml-64 pt-20 min-h-screen">
        <AdminHeader title="Appointment Management" />
        <div className="p-gutter max-w-container-max-width mx-auto">
          {/* Breadcrumb & Title */}
          <section className="mb-12">
            <nav className="flex items-center gap-2 mb-4">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Admin</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Appointments</span>
            </nav>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary">Appointment Management</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
                  Oversee and coordinate every luxury experience. From master stylists to exclusive spa treatments, manage the flow of the modern atelier.
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-4 py-2 rounded">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                  <span className="font-label-md text-label-md uppercase">This Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, service or email" className="input" />
                </div>
                <div className="flex items-center gap-2">
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="input">
                    <option>All</option>
                    <option>pending</option>
                    <option>approved</option>
                    <option>cancelled</option>
                  </select>
                </div>
                <button onClick={()=>{ setFilterStatus('All'); setQuery(''); }} className="btn">Reset</button>
                <button className="btn btn-ghost" onClick={()=>alert('Exporting...')}>Export</button>
              </div>
            </div>
          </section>

          {/* Quick Stats Row */}
          <section className="grid grid-cols-3 gap-4 mb-6">
            <div className="card flex items-center justify-between">
              <div>
                <div className="text-muted">Total Appointments</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
              <div className="text-muted">Overview</div>
            </div>
            <div className="card flex items-center justify-between">
              <div>
                <div className="text-muted">Pending</div>
                <div className="text-xl font-semibold">{stats.byStatus.pending || 0}</div>
              </div>
              <div className="badge bg-amber-100 text-amber-800">Pending</div>
            </div>
            <div className="card flex items-center justify-between">
              <div>
                <div className="text-muted">Approved</div>
                <div className="text-xl font-semibold">{stats.byStatus.approved || 0}</div>
              </div>
              <div className="badge bg-green-100 text-green-800">Approved</div>
            </div>

          {/* Load appointments on mount */}

          {/* Table Section */}
          <section className="bg-surface border border-outline-variant overflow-hidden luxury-shadow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Date &amp; Time</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Stylist</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredAppointments.map((a) => {
                  const dt = a.appointment_date ? new Date(a.appointment_date) : null;
                  const dateStr = dt ? dt.toLocaleDateString() : '';
                  const timeStr = dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                  return (
                    <tr key={a.id} className="service-row group" onMouseEnter={handleRowMouseEnter} onMouseLeave={handleRowMouseLeave}>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">{(a.customer_name || 'C').slice(0,2).toUpperCase()}</div>
                          <div>
                            <div className="font-body-md text-body-md font-bold text-primary">{a.customer_name}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-body-md text-body-md">{a.service_name}</div>
                        <div className="font-label-sm text-label-sm text-secondary-fixed-dim">{a.service_duration ? `${a.service_duration} mins` : ''}</div>
                      </td>
                      <td className="px-6 py-6 text-on-surface-variant">
                        <div className="font-body-md text-body-md">{dateStr}</div>
                        <div className="font-label-sm text-label-sm">{timeStr}</div>
                      </td>
                      <td className="px-6 py-6 text-on-surface-variant">
                        <div className="font-body-md text-body-md">{a.stylist || '-'}</div>
                        <div className="font-label-sm text-label-sm">{a.staff_role || ''}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`badge ${a.status === 'approved' ? 'bg-green-100 text-green-800' : a.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{(a.status||'pending')}</span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateAppointmentStatus(a.id, 'approved')} className="btn btn-primary">Approve</button>
                          <button onClick={() => updateAppointmentStatus(a.id, 'cancelled')} className="btn">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-6 py-6 border-t border-outline-variant flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Showing 4 of 24 appointments this week</p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-outline-variant hover:border-primary transition-all disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-label-sm text-label-sm px-4">Page 1 of 6</span>
                <button className="p-2 border border-outline-variant hover:border-primary transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          

          <footer className="mt-20 py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              © 2023 L'Atelier Admin Suite. All rights reserved.
            </div>
            <div className="flex gap-8">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors" href="#">Terms of Service</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors" href="#">Support</a>
            </div>
          </footer>
        </div>
      </main>

      {/* Contextual FAB */}
      <button className="fixed bottom-10 right-10 h-16 w-16 bg-primary text-on-primary rounded-full luxury-shadow flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all group">
        <span className="material-symbols-outlined text-[32px]">add</span>
        <span className="absolute right-full mr-4 bg-primary text-white font-label-md text-label-md uppercase px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-outline">Schedule New</span>
      </button>
    </div>
  );
};

export default AdminAppointmentManagement;