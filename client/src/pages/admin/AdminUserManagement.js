import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!confirmDialog) return;
    const { action, user } = confirmDialog;
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      if (action === 'remove') {
        await fetch(`${API_BASE}/api/users/${user.id}`, { method: 'DELETE' });
      } else if (action === 'restrict') {
        const newStatus = String(user.status).toLowerCase() === 'restricted' ? 'active' : 'restricted';
        await fetch(`${API_BASE}/api/users/${user.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
      } else if (action === 'make_admin') {
        const newRole = String(user.role).toLowerCase() === 'admin' ? 'customer' : 'admin';
        await fetch(`${API_BASE}/api/users/${user.id}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole })
        });
      }
      await fetchUsers();
    } catch (err) {
      console.error('Action failed', err);
    } finally {
      setConfirmDialog(null);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  const stats = {
    total: users.length,
    active: users.filter(u => String(u.status).toLowerCase() !== 'restricted').length,
    restricted: users.filter(u => String(u.status).toLowerCase() === 'restricted').length
  };

  const getConfirmMessage = () => {
    if (!confirmDialog) return '';
    const { action, user } = confirmDialog;
    if (action === 'remove') return `Permanently remove ${user.name || 'this user'}? This action cannot be undone.`;
    if (action === 'restrict') return String(user.status).toLowerCase() === 'restricted'
      ? `Unrestrict ${user.name || 'this user'}? They will regain full access.`
      : `Restrict ${user.name || 'this user'}? They will lose access until unrestricted.`;
    if (action === 'make_admin') return String(user.role).toLowerCase() === 'admin'
      ? `Remove admin privileges from ${user.name || 'this user'}?`
      : `Grant admin privileges to ${user.name || 'this user'}?`;
    return '';
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <AdminSidebar />
      <div className="admin-content pt-[80px]">
        <AdminHeader title="Manage Users" />

        <main className="p-8 animate-[fadeIn_0.3s_ease-in]">

          {/* Stats Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.35em] mb-1">Overview</div>
              <p className="text-[#6B6B6B] text-[14px]">User statistics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.total, icon: 'group', color: 'border-[#C9A84C]', iconColor: 'text-[#C9A84C]', iconBg: 'bg-[#FEF9ED]' },
              { label: 'Active Members', value: stats.active, icon: 'verified_user', color: 'border-[#2D7A4F]', iconColor: 'text-[#2D7A4F]', iconBg: 'bg-[#EAF5EF]' },
              { label: 'Restricted', value: stats.restricted, icon: 'block', color: 'border-[#C0392B]', iconColor: 'text-[#C0392B]', iconBg: 'bg-[#FDEDED]' },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6 border-l-[4px] ${s.color} flex items-start justify-between hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200`}>
                <div>
                  <div className="text-[42px] font-bold font-['Playfair_Display'] text-[#1A1A1A] leading-none mb-1.5">{s.value}</div>
                  <div className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">{s.label}</div>
                </div>
                <div className={`w-11 h-11 rounded-full ${s.iconBg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined ${s.iconColor} text-[22px]`}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
            {/* Search Bar */}
            <div className="px-6 py-5 border-b border-[#EDE8DC] flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C] text-[20px] pointer-events-none">search</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#FAFAF8] border border-[#EDE8DC] rounded-full py-2 pl-10 pr-4 text-[14px] outline-none transition-all duration-200 focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]"
                />
              </div>
              <div className="text-[13px] text-[#6B6B6B] ml-4 shrink-0 font-medium">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAFAF8] border-b border-[#EDE8DC]">
                  <tr>
                    {['User', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                      <th key={h} className={`px-6 py-3.5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-[#EDE8DC] border-t-[#C9A84C] rounded-full animate-spin"></div>
                          <p className="text-[14px] text-[#6B6B6B]">Loading users...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="material-symbols-outlined text-[#C9A84C] text-[48px] opacity-60">group_off</span>
                          <p className="text-[16px] font-bold text-[#1A1A1A]">No users found</p>
                          <p className="text-[14px] text-[#6B6B6B]">Try adjusting your search filter</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => {
                      const isRestricted = String(user.status || '').toLowerCase() === 'restricted';
                      const isAdmin = String(user.role || '').toLowerCase() === 'admin';
                      const rowBg = index % 2 === 1 ? 'bg-[#FAFAF8]' : 'bg-white';
                      const initials = (user.name || 'U').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

                      return (
                        <tr key={user.id} className={`${rowBg} border-b border-[#EDE8DC] hover:bg-[#FEF9ED] transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-[#FEF9ED] border-[2px] border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-bold text-[12px]">
                                  {initials}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${isRestricted ? 'bg-[#C0392B]' : 'bg-[#2D7A4F]'}`}></div>
                              </div>
                              <div>
                                <div className="font-bold text-[14px] text-[#1A1A1A] leading-tight">{user.name || 'Unknown'}</div>
                                <div className="text-[12px] text-[#6B6B6B] mt-0.5">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[14px] text-[#1A1A1A] font-medium">
                            {user.phone || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isAdmin
                                ? 'bg-[#1A1A1A] text-white'
                                : 'bg-[#FAFAF8] text-[#6B6B6B] border border-[#EDE8DC]'
                            }`}>
                              {isAdmin ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[14px] text-[#1A1A1A] font-medium">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isRestricted
                                ? 'bg-[#FDEDED] text-[#C0392B]'
                                : 'bg-[#EAF5EF] text-[#2D7A4F]'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isRestricted ? 'bg-[#C0392B]' : 'bg-[#2D7A4F]'}`} />
                              {isRestricted ? 'Restricted' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setConfirmDialog({ action: 'restrict', user })}
                                className="w-8 h-8 rounded border border-[#EDE8DC] text-[#6B6B6B] flex items-center justify-center hover:text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[#FEF9ED] transition-all"
                                title={isRestricted ? "Unblock User" : "Restrict User"}
                              >
                                <span className="material-symbols-outlined text-[16px]">{isRestricted ? 'lock_open' : 'block'}</span>
                              </button>
                              <button
                                onClick={() => setConfirmDialog({ action: 'make_admin', user })}
                                className="w-8 h-8 rounded border border-[#EDE8DC] text-[#6B6B6B] flex items-center justify-center hover:text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F5F5F5] transition-all"
                                title={isAdmin ? "Demote to Customer" : "Make Admin"}
                              >
                                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                              </button>
                              <button
                                onClick={() => setConfirmDialog({ action: 'remove', user })}
                                className="w-8 h-8 rounded border border-[#EDE8DC] text-[#6B6B6B] flex items-center justify-center hover:text-[#C0392B] hover:border-[#FBBAB7] hover:bg-[#FDEDED] transition-all"
                                title="Remove User"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Confirmation Modal */}
        {confirmDialog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in px-4">
            <div className="bg-white rounded-[10px] w-full max-w-[440px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="p-5 border-b border-[#EDE8DC] flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmDialog.action === 'remove' ? 'bg-[#FDEDED] text-[#C0392B]' : 'bg-[#FEF9ED] text-[#C9A84C]'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {confirmDialog.action === 'remove' ? 'warning' : 'info'}
                  </span>
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[18px] font-bold text-[#1A1A1A]">Confirm Action</h2>
                  <p className="text-[12px] text-[#6B6B6B] capitalize">{confirmDialog.action.replace('_', ' ')} · {confirmDialog.user.name}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="font-body text-[14px] text-[#6B6B6B] leading-relaxed mb-6">
                  {getConfirmMessage()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialog(null)}
                    className="flex-1 px-4 py-2.5 border border-[#EDE8DC] text-[#6B6B6B] rounded-[8px] font-body text-[14px] font-medium hover:bg-[#F5F5F5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    className={`flex-1 px-4 py-2.5 rounded-[8px] font-body text-[14px] font-bold text-white transition-all hover:scale-[1.02] ${
                      confirmDialog.action === 'remove' ? 'bg-[#C0392B] hover:bg-[#a93226]' : 'bg-[#C9A84C] hover:bg-[#b5943b]'
                    }`}
                  >
                    {confirmDialog.action === 'remove' ? 'Yes, Remove' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}