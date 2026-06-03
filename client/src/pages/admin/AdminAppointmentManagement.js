import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  if (s === "approved")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EAF5EF] text-[#2D7A4F]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4F]" /> Approved
      </span>
    );
  if (s === "cancelled")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FDEDED] text-[#C0392B]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" /> Cancelled
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FEF9ED] text-[#C9A84C]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> Pending
    </span>
  );
}

function formatTime(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${parts[1]} ${ampm}`;
}

export default function AdminAppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateRange, setDateRange] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // close drawer on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedAppointment(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "";
    setLoading(true);
    fetch(`${API_BASE}/api/appointments`)
      .then((r) => r.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "";
      const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a))
      );
      if (selectedAppointment?.id === id) {
        setSelectedAppointment((prev) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = appointments.filter((a) => {
    if (
      filterStatus !== "All" &&
      String(a.status).toLowerCase() !== filterStatus.toLowerCase()
    )
      return false;
    if (dateRange) {
      const d = a.appointment_date
        ? new Date(a.appointment_date).toISOString().split("T")[0]
        : "";
      if (d !== dateRange) return false;
    }
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (a.customer_name || "").toLowerCase().includes(q) ||
      (a.service_name || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(
      (a) => String(a.status).toLowerCase() === "pending"
    ).length,
    approved: appointments.filter(
      (a) => String(a.status).toLowerCase() === "approved"
    ).length,
    cancelled: appointments.filter(
      (a) => String(a.status).toLowerCase() === "cancelled"
    ).length,
  };

  const hasFilters = query || filterStatus !== "All" || dateRange;

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <AdminSidebar />
      <div className="ml-[220px] pt-[80px]">
        <AdminHeader title="Appointments" />

        <main
          className={`p-8 transition-all duration-300 ${
            selectedAppointment ? "mr-[420px]" : ""
          }`}
        >
          {/* Page intro */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.35em] mb-1">
                Management
              </div>
              <p className="text-[#6B6B6B] text-[14px]">
                {appointments.length} total · {stats.pending} pending action
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: "calendar_month",
                color: "border-[#C9A84C]",
                bg: "bg-[#FEF9ED]",
                text: "text-[#C9A84C]",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: "pending_actions",
                color: "border-[#C9A84C]",
                bg: "bg-[#FEF9ED]",
                text: "text-[#C9A84C]",
              },
              {
                label: "Approved",
                value: stats.approved,
                icon: "check_circle",
                color: "border-[#2D7A4F]",
                bg: "bg-[#EAF5EF]",
                text: "text-[#2D7A4F]",
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                icon: "cancel",
                color: "border-[#C0392B]",
                bg: "bg-[#FDEDED]",
                text: "text-[#C0392B]",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-5 border-l-4 ${s.color} flex items-center justify-between`}
              >
                <div>
                  <div className="text-[36px] font-bold font-['Playfair_Display'] text-[#1A1A1A] leading-none mb-1">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center shrink-0`}
                >
                  <span className={`material-symbols-outlined ${s.text} text-[20px]`}>
                    {s.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-4 mb-5 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C] text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search by customer, service, or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-transparent rounded-full py-2.5 pl-10 pr-4 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-full px-1 py-1">
              {["All", "pending", "approved", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all capitalize ${
                    filterStatus === s
                      ? "bg-[#C9A84C] text-white shadow-sm"
                      : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                  }`}
                >
                  {s === "All" ? "All" : s}
                </button>
              ))}
            </div>

            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-[#EDE8DC] bg-white rounded-full py-2.5 px-4 text-[14px] outline-none focus:border-[#C9A84C] cursor-pointer text-[#1A1A1A]"
            />

            {hasFilters && (
              <button
                onClick={() => {
                  setQuery("");
                  setFilterStatus("All");
                  setDateRange("");
                }}
                className="flex items-center gap-1 text-[13px] text-[#6B6B6B] hover:text-[#C0392B] font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                Reset
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#EDE8DC] border-t-[#C9A84C] rounded-full animate-spin" />
                <p className="text-[14px] text-[#6B6B6B]">Loading appointments…</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#FAFAF8] border-b border-[#EDE8DC]">
                  <tr>
                    {[
                      { h: 'Customer', w: '25%' },
                      { h: 'Service', w: '15%' },
                      { h: 'Date & Time', w: '15%' },
                      { h: 'Phone', w: '15%' },
                      { h: 'Status', w: '12%' },
                      { h: 'Actions', w: '18%' },
                    ].map((col, i) => (
                      <th
                        key={col.h}
                        style={{ width: col.w }}
                        className={`px-6 py-4 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest ${
                          i === 5 ? 'text-right' : ''
                        } align-middle whitespace-nowrap`}
                      >
                        {col.h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-[#FEF9ED] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#C9A84C] text-[32px]">
                              calendar_month
                            </span>
                          </div>
                          <p className="font-bold text-[16px] text-[#1A1A1A]">
                            No appointments found
                          </p>
                          <p className="text-[14px] text-[#6B6B6B]">
                            {hasFilters
                              ? "Try adjusting your filters"
                              : "Appointments will appear here once booked"}
                          </p>
                          {hasFilters && (
                            <button
                              onClick={() => {
                                setQuery("");
                                setFilterStatus("All");
                                setDateRange("");
                              }}
                              className="mt-1 px-4 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-[8px] text-[13px] font-bold hover:bg-[#FEF9ED] transition-colors"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((app, index) => {
                      const isSelected = selectedAppointment?.id === app.id;
                      const rowBg =
                        index % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]";
                      const initials = (app.customer_name || "C")
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();
                      const isUpdating = updatingId === app.id;

                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppointment(app)}
                          className={`table-row border-b border-[#EDE8DC] hover:bg-[#FEF9ED] transition-colors cursor-pointer border-l-4 ${
                            isSelected
                              ? 'bg-[rgba(201,168,76,0.06)] border-l-[#C9A84C]'
                              : rowBg + ' border-l-transparent'
                          }`}
                          style={{ animationDelay: `${index * 0.04}s` }}
                        >
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#FEF9ED] border-[2px] border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-bold text-[13px] shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="font-bold text-[14px] text-[#1A1A1A]">
                                  {app.customer_name || "Walk-in"}
                                </div>
                                <div className="text-[12px] text-[#6B6B6B]">
                                  {app.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            <div className="font-medium text-[14px] text-[#1A1A1A]">
                              {app.service_name || "General"}
                            </div>
                            {app.service_duration && (
                              <div className="text-[12px] text-[#6B6B6B]">
                                {app.service_duration} min
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            <div className="font-medium text-[14px] text-[#1A1A1A]">
                              {app.appointment_date
                                ? new Date(
                                    app.appointment_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "—"}
                            </div>
                            {app.appointment_time ? (
                              <div className="text-[12px] text-[#6B6B6B]">
                                {formatTime(app.appointment_time)}
                              </div>
                            ) : (
                              <div className="text-[12px] text-[#AAAAAA] italic">
                                Time not set
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[14px] text-[#6B6B6B] align-middle whitespace-nowrap">
                            {app.phone || "—"}
                          </td>
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            <StatusBadge status={app.status} />
                          </td>
                          <td
                            className="px-6 py-4 text-right align-middle whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-end gap-2">
                              {String(app.status).toLowerCase() !== 'approved' && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => updateStatus(app.id, 'approved')}
                                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[6px] text-[12px] font-bold whitespace-nowrap border border-[#2D7A4F] text-[#2D7A4F] bg-white hover:bg-[#2D7A4F] hover:text-white transition-all disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-[14px]">check</span>
                                  Approve
                                </button>
                              )}
                              {String(app.status).toLowerCase() !== 'cancelled' && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => updateStatus(app.id, 'cancelled')}
                                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[6px] text-[12px] font-bold whitespace-nowrap border border-[#C0392B] text-[#C0392B] bg-white hover:bg-[#C0392B] hover:text-white transition-all disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-[14px]">close</span>
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedAppointment(app)}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[6px] text-[12px] font-bold whitespace-nowrap border border-[#EDE8DC] text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {filtered.length > 0 && (
              <div className="px-6 py-4 border-t border-[#EDE8DC] bg-[#FAFAF8] flex justify-between items-center">
                <p className="text-[13px] text-[#6B6B6B]">
                  Showing{" "}
                  <strong className="text-[#1A1A1A]">{filtered.length}</strong>{" "}
                  of{" "}
                  <strong className="text-[#1A1A1A]">
                    {appointments.length}
                  </strong>{" "}
                  appointments
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Side Detail Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-screen w-[420px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-[-4px_0_32px_rgba(0,0,0,0.12)] border-l border-[#EDE8DC] ${selectedAppointment ? 'translate-x-0 drawer-slide' : 'translate-x-full'}`}
      >
        {selectedAppointment && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#EDE8DC] bg-[#FEF9ED] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1A1A1A]">
                  Appointment Details
                </h3>
                <p className="text-[12px] text-[#6B6B6B] mt-0.5">
                  ID #{selectedAppointment.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full border border-[#EDE8DC] bg-white flex items-center justify-center text-[#6B6B6B] hover:text-[#C0392B] hover:border-[#FBBAB7] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Customer Card */}
              <div className="bg-[#F4F4F6] rounded-[10px] p-5">
                <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] mb-3">
                  Customer
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[56px] h-[56px] rounded-full bg-[#FEF9ED] border-[2px] border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-bold text-[20px] shrink-0">
                    {(selectedAppointment.customer_name || "C")
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-[16px] text-[#1A1A1A]">
                      {selectedAppointment.customer_name || "Walk-in Customer"}
                    </div>
                    <div className="text-[13px] text-[#6B6B6B]">
                      {selectedAppointment.email || "No email"}
                    </div>
                  </div>
                </div>
                {selectedAppointment.phone && (
                  <div className="flex items-center gap-2 text-[14px] text-[#1A1A1A]">
                    <div className="w-7 h-7 rounded-full bg-[#FEF9ED] border border-[#E8D9A0] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#C9A84C] text-[14px]">call</span>
                    </div>
                    {selectedAppointment.phone}
                  </div>
                )}
              </div>

              {/* Service Card */}
              <div className="bg-[#F4F4F6] rounded-[10px] p-5">
                <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] mb-3">
                  Service
                </div>
                <div className="font-bold text-[17px] text-[#1A1A1A] mb-4">
                  {selectedAppointment.service_name || "General Service"}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-[8px] p-3 border border-[#EDE8DC]">
                    <div className="text-[10px] text-[#6B6B6B] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#C9A84C] text-[14px]">event</span>
                      Date
                    </div>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">
                      {selectedAppointment.appointment_date
                        ? new Date(
                            selectedAppointment.appointment_date
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                  </div>
                  <div className="bg-white rounded-[8px] p-3 border border-[#EDE8DC]">
                    <div className="text-[10px] text-[#6B6B6B] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#C9A84C] text-[14px]">schedule</span>
                      Time
                    </div>
                    {selectedAppointment.appointment_time ? (
                      <div className="text-[14px] font-bold text-[#1A1A1A]">
                        {formatTime(selectedAppointment.appointment_time)}
                      </div>
                    ) : (
                      <div className="text-[14px] text-[#AAAAAA] italic">
                        Not specified
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-[#F4F4F6] rounded-[10px] p-5">
                <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] mb-3">
                  Current Status
                </div>
                <div className="mb-5">
                  <StatusBadge status={selectedAppointment.status} />
                </div>

                <div className="flex flex-col gap-2.5">
                  {String(selectedAppointment.status).toLowerCase() !==
                    "approved" && (
                    <button
                      disabled={updatingId === selectedAppointment.id}
                      onClick={() =>
                        updateStatus(selectedAppointment.id, "approved")
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D7A4F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#205b3a] transition-all disabled:opacity-50 shadow-[0_4px_12px_rgba(45,122,79,0.3)]"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                      Approve Appointment
                    </button>
                  )}
                  {String(selectedAppointment.status).toLowerCase() !==
                    "cancelled" && (
                    <button
                      disabled={updatingId === selectedAppointment.id}
                      onClick={() =>
                        updateStatus(selectedAppointment.id, "cancelled")
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#FBBAB7] text-[#C0392B] rounded-[8px] text-[14px] font-bold hover:bg-[#FDEDED] transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        cancel
                      </span>
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop on mobile */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}