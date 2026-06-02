import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon, label, value, sub, primary }) {
  return (
    <div className={`stat-card ${primary ? 'primary' : ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

const AdminDashboard = () => {
  const { user, logout, apiBaseUrl } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/api/appointments`, { withCredentials: true });
        if (!mounted) return;
        setAppointments(res.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load appointments');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAppointments();
    return () => { mounted = false; };
  }, [apiBaseUrl]);

  // derive stats from appointments
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const upcomingWindowEnd = new Date();
  upcomingWindowEnd.setDate(now.getDate() + 7);

  const upcomingBookings = appointments.filter((a) => {
    const d = a.appointment_date ? new Date(a.appointment_date) : null;
    return d && d >= now && d <= upcomingWindowEnd;
  }).length;

  const revenueThisMonth = appointments.reduce((sum, a) => {
    const d = a.appointment_date ? new Date(a.appointment_date) : null;
    const price = Number(a.price ?? a.service_price ?? a.service_price ?? 0) || 0;
    if (d && d >= startOfMonth && d <= endOfMonth) return sum + price;
    return sum;
  }, 0);

  const activeClients = new Set(appointments.map((a) => a.user_id || a.user_id || a.user_id)).size;
  const pending = appointments.filter((a) => !a.status || a.status === 'pending' || a.status === 'new').length;

  // weekly breakdown (Mon-Sun) for upcoming 7 days
  const weekLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const weeklyCounts = weekLabels.map((_, idx) => 0);
  // count bookings per weekday for next 7 days
  appointments.forEach((a) => {
    const d = a.appointment_date ? new Date(a.appointment_date) : null;
    if (!d) return;
    const diff = Math.ceil((d - now) / (1000*60*60*24));
    if (diff >= 0 && diff < 7) {
      const dayIdx = (d.getDay() + 6) % 7; // convert Sun=0 to index 6, Mon=0
      weeklyCounts[dayIdx] = (weeklyCounts[dayIdx] || 0) + 1;
    }
  });

  const totalWeekly = weeklyCounts.reduce((s,n)=>s+(n||0),0);

  const stats = [
    { label: 'Upcoming (7d)', value: upcomingBookings, sub: 'bookings' },
    { label: 'Revenue (month)', value: `$${revenueThisMonth.toFixed(2)}`, sub: 'this month' },
    { label: 'Active Clients', value: activeClients, sub: 'total' },
    { label: 'Pending', value: pending, sub: 'actions' },
  ];

  return (
    <div className="app">
      <AdminSidebar />
      <div className="main ml-64 pt-20 px-8 pb-8">
        <AdminHeader title="Overview" />
        <div className="content">

          <section className="performance">
            <div className="stats-grid">
              {loading ? <div>Loading...</div> : error ? <div style={{color:'red'}}>{error}</div> : stats.map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
              ))}
            </div>

            <div className="weeks-chart">
              <h2>Weekly Bookings</h2>
              {totalWeekly === 0 ? (
                <div className="hint">No bookings this week</div>
              ) : (
                weekLabels.map((d,i)=> {
                  const count = weeklyCounts[i] || 0;
                  const widthPct = count ? Math.min(100, count * 12) : 6; // minimum visible width
                  return (
                    <div className="week-bar" key={d}>
                      <div className="bar-label">{d}</div>
                      <div className="bar-bg"><div className="bar-fill" style={{ width: `${widthPct}%`, opacity: count ? 1 : 0.35 }} /></div>
                      <div className="bar-value">{count}</div>
                    </div>
                  );
                })
              )}
              <div className="chart-debug">
                Fetched {appointments.length} appointments — {appointments.length ? (() => {
                  const last = appointments[appointments.length - 1];
                  const dateStr = last && (last.appointment_date || last.created_at || last.date) ? new Date(last.appointment_date || last.created_at || last.date).toLocaleString() : 'no timestamp';
                  return `Last record: ${dateStr}`;
                })() : 'no appointments'}
              </div>
            </div>

            <div className="action-cards">
              <div className="card">
                <div className="card-number">{stats[0].value}</div>
                <div className="card-label">New bookings</div>
              </div>
              <div className="card revenue">
                <div className="card-number">{stats[1].value}</div>
                <div className="card-label">Revenue</div>
                <div className="trend-up">▲ 12% from last month</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;