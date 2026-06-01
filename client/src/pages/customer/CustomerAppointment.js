import React, { useState, useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';

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
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      serviceName: "Signature Haircut & Style",
      serviceIcon: "content_cut",
      duration: "60 min",
      date: "Oct 24, 2024",
      time: "10:30 AM",
      specialistName: "Elena Vance",
      specialistAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCqcFtti0IIdzfEookIIBNdiuAkD4S9iONlcTT-ZUfIKVltVJv_qC0MfJXhzxErP087v-AChH_9LXeDHXyuydLE3AfbH8nTGDPT7ZhSwAbIntvjwZpw72SbYq9NhHaelnOYMy9dtp11XGmOmq17i5SG5ilPb7UtYTRGnwvZnapVwRNt8wEa_rt3xi9EkExFmRzsvN2zNHcvsPm1y5UJTQZmvbBV3FXu8n5sK0ixpUeEYOSCEZZ1_U1HxYnEMZdVTq5Oo2fSdaR8B5V",
      status: "approved",
    },
    {
      id: 2,
      serviceName: "Luxe Gel Manicure",
      serviceIcon: "brush",
      duration: "45 min",
      date: "Oct 28, 2024",
      time: "02:00 PM",
      specialistName: "Marcus Thorne",
      specialistAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1og-vB-sh6k3Rrd_xtkGi9lXstKlcBZTzl7_ppivykjXse9OOWtM0AzY83c-nyPp2IFi_1mlKxT1m1vLCIIXOMBpHcW7S3nd8hWIa-NiwXEjjjCsDKIbqR2PNt-dMHbo2Q5JDwF3TbmJPy44Kr1ks2gQC0B-4cGajKxU1XoG9WNkTALfgnCw2hNd5AhJOucMLlYE2hcBqXZP7He4pwQJ6qNleeENcjQhuIRbPvzREuS2lKYY3I1SKKVmKPH_6mDGLf2JHxjuYyAQY",
      status: "pending",
    },
    {
      id: 3,
      serviceName: "Radiance Facial Therapy",
      serviceIcon: "face_retouching_natural",
      duration: "90 min",
      date: "Oct 15, 2024",
      time: "09:00 AM",
      specialistName: "Sophia Chen",
      specialistAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaFh-VhbwJ0TmGFH6mM_-ocJu-knfPScUhzt_1_-y-Gzk8lExbzYKKtdigtphClAtDoDP9KBLLm08BQmtRXdenrINPUb_0tKewcsye3m70LtrWV-xDHri2xr6-Jh2NfFBxsrL2fvQ-t9P1ISTvNaZJ0JQqTXyHBybLxiBCno1DlkZLknAZEvsH83URhM7av-9cq-c48I8e8iR5T4vVHrkdp9Zny8yQ0qeT3yxf2KUQAL-EcE2IpINwnzslUgeS99g1wmUCjcdMc6ba",
      status: "cancelled",
    },
  ]);

  // State for row visibility animation
  const [rowVisibility, setRowVisibility] = useState([]);
  
  // Effect to handle staggered row animation when appointments change
  useEffect(() => {
    // Clear any existing timeouts
    let timeouts = [];
    
    // Reset visibility to all false
    setRowVisibility(new Array(appointments.length).fill(false));
    
    // Set staggered timeouts to make rows visible
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
    
    // Cleanup timeouts on unmount or appointments change
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [appointments]);

  // Action Handlers
  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
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
            className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-8 py-4 border border-primary hover:bg-white hover:text-primary transition-all duration-300"
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
                              <button 
                                onClick={() => handleReschedule(appointment.id)}
                                className="text-outline hover:text-primary transition-colors" 
                                title="Reschedule"
                              >
                                <span className="material-symbols-outlined">event_repeat</span>
                              </button>
                            )}
                            {appointment.status === 'pending' && (
                              <button 
                                onClick={() => handleMessageSpecialist(appointment.id)}
                                className="text-outline hover:text-primary transition-colors" 
                                title="Message"
                              >
                                <span className="material-symbols-outlined">chat_bubble_outline</span>
                              </button>
                            )}
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-outline hover:text-error transition-colors" 
                              title="Cancel"
                            >
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleBookAgain(appointment.id)}
                            className="px-4 py-2 border border-outline hover:bg-primary hover:text-white transition-all text-xs font-label-md uppercase"
                          >
                            Book Again
                          </button>
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