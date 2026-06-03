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
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Manage Users" />

        <main className="p-8 animate-fade-in">

          {/* Stats Row */}
          <div className="font-body text-[11px] text-primary uppercase tracking-widest mb-3">At a Glance</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.total, icon: 'group', color: 'border-primary' },
              { label: 'Active Members', value: stats.active, icon: 'verified_user', color: 'border-[#2D7A4F]' },
              { label: 'Restricted', value: stats.restricted, icon: 'block', color: 'border-[#C0392B]' },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6 border-l-[4px] ${s.color} flex items-center justify-between`}>
                <div>
                  <div className="text-[40px] font-bold font-heading text-[#1A1A1A] leading-none mb-1">{s.value}</div>
                  <div className="text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest">{s.label}</div>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">{s.icon}</span>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Search Bar */}
            <div className="p-5 border-b border-[#EDE8DC] flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C] text-[20px] pointer-events-none">search</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-transparent rounded-full py-2.5 pl-10 pr-4 text-[14px] font-body outline-none transition-all duration-200 focus:border-[#C9A84C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
                />
              </div>
              <div className="text-[13px] text-[#6B6B6B] font-body ml-4 shrink-0">
                {filteredUsers.length} of {users.length} users
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAFAF8] border-b border-[#EDE8DC]">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest">Phone</th>
                    <th className="px-6 py-4 text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-4 text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] font-body font-bold text-[#6B6B6B] uppercase tracking-widest text-right">Actions</th>
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
                      const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]';
                      const initials = (user.name || 'U').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

                      return (
                        <tr key={user.id} className={`${rowBg} border-b border-[#EDE8DC] hover:bg-[#FEF9ED] transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative shrink-0">
                                <div className="w-[44px] h-[44px] rounded-full border-2 border-[#C9A84C] bg-[#FEF9ED] flex items-center justify-center text-[#C9A84C] font-bold text-[15px]">
                                  {initials}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isRestricted ? 'bg-[#C0392B]' : 'bg-[#2D7A4F]'}`}></div>
                              </div>
                              <div>
                                <div className="font-body text-[14px] font-bold text-[#1A1A1A]">{user.name || 'Unknown'}</div>
                                <div className="font-body text-[12px] text-[#6B6B6B]">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-[#6B6B6B]">
                            {user.phone || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                              isAdmin
                                ? 'bg-[#C9A84C] text-white'
                                : 'bg-[#F5F5F5] text-[#6B6B6B] border border-[#EDE8DC]'
                            }`}>
                              {isAdmin ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-[#6B6B6B]">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                              isRestricted
                                ? 'bg-[#FDEDED] text-[#C0392B] border border-[#FBBAB7]'
                                : 'bg-[#EAF5EF] text-[#2D7A4F] border border-[#A8D8BC]'
                            }`}>
                              {isRestricted ? 'Restricted' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setConfirmDialog({ action: 'restrict', user })}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-bold border transition-all duration-200 hover:scale-[1.02] ${
                                  isRestricted
                                    ? 'border-[#2D7A4F] text-[#2D7A4F] hover:bg-[#EAF5EF]'
                                    : 'border-[#EDE8DC] text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">{isRestricted ? 'lock_open' : 'block'}</span>
                                {isRestricted ? 'Unblock' : 'Restrict'}
                              </button>
                              <button
                                onClick={() => setConfirmDialog({ action: 'make_admin', user })}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-bold border transition-all duration-200 hover:scale-[1.02] ${
                                  isAdmin
                                    ? 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F5F5F5]'
                                    : 'border-[#C9A84C] text-[#C9A84C] hover:bg-[#FEF9ED]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                                {isAdmin ? 'Demote' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => setConfirmDialog({ action: 'remove', user })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-bold border border-[#FBBAB7] text-[#C0392B] hover:bg-[#FDEDED] transition-all duration-200 hover:scale-[1.02]"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                Remove
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
              <div className={`p-5 border-b border-[#EDE8DC] flex items-center gap-3 ${confirmDialog.action === 'remove' ? 'bg-[#FDEDED]' : 'bg-[#FEF9ED]'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmDialog.action === 'remove' ? 'bg-[#C0392B] text-white' : 'bg-[#C9A84C] text-white'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {confirmDialog.action === 'remove' ? 'warning' : 'info'}
                  </span>
                </div>
                <div>
                  <h2 className="font-heading text-[18px] font-bold text-[#1A1A1A]">Confirm Action</h2>
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