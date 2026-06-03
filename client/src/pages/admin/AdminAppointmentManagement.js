import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function AdminAppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: updated.status });
      }
    } catch (err) {
      console.error('Update appointment status error', err);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (filterStatus !== 'All' && String(a.status).toLowerCase() !== filterStatus.toLowerCase()) return false;
    
    if (dateRange) {
      const appDate = a.appointment_date ? new Date(a.appointment_date).toISOString().split('T')[0] : '';
      if (appDate !== dateRange) return false;
    }

    if (!query) return true;
    const q = query.toLowerCase();
    return (a.customer_name || '').toLowerCase().includes(q) || 
           (a.service_name || '').toLowerCase().includes(q) || 
           (a.email || '').toLowerCase().includes(q);
  });

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'approved') return <span className="status-badge badge-approved">Approved</span>;
    if (s === 'cancelled') return <span className="status-badge badge-cancelled">Cancelled</span>;
    return <span className="status-badge badge-pending">Pending</span>;
  };

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden relative">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Manage Appointments" />
        
        <main className={`p-page animate-fade-in transition-all duration-300 ${selectedAppointment ? 'mr-[400px]' : ''}`}>
          {/* Top Bar inside Content */}
          <div className="flex items-center justify-between mb-section-gap">
            <h2 className="font-heading text-[24px] font-bold text-dark">Appointment Records</h2>
          </div>

          {/* White Card: Filters & Table */}
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            {/* Filters Row */}
            <div className="p-6 border-b border-light-border flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
                <input
                  type="text"
                  placeholder="Search customer name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <input 
                type="date" 
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="input-field w-[180px]"
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-[180px]">
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {(query || filterStatus !== 'All' || dateRange) && (
                <button onClick={() => { setQuery(''); setFilterStatus('All'); setDateRange(''); }} className="btn btn-secondary">
                  Reset
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FEF9ED] border-b border-light-border">
                  <tr>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Service</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Date & Time</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Phone</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="empty-state">
                          <span className="material-symbols-outlined empty-state-icon">calendar_month</span>
                          <p className="font-body text-body text-grey">No appointments found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app, index) => {
                      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF4]';
                      const isSelected = selectedAppointment?.id === app.id;
                      
                      return (
                        <tr 
                          key={app.id} 
                          onClick={() => setSelectedAppointment(app)}
                          className={`${isSelected ? 'bg-[rgba(201,168,76,0.08)] border-l-4 border-l-primary' : bgClass + ' border-l-4 border-transparent'} border-b border-light-border hover:bg-[#FEF9ED] transition-colors cursor-pointer`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-[40px] h-[40px] rounded-full bg-[#E8D9A0] flex items-center justify-center border border-primary shrink-0 text-primary font-bold">
                                {(app.customer_name || 'C').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-body text-[14px] font-bold text-dark">{app.customer_name}</div>
                                <div className="font-body text-[12px] text-grey">{app.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] font-medium text-dark">
                            {app.service_name || 'General'}
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-grey">
                            <div className="font-medium text-dark">{app.appointment_date ? new Date(app.appointment_date).toLocaleDateString() : '—'}</div>
                            <div>{app.appointment_time || '—'}</div>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-grey">
                            {app.phone || '—'}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                              {String(app.status).toLowerCase() !== 'approved' && (
                                <button onClick={() => updateAppointmentStatus(app.id, 'approved')} className="btn bg-success text-white hover:bg-[#205b3a] !px-3 !py-1 text-[13px]">
                                  Approve
                                </button>
                              )}
                              {String(app.status).toLowerCase() !== 'cancelled' && (
                                <button onClick={() => updateAppointmentStatus(app.id, 'cancelled')} className="btn bg-error text-white hover:bg-[#a02f23] !px-3 !py-1 text-[13px]">
                                  Cancel
                                </button>
                              )}
                              <button onClick={() => setSelectedAppointment(app)} className="btn btn-secondary !px-3 !py-1 text-[13px]">
                                View
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
      </div>

      {/* Side Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[400px] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-300 ease-in-out border-l border-light-border ${selectedAppointment ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedAppointment && (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-light-border flex justify-between items-center bg-[#FEF9ED]">
              <h3 className="font-heading text-[20px] font-bold text-dark">Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-grey hover:text-dark">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              {/* Customer Info */}
              <div>
                <h4 className="font-body text-label text-grey uppercase tracking-[0.5px] mb-4">Customer Information</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[56px] h-[56px] rounded-full bg-[#E8D9A0] flex items-center justify-center border-2 border-primary text-primary font-bold text-[20px]">
                    {(selectedAppointment.customer_name || 'C').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-body text-[18px] font-bold text-dark">{selectedAppointment.customer_name}</div>
                    <div className="font-body text-[14px] text-grey">{selectedAppointment.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-dark">
                  <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                  {selectedAppointment.phone || 'No phone provided'}
                </div>
              </div>

              <div className="h-[1px] bg-light-border"></div>

              {/* Service Info */}
              <div>
                <h4 className="font-body text-label text-grey uppercase tracking-[0.5px] mb-4">Service Details</h4>
                <div className="bg-[#FDFAF4] border border-light-border rounded-[8px] p-4">
                  <div className="font-body text-[16px] font-bold text-dark mb-2">{selectedAppointment.service_name || 'General Service'}</div>
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <div className="text-[12px] text-grey uppercase font-bold tracking-widest mb-1">Date</div>
                      <div className="font-body text-[14px] text-dark font-medium">{selectedAppointment.appointment_date ? new Date(selectedAppointment.appointment_date).toLocaleDateString() : '—'}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-grey uppercase font-bold tracking-widest mb-1">Time</div>
                      <div className="font-body text-[14px] text-dark font-medium">{selectedAppointment.appointment_time || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-light-border"></div>

              {/* Status & Actions */}
              <div>
                <h4 className="font-body text-label text-grey uppercase tracking-[0.5px] mb-4">Status & Actions</h4>
                <div className="mb-6">
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                
                <div className="flex flex-col gap-3">
                  {String(selectedAppointment.status).toLowerCase() !== 'approved' && (
                    <button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'approved')} className="btn bg-success text-white w-full">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Approve Appointment
                    </button>
                  )}
                  {String(selectedAppointment.status).toLowerCase() !== 'cancelled' && (
                    <button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')} className="btn bg-error text-white w-full">
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Drawer Overlay (mobile) */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}