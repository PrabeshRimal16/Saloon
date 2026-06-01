import React, { useState, useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useAuth } from '../../context/AuthContext';

// Helper function to get status badge styling
const getStatusConfig = (status) => {
  switch (status) {
    case 'approved':
      return { class: 'bg-secondary-container text-on-secondary-container', label: 'Approved' };
    case 'pending':
      return { class: 'bg-surface-container-highest text-on-surface-variant', label: 'Pending' };
    case 'cancelled':
      return { class: 'bg-error-container text-on-error-container', label: 'Cancelled' };
    default:
      return { class: 'bg-surface-container-highest text-on-surface-variant', label: 'Unknown' };
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
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      {/* Main Content */}
      <main className="pt-[140px] pb-section-gap-desktop px-gutter max-w-container-max-width mx-auto">
        {/* Breadcrumb & Back Action */}
        <div className="mb-12 flex justify-between items-end">
          <div className="space-y-2">
            <a className="group flex items-center gap-2 text-outline hover:text-primary transition-colors mb-4" href="#">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="font-label-md text-label-md uppercase tracking-widest">Back to Dashboard</span>
            </a>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              My Appointments
            </h1>
            <p className="text-on-surface-variant max-w-md">
              Manage your upcoming beauty sessions and review your historical visits at our atelier.
            </p>
          </div>
          <button 
            onClick={handleBookNewService}
            className="hidden md:flex items-center gap-2 btn btn-primary"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="font-label-md text-label-md uppercase">Book New Service</span>
          </button>
        </div>

        {/* Appointment Table Container */}
        <div className="bg-white border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full atelier-table border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="p-6 font-label-md text-label-md uppercase text-outline tracking-wider">Service Name</th>
                  <th className="p-6 font-label-md text-label-md uppercase text-outline tracking-wider">Date &amp; Time</th>
                  <th className="p-6 font-label-md text-label-md uppercase text-outline tracking-wider">Specialist</th>
                  <th className="p-6 font-label-md text-label-md uppercase text-outline tracking-wider">Status</th>
                  <th className="p-6 font-label-md text-label-md uppercase text-outline tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {appointments.map((appointment, index) => {
                  const statusConfig = getStatusConfig(appointment.status);
                  const isCancelled = appointment.status === 'cancelled';
                  const isVisible = rowVisibility[index];
                  
                  return (
                    <tr 
                      key={appointment.id}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0px)' : 'translateY(10px)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {/* Service Name Column */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">{appointment.serviceIcon}</span>
                          </div>
                          <div>
                            <div className="font-headline-md text-[18px] text-primary">{appointment.serviceName}</div>
                            <div className="text-xs text-outline font-label-sm uppercase">Duration: {appointment.duration}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Date & Time Column */}
                      <td className={`p-6 ${isCancelled ? 'opacity-60' : ''}`}>
                        <div className="font-body-md text-on-surface">{appointment.date}</div>
                        <div className="text-sm text-outline">{appointment.time}</div>
                      </td>
                      
                      {/* Specialist Column */}
                      <td className={`p-6 ${isCancelled ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed-dim overflow-hidden">
                            <img 
                              className="w-full h-full object-cover" 
                              src={appointment.specialistAvatar} 
                              alt={`Portrait of ${appointment.specialistName}`}
                            />
                          </div>
                          <span className="font-body-md">{appointment.specialistName}</span>
                        </div>
                      </td>
                      
                      {/* Status Column */}
                      <td className="p-6">
                        <span className={`status-badge ${statusConfig.class}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="p-6 text-right">
                        {!isCancelled ? (
                          <div className="flex justify-end gap-4">
                            {appointment.status === 'approved' && (
                              <button onClick={() => handleReschedule(appointment.id)} className="btn" title="Reschedule"><span className="material-symbols-outlined">event_repeat</span></button>
                            )}
                            {appointment.status === 'pending' && (
                              <button onClick={() => handleMessageSpecialist(appointment.id)} className="btn" title="Message"><span className="material-symbols-outlined">chat_bubble_outline</span></button>
                            )}
                            <button onClick={() => handleCancelAppointment(appointment.id)} className="btn" title="Cancel"><span className="material-symbols-outlined">close</span></button>
                          </div>
                        ) : (
                          <button onClick={() => handleBookAgain(appointment.id)} className="btn btn-primary">Book Again</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination / Summary */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-outline font-label-sm uppercase">
            Showing {appointments.length} of {appointments.length} appointments
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-primary bg-primary text-white font-label-md">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:bg-primary hover:text-white transition-all font-label-md">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-section-gap-mobile md:py-section-gap-desktop px-gutter flex flex-col items-center justify-center gap-base text-center bg-surface border-t border-outline-variant/20">
        <span className="font-headline-lg text-headline-lg text-primary uppercase mb-8">L'Atelier</span>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">
            Privacy Policy
          </a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">
            Terms of Service
          </a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">
            Career
          </a>
          <a className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md" href="#">
            Contact Us
          </a>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-8">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <span className="font-label-sm text-label-sm text-outline font-headline-lg">
          © 2024 L'Atelier Modern. All Rights Reserved.
        </span>
      </footer>

      {/* Mobile FAB Button */}
      <button 
        onClick={handleBookNewService}
        className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default AppointmentsPage;