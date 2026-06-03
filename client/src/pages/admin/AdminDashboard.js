import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-card shadow-card p-6 border-l-[4px] border-primary flex items-start justify-between relative">
      <div>
        <div className="text-[40px] font-bold font-heading text-dark leading-none mb-2">{value}</div>
        <div className="text-[12px] font-body font-bold text-grey uppercase tracking-widest">{label}</div>
      </div>
      <div className="text-primary">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
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

  const revenueThisMonth = appointments.reduce((sum, a) => {
    const d = new Date(a.appointment_date || a.created_at);
    const now = new Date();
    if (String(a.status).toLowerCase() !== 'cancelled' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      return sum + (Number(a.price ?? a.service_price ?? 0) || 0);
    }
    return sum;
  }, 0);

  // Weekly Bookings Chart Data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyCounts = daysOfWeek.map(() => 0);
  const now = new Date();
  
  appointments.forEach(a => {
    const d = new Date(a.appointment_date || a.created_at);
    // Simple check for current week
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7 && String(a.status).toLowerCase() !== 'cancelled') {
      const dayIdx = (d.getDay() + 6) % 7; // Mon=0, Sun=6
      weeklyCounts[dayIdx] += 1;
    }
  });

  const maxVal = Math.max(...weeklyCounts, 5);
  // Y-axis ticks (whole numbers)
  const ticks = Array.from({ length: 6 }, (_, i) => Math.ceil((maxVal / 5) * i));
  const maxTick = ticks[ticks.length - 1];

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'approved') return <span className="status-badge badge-approved">Approved</span>;
    if (s === 'cancelled') return <span className="status-badge badge-cancelled">Cancelled</span>;
    return <span className="status-badge badge-pending">Pending</span>;
  };

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Dashboard Overview" />
        
        <main className="p-page animate-fade-in">
          {/* Stats Row */}
          <section className="mb-section-gap">
            <div className="font-body text-label text-primary uppercase tracking-widest mb-4">At a Glance</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-element-gap">
              <StatCard icon="content_cut" label="Total Services" value={servicesCount} />
              <StatCard icon="calendar_month" label="Total Appointments" value={totalAppointments} />
              <StatCard icon="pending_actions" label="Pending Appointments" value={pendingAppointments} />
              <StatCard icon="group" label="Total Users" value={usersCount} />
            </div>
          </section>

          <div className="flex flex-col lg:flex-row gap-element-gap mb-section-gap">
            {/* Weekly Bookings Chart */}
            <section className="bg-white rounded-card shadow-card p-6 flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-h2 text-dark font-bold">Weekly Bookings Overview</h2>
                <div className="font-body text-[14px] text-grey">Last 7 Days</div>
              </div>
              
              <div className="relative h-[240px] flex items-end pl-8 pb-6">
                {/* Y-axis grid */}
                <div className="absolute inset-0 flex flex-col-reverse justify-between pb-6 pl-8">
                  {ticks.map((tick, i) => (
                    <div key={i} className="w-full border-t border-light-border relative">
                      <span className="absolute -left-8 -top-3 text-[12px] font-body text-grey w-6 text-right">{tick}</span>
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div className="relative w-full h-full flex justify-between items-end px-4 z-10">
                  {weeklyCounts.map((val, idx) => {
                    const heightPct = (val / maxTick) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center justify-end h-full w-[40px] group">
                        {val > 0 && (
                          <span className="text-[12px] font-bold text-dark mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {val}
                          </span>
                        )}
                        <div 
                          className={`w-full rounded-t-[6px] transition-all duration-300 ${val > 0 ? 'bg-primary hover:bg-[#b5943b]' : 'bg-[#F5F5F5]'}`}
                          style={{ height: `${heightPct}%`, minHeight: val > 0 ? '4px' : '4px' }}
                        ></div>
                        <div className="absolute -bottom-6 text-[12px] font-bold text-grey uppercase tracking-widest">
                          {daysOfWeek[idx]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Extra Stats (Revenue) */}
            <section className="bg-white rounded-card shadow-card p-6 w-full lg:w-[320px] flex flex-col justify-center">
              <h2 className="font-heading text-[18px] text-dark font-bold mb-6">Financial Snapshot</h2>
              <div className="mb-6">
                <div className="text-[36px] font-bold font-heading text-primary leading-none mb-2">NPR {revenueThisMonth}</div>
                <div className="text-[12px] font-body font-bold text-grey uppercase tracking-widest">Revenue This Month</div>
              </div>
              <div className="text-[13px] text-success font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                12% from last month
              </div>
            </section>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-card shadow-card overflow-hidden mb-4">
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
          
          <div className="text-right">
            <span className="font-body text-[12px] text-grey">Last updated: {formattedDate}</span>
          </div>
        </main>
      </div>
    </div>
  );
}