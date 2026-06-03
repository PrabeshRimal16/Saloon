import React, { useState, useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useAuth } from '../../context/AuthContext';

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return { class: 'bg-[#2D7A4F] text-white', label: 'APPROVED' };
    case 'pending':
      return { class: 'bg-[#C9A84C] text-white', label: 'PENDING' };
    case 'cancelled':
      return { class: 'bg-[#C0392B] text-white', label: 'CANCELLED' };
    default:
      return { class: 'bg-gray-400 text-white', label: 'UNKNOWN' };
  }
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [rowVisibility, setRowVisibility] = useState([]);
  
  useEffect(() => {
    if (!user || !user.id) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/appointments/my/${user.id}`)
      .then(r => r.json())
      .then(data => {
        const mapped = data.map(a => {
          const dt = a.appointment_date ? new Date(a.appointment_date) : null;
          let dateStr = '';
          let timeStr = '';
          let isDefaultMidnight = false;
          
          if (dt) {
            dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            if (timeStr === '12:00 AM') {
              isDefaultMidnight = true;
            }
          }

          return {
            id: a.id,
            serviceName: a.service_name || 'Service',
            serviceIcon: 'content_cut',
            duration: a.service_duration ? `${a.service_duration} min` : (a.duration || ''),
            date: dateStr,
            time: isDefaultMidnight ? '' : timeStr,
            status: a.status || 'pending'
          };
        });
        setAppointments(mapped);
      })
      .catch(err => console.error('Failed to load appointments', err));
  }, [user]);

  useEffect(() => {
    let timeouts = [];
    setRowVisibility(new Array(appointments.length).fill(false));
    appointments.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setRowVisibility(prev => {
          const newVisibility = [...prev];
          newVisibility[index] = true;
          return newVisibility;
        });
      }, 50 * (index + 1));
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [appointments]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!res.ok) throw new Error('Failed to cancel');
      const updated = await res.json();
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a));
    } catch (err) {
      console.error('Cancel error', err);
      alert('Failed to cancel appointment');
    }
  };

  const handleBookNewService = () => {
    alert('Book new service flow starting...');
  };

  const totalAppts = appointments.length;
  const approvedAppts = appointments.filter(a => a.status?.toLowerCase() === 'approved').length;
  const pendingAppts = appointments.filter(a => a.status?.toLowerCase() === 'pending').length;
  const cancelledAppts = appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length;

  return (
    <div className="min-h-screen bg-[#FBF8F2] font-sans flex flex-col">
      <CustomerNavbar />

      <main className="pt-[100px] pb-8 px-[32px] max-w-[1200px] w-full mx-auto flex-grow">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[32px] md:text-[40px] font-bold text-[#1A1A1A] m-0">
              My Appointments
            </h1>
            <p className="text-[#888888] text-[14px] mt-1">
              Manage your upcoming beauty sessions
            </p>
          </div>
          <button 
            onClick={handleBookNewService}
            className="bg-[#C9A84C] hover:bg-[#b59642] text-white px-5 py-2.5 rounded text-[14px] font-semibold transition-colors flex items-center gap-2"
          >
            + Book New Service
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EDE8DC] border-l-[4px] border-l-[#C9A84C]">
            <div className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</div>
            <div className="text-[24px] font-bold text-[#1A1A1A]">{totalAppts}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EDE8DC] border-l-[4px] border-l-[#2D7A4F]">
            <div className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Approved</div>
            <div className="text-[24px] font-bold text-[#1A1A1A]">{approvedAppts}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EDE8DC] border-l-[4px] border-l-[#C9A84C]">
            <div className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Pending</div>
            <div className="text-[24px] font-bold text-[#1A1A1A]">{pendingAppts}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EDE8DC] border-l-[4px] border-l-[#C0392B]">
            <div className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Cancelled</div>
            <div className="text-[24px] font-bold text-[#1A1A1A]">{cancelledAppts}</div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#FFFFFF] border border-[#EDE8DC] rounded-[12px] p-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FEF9ED] border-b border-[#EDE8DC]">
                  <th className="py-3 px-4 text-[12px] uppercase text-[#888] font-semibold tracking-[0.5px]">Service Name</th>
                  <th className="py-3 px-4 text-[12px] uppercase text-[#888] font-semibold tracking-[0.5px]">Date &amp; Time</th>
                  <th className="py-3 px-4 text-[12px] uppercase text-[#888] font-semibold tracking-[0.5px]">Duration</th>
                  <th className="py-3 px-4 text-[12px] uppercase text-[#888] font-semibold tracking-[0.5px]">Status</th>
                  <th className="py-3 px-4 text-[12px] uppercase text-[#888] font-semibold tracking-[0.5px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment, index) => {
                    const statusConfig = getStatusConfig(appointment.status);
                    const isCancelled = appointment.status?.toLowerCase() === 'cancelled';
                    const isVisible = rowVisibility[index];
                    const isEven = index % 2 === 0;
                    
                    return (
                      <tr 
                        key={appointment.id}
                        className={`${isEven ? 'bg-white' : 'bg-[#FDFAF4]'} hover:bg-[#FEF9ED] border-b border-[#F0EBE0] transition-colors`}
                        style={{
                          height: '72px',
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0px)' : 'translateY(10px)',
                          transition: 'all 0.4s ease-out'
                        }}
                      >
                        {/* Service Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#888] text-[20px]">{appointment.serviceIcon}</span>
                            <div>
                              <div className="font-bold text-[#1A1A1A]">{appointment.serviceName}</div>
                              <div className="text-[12px] text-[#888] mt-0.5">{appointment.duration || '—'}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Date & Time */}
                        <td className="py-3 px-4">
                          <div className="text-[#1A1A1A] whitespace-nowrap">{appointment.date || '—'}</div>
                          {appointment.time ? (
                            <div className="text-[#888] text-[12px] mt-0.5 whitespace-nowrap">{appointment.time}</div>
                          ) : (
                            <div className="text-[#888] text-[12px] mt-0.5 italic whitespace-nowrap">Time not set</div>
                          )}
                        </td>
                        
                        {/* Duration */}
                        <td className="py-3 px-4 text-[#888]">
                          {appointment.duration || '—'}
                        </td>
                        
                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[12px] font-[600] px-[12px] py-[4px] rounded-full ${statusConfig.class}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          {!isCancelled ? (
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)} 
                              className="inline-block border border-[#C0392B] text-[#C0392B] bg-transparent hover:bg-[#C0392B] hover:text-white px-4 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-[13px] text-gray-400">Cancelled</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {appointments.length > 5 && (
          <div className="flex items-center justify-between mb-8">
            <div className="text-[#888] text-[13px]">
              Showing {appointments.length} of {appointments.length} appointments
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#C9A84C] hover:bg-white disabled:opacity-50 border border-transparent" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#C9A84C] text-white font-bold text-[13px]">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#C9A84C] hover:bg-white border border-transparent font-bold text-[13px]" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Component */}
      <footer className="w-full mt-12 py-12 px-8 bg-[#1A1A1A] flex flex-col items-center justify-center gap-6">
        <h2 className="font-serif text-[28px] text-[#C9A84C] uppercase tracking-widest m-0">L'Atelier</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-[#888888] hover:text-[#C9A84C] text-[13px] uppercase tracking-wider transition-colors" href="#">Privacy Policy</a>
          <a className="text-[#888888] hover:text-[#C9A84C] text-[13px] uppercase tracking-wider transition-colors" href="#">Terms of Service</a>
          <a className="text-[#888888] hover:text-[#C9A84C] text-[13px] uppercase tracking-wider transition-colors" href="#">Career</a>
          <a className="text-[#888888] hover:text-[#C9A84C] text-[13px] uppercase tracking-wider transition-colors" href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default AppointmentsPage;