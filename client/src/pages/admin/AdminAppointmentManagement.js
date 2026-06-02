import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const AdminAppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchContainerRef = useRef(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
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

  // (UI-only) No behavioral logic changes — styling handled in JSX below

  return (
    <div className="app">
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

      <AdminHeader title="Appointment Management" />

      {/* Main Content */}
      <div className="main ml-64 pt-20 px-8 pb-8">
        <div className="content">
          {/* Breadcrumb & Title */}
          <section className="mb-6 border-t-[3px] border-[#1a2035] pt-4">
            <nav className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500 font-semibold tracking-wider">Admin</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
              <span className="text-xs text-gray-700 font-semibold">Appointments</span>
            </nav>

            <div className="flex justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button className="inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-3 py-2 rounded-lg" aria-label="This week">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                  <span className="text-sm text-gray-700">This week</span>
                </button>

                <div className="min-w-[16rem]">
                  <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search appointments by name, service, or email" className="w-full px-4 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                  <option>All</option>
                  <option>pending</option>
                  <option>approved</option>
                  <option>cancelled</option>
                </select>
                <button onClick={()=>{ setFilterStatus('All'); setQuery(''); }} className="px-3 py-2 border rounded-lg text-sm">Reset</button>
                <button onClick={()=>alert('Exporting...')} className="px-3 py-2 bg-primary text-on-primary rounded-lg text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined">download</span>
                  Export
                </button>
              </div>
            </div>
          </section>

          {/* Quick Stats Row */}
          <section className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-blue-500">
              <div className="text-xs text-gray-500 font-semibold">Total appointments</div>
              <div className="text-2xl font-bold mt-2">{stats.total}</div>
              <div className="text-xs text-gray-400 mt-2">This week</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-amber-400">
              <div className="text-xs text-gray-500 font-semibold">Pending</div>
              <div className="text-2xl font-bold mt-2">{stats.byStatus.pending || 0}</div>
              <div className="text-xs text-gray-400 mt-2">Needs attention</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-green-500">
              <div className="text-xs text-gray-500 font-semibold">Approved</div>
              <div className="text-2xl font-bold mt-2">{stats.byStatus.approved || 0}</div>
              <div className="text-xs text-gray-400 mt-2">Confirmed</div>
            </div>

          </section>

          {/* Load appointments on mount */}

          {/* Table Section */}
          <section className="bg-white border border-outline-variant overflow-hidden rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider">Service</th>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider">Date &amp; time</th>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider">Stylist</th>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs text-gray-500 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredAppointments.map((a) => {
                  const dt = a.appointment_date ? new Date(a.appointment_date) : null;
                  const dateStr = dt ? dt.toLocaleDateString() : '';
                  const timeStr = dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                  return (
                    <tr key={a.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6 text-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">{(a.customer_name || 'C').slice(0,2).toUpperCase()}</div>
                          <div>
                            <div className="font-medium text-sm text-primary">{a.customer_name}</div>
                            <div className="text-xs text-gray-400">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm">
                        <div className="font-medium">{a.service_name}</div>
                        <div className="text-xs text-gray-400">{a.service_description || ''}</div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-700">{a.service_duration ? `${a.service_duration} min` : '—'}</td>
                      <td className="px-6 py-6 text-sm text-gray-700">
                        <div className="font-medium">{dateStr}</div>
                        <div className="text-xs text-gray-400">{timeStr}</div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-700">
                        <div className="font-medium">{a.stylist || '-'}</div>
                        <div className="text-xs text-gray-400">{a.staff_role || ''}</div>
                      </td>
                      <td className="px-6 py-6 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${a.status === 'approved' ? 'bg-green-100 text-green-800' : a.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{(a.status||'pending')}</span>
                      </td>
                      <td className="px-6 py-6 text-right text-sm">
                        <div className="flex justify-end gap-2 items-center">
                          <button onClick={() => updateAppointmentStatus(a.id, 'approved')} disabled={a.status === 'approved'} className={`px-3 py-1.5 rounded-lg text-sm ${a.status === 'approved' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            Approve
                          </button>
                          <button onClick={() => updateAppointmentStatus(a.id, 'cancelled')} className="border border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-sm">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between">
              <p className="text-sm text-gray-500">Showing {filteredAppointments.length} appointments</p>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 border rounded-lg disabled:opacity-40" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="text-sm text-gray-700">Page 1</div>
                <button className="px-3 py-1 border rounded-lg">
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
      </div>

      {/* FAB removed — New Appointment now available in toolbar */}
    </div>
  );
};

export default AdminAppointmentManagement;