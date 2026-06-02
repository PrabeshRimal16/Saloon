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
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(startOfNextMonth.getTime() - 1);

  const upcomingWindowEnd = new Date(now.getTime());
  upcomingWindowEnd.setDate(upcomingWindowEnd.getDate() + 7);
  upcomingWindowEnd.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(now);
  const weekDayIndex = (now.getDay() + 6) % 7; // Monday=0, Sunday=6
  startOfWeek.setDate(now.getDate() - weekDayIndex);
  startOfWeek.setHours(0, 0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const getAppointmentDate = (a) => (a.appointment_date ? new Date(a.appointment_date) : null);
  const isCancelled = (a) => String(a.status || '').toLowerCase() === 'cancelled';
  const msPerDay = 1000 * 60 * 60 * 24;

  const upcomingBookings = appointments.filter((a) => {
    const d = getAppointmentDate(a);
    return d && d >= now && d <= upcomingWindowEnd && !isCancelled(a);
  }).length;

  const revenueThisMonth = appointments.reduce((sum, a) => {
    const d = getAppointmentDate(a);
    if (!d || isCancelled(a)) return sum;
    const price = Number(a.price ?? a.service_price ?? 0) || 0;
    if (d >= startOfMonth && d < startOfNextMonth) return sum + price;
    return sum;
  }, 0);

  const activeClients = new Set(
    appointments
      .filter((a) => !isCancelled(a) && getAppointmentDate(a) && getAppointmentDate(a) >= startOfMonth && getAppointmentDate(a) < startOfNextMonth)
      .map((a) => a.user_id)
  ).size;
  const pending = appointments.filter((a) => {
    const status = String(a.status || 'pending').toLowerCase();
    return status === 'pending' || status === 'new';
  }).length;

  // weekly breakdown (Mon-Sun) for upcoming 7 days
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyCounts = weekLabels.map(() => 0);
  // count bookings per weekday for current calendar week
  appointments.forEach((a) => {
    const d = getAppointmentDate(a);
    if (!d || isCancelled(a)) return;
    if (d >= startOfWeek && d <= endOfWeek) {
      const dayIdx = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      weeklyCounts[dayIdx] += 1;
    }
  });

  const totalWeekly = weeklyCounts.reduce((s, n) => s + (n || 0), 0);
  const weeklyBookings = totalWeekly;

  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentYear = now.getFullYear();
  const yearLabels = Array.from({ length: 4 }, (_, idx) => currentYear - (3 - idx));

  const monthlyRevenue = monthLabels.map((_, monthIndex) =>
    appointments.reduce((sum, a) => {
      const d = getAppointmentDate(a);
      if (!d || isCancelled(a) || d.getFullYear() !== currentYear || d.getMonth() !== monthIndex) return sum;
      return sum + (Number(a.price ?? a.service_price ?? 0) || 0);
    }, 0)
  );

  const yearlyRevenue = yearLabels.map((year) =>
    appointments.reduce((sum, a) => {
      const d = getAppointmentDate(a);
      if (!d || isCancelled(a) || d.getFullYear() !== year) return sum;
      return sum + (Number(a.price ?? a.service_price ?? 0) || 0);
    }, 0)
  );

  const buildLinePoints = (values, width, height) => {
    const max = Math.max(...values, 1);
    const step = values.length > 1 ? width / (values.length - 1) : width;
    return values
      .map((value, index) => {
        const x = index * step;
        const y = height - (value / max) * height;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const renderLineChart = (title, labels, values, totalLabel) => {
    const width = 360;
    const height = 140;
    const points = buildLinePoints(values, width, height);
    const totalValue = values.reduce((sum, value) => sum + value, 0);

    return (
      <div className="line-chart">
        <div className="line-chart-header">
          <div>
            <h3>{title}</h3>
            <p className="line-chart-sub">{totalLabel} total: {totalLabel === 'Revenue' ? `$${totalValue.toFixed(2)}` : totalValue}</p>
          </div>
          <div className="line-chart-summary">{totalLabel === 'Revenue' ? `$${totalValue.toFixed(2)}` : totalValue}</div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
          <polyline points={points} className="line-chart-line" />
          {values.map((value, idx) => {
            const x = idx * (values.length > 1 ? width / (values.length - 1) : width);
            const max = Math.max(...values, 1);
            const y = height - (value / max) * height;
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="4" className="line-chart-point" />
                {value > 0 && (
                  <text x={x} y={Math.max(12, y - 10)} textAnchor="middle" className="line-chart-point-label">
                    {totalLabel === 'Revenue' ? `$${value.toFixed(0)}` : value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="line-chart-labels">
          {labels.map((label) => (
            <div key={label} className="line-chart-label-item">{label}</div>
          ))}
        </div>
      </div>
    );
  };

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

            <div className="charts-grid">
              {renderLineChart('Revenue by month', monthLabels, monthlyRevenue, 'Revenue')}
              {renderLineChart('Revenue by year', yearLabels, yearlyRevenue, 'Revenue')}
            </div>

            <div className="action-cards">
              <div className="card">
                <div className="card-number">{weeklyBookings}</div>
                <div className="card-label">Bookings this week</div>
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