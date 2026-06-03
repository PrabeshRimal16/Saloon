import React, { useState, useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useAuth } from '../../context/AuthContext';

const getStatusConfig = (status) => {
  switch (status) {
    case 'approved':
      return { class: 'bg-[#C9A84C]/20 text-[#C9A84C]', label: 'Approved' };
    case 'pending':
      return { class: 'bg-gray-200 text-gray-600', label: 'Pending' };
    case 'cancelled':
      return { class: 'bg-red-100 text-red-600', label: 'Cancelled' };
    default:
      return { class: 'bg-gray-200 text-gray-600', label: 'Unknown' };
  }
};

const AppointmentsPage = () => {
  // State for appointments
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  // State for row visibility animation
  const [rowVisibility, setRowVisibility] = useState([]);
  
  // Fetch user's appointments when user becomes available
  useEffect(() => {
    if (!user || !user.id) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/appointments/my/${user.id}`)
      .then(r => r.json())
      .then(data => {
        const mapped = data.map(a => {
          const dt = a.appointment_date ? new Date(a.appointment_date) : null;
          return {
            id: a.id,
            serviceName: a.service_name || 'Service',
            serviceIcon: 'content_cut',
            duration: a.service_duration ? `${a.service_duration} min` : (a.duration || ''),
            date: dt ? dt.toLocaleDateString() : '',
            time: dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            specialistName: a.stylist || '',
            specialistAvatar: '',
            status: a.status || 'pending'
          };
        });
        setAppointments(mapped);
      })
      .catch(err => console.error('Failed to load appointments', err));
  }, [user]);

  // Effect to handle staggered row animation when appointments change
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
      }, 100 * (index + 1));
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [appointments]);

  // Action Handlers
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

  const handleReschedule = (id) => {
    alert(`Reschedule appointment ID: ${id} - feature coming soon`);
  };

  const handleMessageSpecialist = (id) => {
    alert(`Message specialist for appointment ID: ${id}`);
  };

  const handleBookAgain = (id) => {
    alert(`Book again for appointment ID: ${id}`);
  };

  const handleBookNewService = () => {
    alert('Book new service flow starting...');
  };

  const handleLogout = () => {
    alert('Logging out...');
  };

  const handleNotification = () => {
    alert('No new notifications');
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1A1A1A] font-sans">
      <CustomerNavbar />

      {/* Main Content */}
      <main className="pt-[120px] pb-24 px-8 max-w-7xl mx-auto min-h-[80vh]">
        {/* Breadcrumb & Back Action */}
        <div className="mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div className="space-y-4">
            <a className="group flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] hover:text-[#C9A84C] transition-colors mb-4 w-fit" href="#">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
            </a>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">
              My Appointments
            </h1>
            <p className="text-gray-600 max-w-md leading-relaxed">
              Manage your upcoming beauty sessions and review your historical visits at our atelier.
            </p>
          </div>
          <button 
            onClick={handleBookNewService}
            className="hidden md:flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#333] text-white px-6 py-4 rounded-sm transition-colors text-sm font-bold uppercase tracking-widest shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Book New Service</span>
          </button>
        </div>

        {/* Appointment Table Container */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#FBF8F2] border-b border-gray-200">
                  <th className="p-6 text-xs font-bold uppercase text-gray-500 tracking-widest whitespace-nowrap">Service Name</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500 tracking-widest whitespace-nowrap">Date &amp; Time</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500 tracking-widest whitespace-nowrap">Specialist</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500 tracking-widest whitespace-nowrap">Status</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500 tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment, index) => {
                    const statusConfig = getStatusConfig(appointment.status);
                    const isCancelled = appointment.status === 'cancelled';
                    const isVisible = rowVisibility[index];
                    
                    return (
                      <tr 
                        key={appointment.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0px)' : 'translateY(10px)',
                          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {/* Service Name Column */}
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#FBF8F2] flex items-center justify-center rounded-sm border border-gray-200 group-hover:border-[#C9A84C]/50 transition-colors">
                              <span className="material-symbols-outlined text-[#C9A84C]">{appointment.serviceIcon}</span>
                            </div>
                            <div>
                              <div className="font-serif text-lg text-[#1A1A1A]">{appointment.serviceName}</div>
                              <div className="text-xs text-gray-500 font-bold uppercase mt-1">Duration: {appointment.duration}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Date & Time Column */}
                        <td className={`p-6 ${isCancelled ? 'opacity-50' : ''}`}>
                          <div className="text-base text-[#1A1A1A] font-medium">{appointment.date || 'TBD'}</div>
                          <div className="text-sm text-gray-500 mt-1">{appointment.time || 'TBD'}</div>
                        </td>
                        
                        {/* Specialist Column */}
                        <td className={`p-6 ${isCancelled ? 'opacity-50' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                              {appointment.specialistAvatar ? (
                                <img 
                                  className="w-full h-full object-cover" 
                                  src={appointment.specialistAvatar} 
                                  alt={`Portrait of ${appointment.specialistName}`}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
                              )}
                            </div>
                            <span className="text-[#1A1A1A] font-medium">{appointment.specialistName || 'Any Specialist'}</span>
                          </div>
                        </td>
                        
                        {/* Status Column */}
                        <td className="p-6">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${statusConfig.class}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        
                        {/* Actions Column */}
                        <td className="p-6 text-right">
                          {!isCancelled ? (
                            <div className="flex justify-end gap-2">
                              {appointment.status === 'approved' && (
                                <button onClick={() => handleReschedule(appointment.id)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:bg-[#FBF8F2] rounded-sm transition-colors border border-transparent hover:border-[#C9A84C]/20" title="Reschedule">
                                  <span className="material-symbols-outlined text-[20px]">event_repeat</span>
                                </button>
                              )}
                              {appointment.status === 'pending' && (
                                <button onClick={() => handleMessageSpecialist(appointment.id)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 rounded-sm transition-colors border border-transparent hover:border-gray-200" title="Message">
                                  <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
                                </button>
                              )}
                              <button onClick={() => handleCancelAppointment(appointment.id)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors border border-transparent hover:border-red-100" title="Cancel">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => handleBookAgain(appointment.id)} className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:text-[#b59642] hover:underline underline-offset-4 transition-colors">
                              Book Again
                            </button>
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

        {/* Pagination / Summary */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Showing {appointments.length} of {appointments.length} appointments
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors rounded-sm bg-white shadow-sm disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold text-sm rounded-sm shadow-sm">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors font-bold text-sm rounded-sm bg-white shadow-sm">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors rounded-sm bg-white shadow-sm">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-16 px-8 flex flex-col items-center justify-center gap-8 text-center bg-[#FBF8F2] border-t border-gray-200 mt-auto">
        <span className="font-serif text-3xl text-[#1A1A1A] uppercase tracking-widest">L'Atelier</span>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">
            Terms of Service
          </a>
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">
            Career
          </a>
          <a className="text-gray-500 hover:text-[#C9A84C] text-sm uppercase tracking-wider font-medium transition-colors" href="#">
            Contact Us
          </a>
        </div>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <span className="text-xs text-gray-400 tracking-widest uppercase mt-4">
          © 2024 L'Atelier Modern. All Rights Reserved.
        </span>
      </footer>

      {/* Mobile FAB Button */}
      <button 
        onClick={handleBookNewService}
        className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-[#1A1A1A] text-[#C9A84C] rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-105 transition-transform"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default AppointmentsPage;