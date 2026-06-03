import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const C = { gold: '#C9A84C', dark: '#1A1A1A', grey: '#6B6B6B', border: '#EDE8DC', bg: '#F4F4F6', card: '#FFFFFF', success: '#2D7A4F', error: '#C0392B' };

function formatTime(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${parts[1]} ${ampm}`;
}

function StatCard({ icon, label, value, sub, loading }) {
  return (
    <div className="bg-white rounded-[12px] border-l-[4px] border-[#C9A84C] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6 flex items-start justify-between hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200">
      <div>
        {loading
          ? <div className="h-10 w-16 bg-gray-100 rounded animate-pulse mb-2" />
          : <div className="text-[42px] font-bold font-['Playfair_Display'] text-[#1A1A1A] leading-none mb-1.5">{value}</div>
        }
        <div className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">{label}</div>
        {sub && <div className="text-[12px] text-[#C9A84C] font-medium mt-1">{sub}</div>}
      </div>
      <div className="w-11 h-11 rounded-full bg-[#FEF9ED] border border-[#E8D9A0] flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[#C9A84C] text-[22px]">{icon}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  const cfg = s === 'approved'
    ? { bg: 'bg-[#EAF5EF]', text: 'text-[#2D7A4F]', label: 'Approved', dot: 'bg-[#2D7A4F]' }
    : s === 'cancelled'
    ? { bg: 'bg-[#FDEDED]', text: 'text-[#C0392B]', label: 'Cancelled', dot: 'bg-[#C0392B]' }
    : { bg: 'bg-[#FEF9ED]', text: 'text-[#C9A84C]', label: 'Pending', dot: 'bg-[#C9A84C]' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function AdminDashboard() {
  const { apiBaseUrl } = useAuth();
  const navigate = useNavigate();
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

  const pendingCount = appointments.filter(a => String(a.status).toLowerCase() === 'pending').length;
  const approvedCount = appointments.filter(a => String(a.status).toLowerCase() === 'approved').length;
  const totalAppointments = appointments.length;

  const revenueThisMonth = appointments.reduce((sum, a) => {
    const d = new Date(a.appointment_date || a.created_at);
    const now = new Date();
    if (String(a.status).toLowerCase() !== 'cancelled' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      return sum + (Number(a.price ?? a.service_price ?? 0) || 0);
    }
    return sum;
  }, 0);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  appointments.forEach(a => {
    const d = new Date(a.appointment_date || a.created_at);
    const diff = Math.floor((now - d) / 86400000);
    if (diff >= 0 && diff < 7 && String(a.status).toLowerCase() !== 'cancelled') {
      weeklyCounts[(d.getDay() + 6) % 7] += 1;
    }
  });
  const maxBar = Math.max(...weeklyCounts, 5);

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Overview" />
        <main className="p-8 animate-[fadeIn_0.3s_ease-in]">

          {/* Greeting */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.35em] mb-1">Dashboard</div>
              <p className="text-[#6B6B6B] text-[14px]">{formattedDate}</p>
            </div>
            <button onClick={() => navigate('/admin/appointments')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#b5943b] shadow-[0_4px_16px_rgba(201,168,76,0.3)] transition-all hover:scale-[1.02] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Appointment
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="content_cut" label="Total Services" value={servicesCount} loading={loading} />
            <StatCard icon="calendar_month" label="Total Bookings" value={totalAppointments} loading={loading} />
            <StatCard icon="pending_actions" label="Pending" value={pendingCount} sub={pendingCount > 0 ? "Needs attention" : undefined} loading={loading} />
            <StatCard icon="group" label="Total Users" value={usersCount} loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Weekly Chart */}
            <div className="lg:col-span-2 bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1A1A1A]">Weekly Bookings</h2>
                  <p className="text-[13px] text-[#6B6B6B] mt-0.5">Last 7 days activity</p>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#2D7A4F] bg-[#EAF5EF] px-3 py-1.5 rounded-full font-medium">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  {weeklyCounts.reduce((a, b) => a + b, 0)} this week
                </div>
              </div>

              <div className="relative h-[200px] pt-2">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-t border-dashed border-[#F0F0F0]" />
                  ))}
                </div>
                {/* Bars */}
                <div className="relative h-full flex items-end justify-around gap-2 px-2">
                  {weeklyCounts.map((val, idx) => {
                    const pct = maxBar > 0 ? (val / maxBar) * 100 : 0;
                    return (
                      <div key={idx} className="flex flex-col items-center justify-end flex-1 h-full group">
                        <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '100%' }}>
                          {val > 0 && (
                            <span className="text-[11px] font-bold text-[#1A1A1A] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                          )}
                          <div
                            className={`w-full max-w-[32px] rounded-t-[6px] transition-all duration-500 ${val > 0 ? 'bg-gradient-to-t from-[#b5943b] to-[#C9A84C] group-hover:from-[#9a7d32] group-hover:to-[#b5943b]' : 'bg-[#F0F0F0]'}`}
                            style={{ height: `${Math.max(pct, val > 0 ? 6 : 3)}%` }}
                          />
                        </div>
                        <div className="text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mt-2">{daysOfWeek[idx]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Revenue & Stats Panel */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#1C1C1E] rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.1)] p-6 flex-1">
                <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] mb-4">Revenue · This Month</div>
                <div className="text-[38px] font-bold font-['Playfair_Display'] text-white leading-none mb-1">
                  ${revenueThisMonth.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-[#2D7A4F] text-[13px] font-medium mt-3">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  12% from last month
                </div>
              </div>
              <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-5 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-[28px] font-bold font-['Playfair_Display'] text-[#2D7A4F]">{approvedCount}</div>
                  <div className="text-[11px] text-[#6B6B6B] uppercase tracking-wider font-bold mt-1">Approved</div>
                </div>
                <div className="text-center border-l border-[#EDE8DC]">
                  <div className="text-[28px] font-bold font-['Playfair_Display'] text-[#C0392B]">
                    {appointments.filter(a => String(a.status).toLowerCase() === 'cancelled').length}
                  </div>
                  <div className="text-[11px] text-[#6B6B6B] uppercase tracking-wider font-bold mt-1">Cancelled</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#EDE8DC] flex items-center justify-between">
              <div>
                <h2 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1A1A1A]">Recent Appointments</h2>
                <p className="text-[13px] text-[#6B6B6B] mt-0.5">Latest 5 bookings</p>
              </div>
              <button onClick={() => navigate('/admin/appointments')} className="text-[#C9A84C] text-[13px] font-bold hover:underline flex items-center gap-1">
                View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FEF9ED] flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[#C9A84C] text-[32px]">calendar_month</span>
                </div>
                <p className="font-bold text-[16px] text-[#1A1A1A]">No appointments yet</p>
                <p className="text-[14px] text-[#6B6B6B]">Appointments will appear here once booked</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAFAF8] border-b border-[#EDE8DC]">
                    <tr>
                      {['Customer', 'Service', 'Date & Time', 'Price', 'Status'].map(h => (
                        <th key={h} className="px-6 py-3.5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((app, i) => {
                      // Resolve name from all possible API field names
                      const displayName =
                        app.customer_name ||
                        app.user_name ||
                        app.name ||
                        app.client_name ||
                        'Walk-in Customer';
                      // Resolve email from all possible API field names
                      const displayEmail =
                        app.email ||
                        app.user_email ||
                        app.customer_email ||
                        app.client_email ||
                        null;
                      // Avatar initials
                      const initials = displayName
                        .split(' ')
                        .filter(Boolean)
                        .map(p => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      // Price
                      const price = Number(app.price ?? app.service_price ?? 0) || 0;

                      return (
                        <tr key={app.id} className={`border-b border-[#EDE8DC] hover:bg-[#FEF9ED] transition-colors ${i % 2 === 1 ? 'bg-[#FAFAF8]' : 'bg-white'}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#FEF9ED] border-[2px] border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-bold text-[12px] shrink-0">
                                {initials || 'W'}
                              </div>
                              <div>
                                <div className="font-bold text-[14px] text-[#1A1A1A] leading-tight">{displayName}</div>
                                {displayEmail && (
                                  <div className="text-[12px] text-[#6B6B6B] mt-0.5">{displayEmail}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-[14px] text-[#1A1A1A]">{app.service_name || 'General'}</div>
                            {app.service_duration && (
                              <div className="text-[12px] text-[#6B6B6B]">{app.service_duration} min</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-[14px] text-[#1A1A1A] font-medium">
                              {app.appointment_date
                                ? new Date(app.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : '—'}
                            </div>
                            {app.appointment_time ? (
                              <div className="text-[12px] text-[#6B6B6B] mt-0.5">
                                {formatTime(app.appointment_time)}
                              </div>
                            ) : (
                              <div className="text-[12px] text-[#AAAAAA] italic mt-0.5">
                                Time not set
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-[14px] text-[#C9A84C]">
                              {price > 0 ? `$${price.toLocaleString()}` : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-right text-[12px] text-[#AAAAAA] mt-4">Last updated: {formattedDate}</p>
        </main>
      </div>
    </div>
  );
}