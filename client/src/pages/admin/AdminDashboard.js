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

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  const monthLabels = monthNames.slice(0, currentMonthIndex + 1);
  const monthlyBookings = monthLabels.map((_, monthIndex) =>
    appointments.filter((a) => {
      const d = getAppointmentDate(a);
      return d && !isCancelled(a) && d.getFullYear() === currentYear && d.getMonth() === monthIndex;
    }).length
  );

  const activeYears = new Set(
    appointments
      .filter((a) => {
        const d = getAppointmentDate(a);
        return d && !isCancelled(a);
      })
      .map((a) => getAppointmentDate(a).getFullYear())
  );
  activeYears.add(currentYear);
  const yearLabels = Array.from(activeYears).sort((a, b) => a - b);

  const yearlyBookings = yearLabels.map((year) =>
    appointments.filter((a) => {
      const d = getAppointmentDate(a);
      return d && !isCancelled(a) && d.getFullYear() === year;
    }).length
  );

  const getYAxisTicks = (maxValue) => {
    const maxTick = Math.max(0, Math.ceil(maxValue));
    if (maxTick <= 4) {
      return Array.from({ length: maxTick + 1 }, (_, idx) => idx);
    }
    const step = Math.ceil(maxTick / 4);
    const ticks = Array.from({ length: Math.floor(maxTick / step) + 1 }, (_, idx) => idx * step);
    if (ticks[ticks.length - 1] !== maxTick) ticks.push(maxTick);
    return Array.from(new Set(ticks));
  };

  const buildSmoothPath = (points) => {
    if (!points.length) return '';
    if (points.length === 1) return `M${points[0].x},${points[0].y}`;
    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const controlX = (prev.x + curr.x) / 2;
      path += ` C${controlX},${prev.y} ${controlX},${curr.y} ${curr.x},${curr.y}`;
    }
    return path;
  };

  const buildAreaPath = (points, chartHeight, marginTop) => {
    if (!points.length) return '';
    const last = points[points.length - 1];
    const first = points[0];
    const line = buildSmoothPath(points);
    return `${line} L${last.x},${marginTop + chartHeight} L${first.x},${marginTop + chartHeight} Z`;
  };

  const renderLineChart = (title, labels, values, totalLabel) => {
    const width = 380;
    const height = 220;
    const margin = { top: 28, right: 20, bottom: 36, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const max = Math.max(...values, 1);
    const totalValue = values.reduce((sum, value) => sum + value, 0);
    const xStep = values.length > 1 ? chartWidth / (values.length - 1) : chartWidth;
    const displayLabel = title.toLowerCase().includes('month') ? monthNames[currentMonthIndex] : currentYear;
    const points = values.map((value, index) => {
      const x = margin.left + index * xStep;
      const y = margin.top + chartHeight - (value / max) * chartHeight;
      return {
        x,
        y,
        label: labels[index],
        value,
        isCurrent: labels[index] === displayLabel,
      };
    });
    const linePath = buildSmoothPath(points);
    const areaPath = buildAreaPath(points, chartHeight, margin.top);
    const ticks = getYAxisTicks(max);

    return (
      <div className="line-chart">
        <div className="line-chart-header">
          <div>
            <h3>{title}</h3>
            <p className="line-chart-sub">{totalLabel} total: {totalValue}</p>
          </div>
          <div className="line-chart-summary line-chart-badge">{totalValue}</div>
        </div>
        {totalValue === 0 ? (
          <div className="line-chart-empty">
            <div className="line-chart-empty-title">No bookings yet</div>
            <div className="line-chart-empty-text">This chart will update once bookings are recorded.</div>
          </div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
            <defs>
              <linearGradient id={`goldGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7E7B4" stopOpacity="0.66" />
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} className="line-chart-axis" />
            <line x1={margin.left} y1={margin.top + chartHeight} x2={margin.left + chartWidth} y2={margin.top + chartHeight} className="line-chart-axis" />
            {ticks.map((tick) => {
              const y = margin.top + chartHeight - (tick / Math.max(max, 1)) * chartHeight;
              return (
                <g key={tick}>
                  <line x1={margin.left} y1={y} x2={margin.left + chartWidth} y2={y} className="line-chart-grid" />
                  <text x={margin.left - 10} y={y + 4} textAnchor="end" className="line-chart-axis-label">
                    {tick}
                  </text>
                </g>
              );
            })}
            <path d={areaPath} fill={`url(#goldGradient-${title.replace(/\s+/g, '')})`} />
            <path d={linePath} className="line-chart-line" />
            {points.map((point, idx) => (
              <g key={idx} className="line-chart-point-group">
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={point.isCurrent ? 6 : 5}
                  className={point.isCurrent ? 'line-chart-point line-chart-point-current' : 'line-chart-point'}
                />
                <title>{`${point.label}: ${point.value} ${totalLabel.toLowerCase()}`}</title>
              </g>
            ))}
            {labels.map((label, idx) => {
              const x = margin.left + idx * xStep;
              return (
                <text key={label} x={x} y={margin.top + chartHeight + 26} textAnchor="middle" className="line-chart-x-label">
                  {label}
                </text>
              );
            })}
          </svg>
        )}
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
              {renderLineChart('Bookings by month', monthLabels, monthlyBookings, 'Bookings')}
              {renderLineChart('Bookings by year', yearLabels, yearlyBookings, 'Bookings')}
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