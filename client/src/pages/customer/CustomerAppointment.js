import React, { useState, useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';

const CSS = `
  .appt-page { background: #FFFFFF; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* Header */
  .appt-header { max-width: 1200px; margin: 0 auto; padding: 56px 40px 40px; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
  @media (max-width: 700px) { .appt-header { flex-direction: column; align-items: flex-start; padding: 40px 24px 32px; } }
  .appt-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 10px; }
  .appt-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 52px; font-weight: 300; color: #1C1C1E; margin: 0; letter-spacing: -0.5px; }
  .appt-sub { font-size: 15px; color: #6B6B6B; margin: 8px 0 0; }

  .btn-book-new {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 50px; border: none; cursor: pointer; flex-shrink: 0;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px; color: white;
    background: linear-gradient(90deg, #B8960C 0%, #D4AF37 50%, #B8960C 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    box-shadow: 0 4px 20px rgba(184,150,12,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-book-new:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,150,12,0.45); }

  /* Stat Cards */
  .stats-row { max-width: 1200px; margin: 0 auto; padding: 0 40px 40px; display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 500px) { .stats-row { grid-template-columns: 1fr 1fr; padding: 0 24px 32px; } }

  .stat-card-lux { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); position: relative; overflow: hidden; transition: box-shadow 0.3s, transform 0.3s; }
  .stat-card-lux:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.12); transform: translateY(-3px); }
  .stat-icon-circle { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(184,150,12,0.1); display: flex; align-items: center; justify-content: center; }
  .stat-icon-circle .mat-icon { font-size: 20px; color: #B8960C; }
  .stat-label-top { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #AAAAAA; margin-bottom: 12px; }
  .stat-num { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 40px; font-weight: 600; color: #1C1C1E; line-height: 1; margin-bottom: 16px; }
  .stat-accent-line { height: 3px; border-radius: 2px; margin-top: auto; }

  /* Table */
  .table-wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; }
  @media (max-width: 768px) { .table-wrap { padding: 0 24px 60px; } }
  .table-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; min-width: 680px; }
  thead tr { background: #F8F7F5; border-bottom: 1px solid #E8E0D5; }
  thead th { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #AAAAAA; padding: 16px 20px; text-align: left; white-space: nowrap; }
  tbody tr { border-bottom: 1px solid #F0EBE0; transition: background 0.15s; min-height: 80px; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #FDFCFA; }
  tbody td { padding: 20px; vertical-align: middle; font-family: 'DM Sans', sans-serif; }

  /* Thumbnail */
  .svc-thumb { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(145deg,#2A2A2A,#1C1C1E); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .svc-thumb .mat-icon { font-size: 20px; color: rgba(184,150,12,0.8); }

  /* Status pills */
  .badge { display: inline-flex; align-items: center; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  .badge-approved { background: rgba(45,122,79,0.12); color: #1E6B40; }
  .badge-pending  { background: rgba(184,150,12,0.12); color: #8B7209; }
  .badge-cancelled{ background: rgba(192,57,43,0.1); color: #A63020; }
  .badge-default  { background: #F0EBE0; color: #6B6B6B; }

  /* Action btn */
  .btn-cancel-row { padding: 8px 20px; border-radius: 50px; background: transparent; border: 1.5px solid #C0392B; color: #C0392B; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s, color 0.2s; white-space: nowrap; }
  .btn-cancel-row:hover { background: #C0392B; color: white; }

  /* Empty */
  .table-empty { padding: 72px 24px; text-align: center; color: #AAAAAA; }

  /* Pagination */
  .pagination { max-width: 1200px; margin: 0 auto; padding: 24px 40px 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  @media (max-width: 600px) { .pagination { flex-direction: column; align-items: flex-start; padding: 24px 24px 0; } }
  .pagination-info { font-size: 13px; color: #AAAAAA; }
  .pagination-btns { display: flex; gap: 8px; }
  .pag-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #E8E0D5; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #1C1C1E; transition: all 0.2s; }
  .pag-btn:hover { border-color: #B8960C; color: #B8960C; }
  .pag-btn.active { background: #B8960C; border-color: #B8960C; color: white; }
  .pag-btn:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':  return { cls: 'badge badge-approved', label: 'Approved',  icon: 'check_circle', accentColor: '#2D7A4F' };
    case 'pending':   return { cls: 'badge badge-pending',  label: 'Pending',   icon: 'schedule',    accentColor: '#B8960C' };
    case 'cancelled': return { cls: 'badge badge-cancelled',label: 'Cancelled', icon: 'cancel',      accentColor: '#C0392B' };
    default:          return { cls: 'badge badge-default',  label: 'Unknown',   icon: 'help',        accentColor: '#AAAAAA' };
  }
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const API_BASE = process.env.REACT_APP_API_URL || '';
    fetch(`${API_BASE}/api/appointments/my/${user.id}`)
      .then(r => r.json())
      .then(data => {
        const mapped = data.map(a => {
          const dt = a.appointment_date ? new Date(a.appointment_date) : null;
          let dateStr = '', timeStr = '';
          if (dt) {
            dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const t = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            timeStr = t === '12:00 AM' ? '' : t;
          }
          return { id: a.id, serviceName: a.service_name || 'Service', duration: a.service_duration ? `${a.service_duration} min` : '', date: dateStr, time: timeStr, status: a.status || 'pending' };
        });
        setAppointments(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id) => {
    setPendingCancel(id);
    setConfirmProps({
      title: 'Cancel your appointment?',
      message: 'This action cannot be undone.',
      confirmText: 'Cancel Appointment',
      confirmColor: '#C0392B',
      onConfirm: async () => {
        try {
          const API_BASE = process.env.REACT_APP_API_URL || '';
          const res = await fetch(`${API_BASE}/api/appointments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) });
          if (!res.ok) throw new Error();
          const updated = await res.json();
          setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a));
        } catch {
          setConfirmProps({ title: 'Error', message: 'Failed to cancel appointment.', confirmText: 'OK', confirmColor: '#C0392B', onConfirm: () => setConfirmOpen(false) });
        } finally {
          setConfirmOpen(false);
          setPendingCancel(null);
        }
      }
    });
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState({});
  const [pendingCancel, setPendingCancel] = useState(null);

  const total = appointments.length;
  const approved = appointments.filter(a => a.status?.toLowerCase() === 'approved').length;
  const pending = appointments.filter(a => a.status?.toLowerCase() === 'pending').length;
  const cancelled = appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length;

  const stats = [
    { label: 'Total', value: total, icon: 'calendar_month', color: '#B8960C' },
    { label: 'Approved', value: approved, icon: 'check_circle', color: '#2D7A4F' },
    { label: 'Pending', value: pending, icon: 'schedule', color: '#B8960C' },
    { label: 'Cancelled', value: cancelled, icon: 'cancel', color: '#C0392B' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="appt-page">
        <CustomerNavbar />

        <main style={{ paddingTop: 72 }}>
          {/* Header */}
          <div className="appt-header">
            <div>
              <p className="appt-eyebrow">Your Schedule</p>
              <h1 className="appt-h1">My Appointments</h1>
              <p className="appt-sub">Manage your upcoming beauty sessions</p>
            </div>
            <button className="btn-book-new" onClick={() => {
              setConfirmProps({ title: 'Coming soon', message: 'Book new service coming soon!', confirmText: 'OK', confirmColor: '#B8960C', onConfirm: () => setConfirmOpen(false) });
              setConfirmOpen(true);
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Book New Service
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {stats.map(s => (
              <div key={s.label} className="stat-card-lux">
                <div className="stat-icon-circle" style={{ background: `${s.color}18` }}>
                  <span className="material-symbols-outlined mat-icon" style={{ color: s.color }}>{s.icon}</span>
                </div>
                <p className="stat-label-top">{s.label}</p>
                <p className="stat-num">{s.value}</p>
                <div className="stat-accent-line" style={{ background: s.color }} />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="table-wrap">
            <div className="table-card">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Date &amp; Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="table-empty">
                        <div style={{ width:36, height:36, border:'2px solid #B8960C', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                        Loading your appointments...
                      </td></tr>
                    ) : appointments.length === 0 ? (
                      <tr><td colSpan={5} className="table-empty">
                        <span className="material-symbols-outlined" style={{ fontSize:48, color:'rgba(184,150,12,0.35)', display:'block', marginBottom:12 }}>calendar_month</span>
                        <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, marginBottom:6 }}>No appointments yet</p>
                        <p style={{ fontSize:13 }}>Book your first luxury session above</p>
                      </td></tr>
                    ) : appointments.map((a, idx) => {
                      const status = getStatusConfig(a.status);
                      const isCancelled = a.status?.toLowerCase() === 'cancelled';
                      return (
                        <tr key={a.id} style={{ opacity: isCancelled ? 0.6 : 1 }}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                              <div className="svc-thumb">
                                <span className="material-symbols-outlined mat-icon">content_cut</span>
                              </div>
                              <div>
                                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:17, fontWeight:600, color:'#1C1C1E' }}>{a.serviceName}</div>
                                {a.duration && <div style={{ fontSize:12, color:'#AAAAAA', marginTop:2 }}>{a.duration}</div>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize:14, fontWeight:500, color:'#1C1C1E' }}>{a.date || '—'}</div>
                            {a.time
                              ? <div style={{ fontSize:12, color:'#AAAAAA', marginTop:2 }}>{a.time}</div>
                              : <div style={{ fontSize:12, color:'#CCCCCC', marginTop:2, fontStyle:'italic' }}>Time not set</div>
                            }
                          </td>
                          <td style={{ fontSize:14, color:'#6B6B6B' }}>{a.duration || '—'}</td>
                          <td><span className={status.cls}>{status.label}</span></td>
                          <td style={{ textAlign:'right' }}>
                            {!isCancelled
                              ? <button className="btn-cancel-row" onClick={() => handleCancel(a.id)}>Cancel</button>
                              : <span style={{ fontSize:12, color:'#CCCCCC' }}>Cancelled</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {appointments.length > 5 && (
              <div className="pagination">
                <span className="pagination-info">Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</span>
                <div className="pagination-btns">
                  <button className="pag-btn" disabled><span className="material-symbols-outlined" style={{ fontSize:18 }}>chevron_left</span></button>
                  <button className="pag-btn active">1</button>
                  <button className="pag-btn" disabled><span className="material-symbols-outlined" style={{ fontSize:18 }}>chevron_right</span></button>
                </div>
              </div>
            )}
          </div>
        </main>

        <CustomerFooter />
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmProps.title}
        message={confirmProps.message}
        confirmText={confirmProps.confirmText}
        confirmColor={confirmProps.confirmColor}
        onConfirm={() => confirmProps.onConfirm && confirmProps.onConfirm()}
        onCancel={() => setConfirmOpen(false)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default AppointmentsPage;