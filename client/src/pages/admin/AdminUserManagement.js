import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
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

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="ml-[240px] pt-[80px]">
        <AdminHeader title="Manage Users" />
        
        <main className="p-page animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-element-gap mb-section-gap">
            <div className="bg-white rounded-card shadow-card p-6 border-l-[4px] border-primary">
              <div className="text-[36px] font-bold font-heading text-dark leading-none mb-2">{stats.total}</div>
              <div className="text-[12px] font-body font-bold text-grey uppercase tracking-widest">Total Users</div>
            </div>
            <div className="bg-white rounded-card shadow-card p-6 border-l-[4px] border-success">
              <div className="text-[36px] font-bold font-heading text-dark leading-none mb-2">{stats.active}</div>
              <div className="text-[12px] font-body font-bold text-grey uppercase tracking-widest">Active Members</div>
            </div>
            <div className="bg-white rounded-card shadow-card p-6 border-l-[4px] border-error">
              <div className="text-[36px] font-bold font-heading text-dark leading-none mb-2">{stats.restricted}</div>
              <div className="text-[12px] font-body font-bold text-grey uppercase tracking-widest">Restricted</div>
            </div>
          </div>

          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="p-6 border-b border-light-border">
              <div className="relative max-w-[400px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FEF9ED] border-b border-light-border">
                  <tr>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Phone</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest">Joined Date</th>
                    <th className="px-6 py-4 font-body text-label text-grey uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments = filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="empty-state">
                          <span className="material-symbols-outlined empty-state-icon">group</span>
                          <p className="font-body text-body text-grey">No users found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => {
                      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF4]';
                      const isRestricted = String(user.status).toLowerCase() === 'restricted';
                      const isAdmin = String(user.role).toLowerCase() === 'admin';
                      
                      return (
                        <tr key={user.id} className={`${bgClass} border-b border-light-border hover:bg-[#FEF9ED] transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-[48px] h-[48px] rounded-full border-2 border-primary bg-[#E8D9A0] flex items-center justify-center text-primary font-bold text-[18px]">
                                  {(user.name || 'U').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full"></div>
                              </div>
                              <div>
                                <div className="font-body text-[14px] font-bold text-dark">{user.name || 'Unknown'}</div>
                                <div className="font-body text-[12px] text-grey">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-grey">
                            {user.phone || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${isAdmin ? 'bg-primary text-white' : 'bg-[#F5F5F5] text-grey border border-light-border'}`}>
                              {user.role || 'Customer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body text-[14px] text-grey">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setConfirmDialog({ action: 'restrict', user })} 
                                className={`btn !px-3 !py-1 text-[13px] ${isRestricted ? 'bg-success text-white' : 'btn-secondary'}`}
                              >
                                {isRestricted ? 'Unrestrict' : 'Restrict'}
                              </button>
                              <button 
                                onClick={() => setConfirmDialog({ action: 'make_admin', user })} 
                                className="btn bg-dark text-white hover:bg-black !px-3 !py-1 text-[13px]"
                              >
                                {isAdmin ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <button 
                                onClick={() => setConfirmDialog({ action: 'remove', user })} 
                                className="btn bg-error text-white hover:bg-[#a02f23] !px-3 !py-1 text-[13px]"
                              >
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
          <div className="modal-overlay">
            <div className="luxury-modal">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmDialog.action === 'remove' ? 'bg-[#FDEDED] text-error' : 'bg-[#FEF9ED] text-primary'}`}>
                  <span className="material-symbols-outlined text-[24px]">
                    {confirmDialog.action === 'remove' ? 'warning' : 'admin_panel_settings'}
                  </span>
                </div>
                <div>
                  <h2 className="font-heading text-h3 text-dark">Confirm Action</h2>
                </div>
              </div>
              
              <div className="font-body text-body text-grey mb-8">
                {confirmDialog.action === 'remove' && `Are you sure you want to permanently remove ${confirmDialog.user.name}? This action cannot be undone.`}
                {confirmDialog.action === 'restrict' && `Are you sure you want to change the restriction status for ${confirmDialog.user.name}?`}
                {confirmDialog.action === 'make_admin' && `Are you sure you want to change the role for ${confirmDialog.user.name}?`}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmDialog(null)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleAction} className={`btn ${confirmDialog.action === 'remove' ? 'btn-danger' : 'btn-primary'}`}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}