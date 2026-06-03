import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-card shadow-card p-6 border-l-[4px] border-primary flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-modal">
      <div>
        <div className="text-[36px] font-bold font-heading text-dark leading-none mb-2">{value}</div>
        <div className="text-[12px] font-body font-bold text-grey uppercase tracking-widest">{label}</div>
      </div>
      <div className="text-primary opacity-80">
        <span className="material-symbols-outlined text-[40px]">{icon}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { apiBaseUrl } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, srvRes, usrRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/appointments`, { withCredentials: true }).catch(() => ({ data: [] })),
          axios.get(`${apiBaseUrl}/api/services`, { withCredentials: true }).catch(() => ({ data: [] })),
          axios.get(`${apiBaseUrl}/api/users`, { withCredentials: true }).catch(() => ({ data: [] }))
        ]);
        if (!mounted) return;
        setAppointments(appRes.data || []);
        setServicesCount(srvRes.data?.length || 0);
        setUsersCount(usrRes.data?.length || 0);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [apiBaseUrl]);

  const pendingAppointments = appointments.filter(a => String(a.status).toLowerCase() === 'pending').length;
  const totalAppointments = appointments.length;

  // Chart data
  const now = new Date();
  const currentYear = now.getFullYear();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  const monthlyBookings = monthNames.map((_, i) => 
    appointments.filter(a => {
      const d = new Date(a.appointment_date || a.created_at);
      return d.getFullYear() === currentYear && d.getMonth() === i;
    }).length
  );

  const activeYears = Array.from(new Set(appointments.map(a => new Date(a.appointment_date || a.created_at).getFullYear()))).sort();
  if (!activeYears.includes(currentYear)) activeYears.push(currentYear);
  
  const yearlyBookings = activeYears.map(year => 
    appointments.filter(a => new Date(a.appointment_date || a.created_at).getFullYear() === year).length
  );

  const renderChart = (title, labels, data) => {
    const maxVal = Math.max(...data, 5);
    const chartHeight = 200;
    
    return (
      <div className="bg-white p-card rounded-card shadow-card flex-1">
        <h3 className="font-heading text-h3 text-dark mb-6">{title}</h3>
        {data.reduce((a, b) => a + b, 0) === 0 ? (
          <div className="empty-state py-8">
            <span className="material-symbols-outlined empty-state-icon">bar_chart</span>
            <p className="font-body text-body text-grey">No data yet</p>
          </div>
        ) : (
          <div className="relative h-[200px] flex items-end gap-2 mt-4">
            {data.map((val, idx) => {
              const heightPct = (val / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-[12px] py-1 px-3 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {val} {title.includes('Month') ? 'bookings' : 'bookings'}
                  </div>
                  
                  {/* Bar/Line Area representation (using styled bars for simplicity in custom react w/o chart.js) */}
                  <div 
                    className="w-full bg-primary rounded-t-[4px] transition-all duration-500 ease-out group-hover:brightness-110"
                    style={{ 
                      height: `${heightPct}%`, 
                      minHeight: val > 0 ? '4px' : '0',
                      background: `linear-gradient(to top, rgba(201,168,76,0.2), #C9A84C)`
                    }}
                  ></div>
                  
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-grey uppercase tracking-widest">
                    {labels[idx]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'approved') return <span className="status-badge badge-approved">Approved</span>;
    if (s === 'cancelled') return <span className="status-badge badge-cancelled">Cancelled</span>;
    return <span className="status-badge badge-pending">Pending</span>;
  };

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Dashboard Overview" />
        
        <main className="p-page animate-fade-in">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-element-gap mb-section-gap">
            <StatCard icon="content_cut" label="Total Services" value={servicesCount} />
            <StatCard icon="calendar_month" label="Total Appointments" value={totalAppointments} />
            <StatCard icon="pending_actions" label="Pending Appointments" value={pendingAppointments} />
            <StatCard icon="group" label="Total Users" value={usersCount} />
          </div>

          {/* Charts Row */}
          <div className="flex flex-col lg:flex-row gap-element-gap mb-section-gap">
            {renderChart('Bookings by Month', monthNames, monthlyBookings)}
            {renderChart('Bookings by Year', activeYears, yearlyBookings)}
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="p-6 border-b border-light-border bg-[#FEF9ED]">
              <h2 className="font-heading text-[20px] font-bold text-dark">Recent Appointments</h2>
            </div>
            
            {recentAppointments.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined empty-state-icon">calendar_month</span>
                <p className="font-body text-body text-grey">No recent appointments found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-light-border">
                      <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Service</th>
                      <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Date & Time</th>
                      <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map(app => (
                      <tr key={app.id} className="border-b border-light-border hover:bg-[#FEF9ED] transition-colors">
                        <td className="px-6 py-4 font-body text-[14px] text-dark font-medium">{app.user_name || 'Walk-in Customer'}</td>
                        <td className="px-6 py-4 font-body text-[14px] text-grey">{app.service_name || 'General Service'}</td>
                        <td className="px-6 py-4 font-body text-[14px] text-grey">
                          {new Date(app.appointment_date).toLocaleDateString()} at {app.appointment_time}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(app.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}