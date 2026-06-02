import React, { useState, useMemo, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Initial users data with realistic examples
const initialUsers = [
  {
    id: 1,
    name: 'Julian Mercer',
    email: 'julian.mercer@atelier.com',
    joinedDate: 'Oct 12, 2023',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfErO90pAbte3ILZTNE3vMdcvC-aUmEu1mj8yW8Em9-JhNagMcyAu6gBoqP7BEpcKOXYItvFqDvojEP1-DzvYbVB9SpNWi1W7R9X4e8I32Apu2kG6EaXZ-aa-w1rmtvl_JndvGCCyFetMU0pKdniVq001ZY2GClgzPJmMuDmyOO5Zb-nbjJ3adYQfPTvYtZQRaGWac3V6JcQe_0MXINUMCBKeSsfcGhDOiN-u48N4LX1Lc2ZhkWGYFY0Xjw-1y7-cu2TjL0ldiFNJ'
  },
  {
    id: 2,
    name: 'Seraphina Rose',
    email: 's.rose@luxe.design',
    joinedDate: 'Nov 04, 2023',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-HRVO2NtPk09xdlgHWmJGHNl4ajWeRgmzF9bYMv9XqPLdZMgqWUd85ad1N1wZFzKOWZxHBU16NDub5zKhhp74j6z_GqbbPdKLZ-VBxdx3V3-1EOzDxx1jVmgLNe84tJhHqvbB8jySXAt8eYWNeMkeM8hcvHqerpkLd6iFCbYGSibCTsaPVcfmBe84kBTBF5DkOb1puDKMnaQ1nVG4sY3E8tzO6GxY6cGaEqLvN-KQhoM_U01AzPHRKgwmvrN525xKT3TWzkfNkvas'
  },
  {
    id: 3,
    name: 'Marcus Vane',
    email: 'm.vane@arch.studio',
    joinedDate: 'Aug 22, 2023',
    status: 'Restricted',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCXZaYKxNLdrkS82I81_p8QfKeKa3-w2bNKrqcMt3-FLxtXKhOIWuYAchhwyfUmDcZfkpRRsByhzyyCKxCSkRXQ6SeELqtpE44uG7GvDiCuE-qHYQRjvCHclk-vc5dBR_p9hIAEWsYBs9SSOJntaCBmeIKtaOPX6YTZJFe2rD41MEJEPpnFj6nQgEprmNubc9VLgA-mM8nEVqAtzd49I3AqIZTctcDAzo-I381tvhiqnOAW0ucIz37hJkScoKkQlcrDOnmEzWD-40'
  },
  {
    id: 4,
    name: 'Elara Thorne',
    email: 'elara@thorne.com',
    joinedDate: 'Jan 15, 2024',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXmpVssBFPsJdHIoLFXK4lpYTvYOXUl9VirMtVmdwBJoZlGJvnmw8l_IHzLwraKIE6lLYO2ZCSojQiJfw1TNBajDzPMEau5Tqlk3J852LRrC3FacJL6bPrUUhw4nAHkfPEVUWz4zvni3ae8rmN6d90LFK5TPOohietIVg4GLNm7E5QusRWCi1b0jF2f1D0t1FpIDGiDD4aWx2Ddb3Y1WBSwZZRQ0wkwswKOVY6CpO3mgHkN-yuBe6R70ae0SPmacsr-DpTF7rTGT9b'
  },
  {
    id: 5,
    name: 'Isabella Chen',
    email: 'i.chen@atelier.com',
    joinedDate: 'Feb 10, 2024',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfErO90pAbte3ILZTNE3vMdcvC-aUmEu1mj8yW8Em9-JhNagMcyAu6gBoqP7BEpcKOXYItvFqDvojEP1-DzvYbVB9SpNWi1W7R9X4e8I32Apu2kG6EaXZ-aa-w1rmtvl_JndvGCCyFetMU0pKdniVq001ZY2GClgzPJmMuDmyOO5Zb-nbjJ3adYQfPTvYtZQRaGWac3V6JcQe_0MXINUMCBKeSsfcGhDOiN-u48N4LX1Lc2ZhkWGYFY0Xjw-1y7-cu2TjL0ldiFNJ'
  },
  {
    id: 6,
    name: 'William Hayes',
    email: 'will.hayes@luxe.me',
    joinedDate: 'Mar 05, 2024',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCXZaYKxNLdrkS82I81_p8QfKeKa3-w2bNKrqcMt3-FLxtXKhOIWuYAchhwyfUmDcZfkpRRsByhzyyCKxCSkRXQ6SeELqtpE44uG7GvDiCuE-qHYQRjvCHclk-vc5dBR_p9hIAEWsYBs9SSOJntaCBmeIKtaOPX6YTZJFe2rD41MEJEPpnFj6nQgEprmNubc9VLgA-mM8nEVqAtzd49I3AqIZTctcDAzo-I381tvhiqnOAW0ucIz37hJkScoKkQlcrDOnmEzWD-40'
  },
  {
    id: 7,
    name: 'Victoria Delacroix',
    email: 'vic.delacroix@atelier.com',
    joinedDate: 'Apr 18, 2024',
    status: 'Restricted',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-HRVO2NtPk09xdlgHWmJGHNl4ajWeRgmzF9bYMv9XqPLdZMgqWUd85ad1N1wZFzKOWZxHBU16NDub5zKhhp74j6z_GqbbPdKLZ-VBxdx3V3-1EOzDxx1jVmgLNe84tJhHqvbB8jySXAt8eYWNeMkeM8hcvHqerpkLd6iFCbYGSibCTsaPVcfmBe84kBTBF5DkOb1puDKMnaQ1nVG4sY3E8tzO6GxY6cGaEqLvN-KQhoM_U01AzPHRKgwmvrN525xKT3TWzkfNkvas'
  }
];

const AdminUserManagement = () => {
  // State
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocus, setSearchFocus] = useState(false);
  const itemsPerPage = 5;
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const { apiBaseUrl } = useAuth();

  // Fetch users function (reusable)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      // cache-bust with timestamp
      const res = await axios.get(`${apiBaseUrl}/api/users?_t=${Date.now()}`, { withCredentials: true });
      const mapped = res.data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatar_url || u.avatarUrl || u.photo || '',
        joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : '',
        status: (u.role === 'restricted') ? 'Restricted' : 'Active'
      }));
      setUsers(mapped);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Derived data: filtered users based on search and tab
  const filteredUsers = useMemo(() => {
    let filtered = users;
    // Search by name or email
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }
    // Filter by status tab
    if (activeTab === 'Active') {
      filtered = filtered.filter((user) => user.status === 'Active');
    } else if (activeTab === 'Restricted') {
      filtered = filtered.filter((user) => user.status === 'Restricted');
    }
    return filtered;
  }, [users, searchTerm, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // User actions (call server)
  const handleRestrictToggle = async (userId, currentStatus) => {
    try {
      const shouldRestrict = currentStatus === 'Active';
      const url = `${apiBaseUrl}/api/users/${userId}/${shouldRestrict ? 'restrict' : 'unrestrict'}`;
      const res = await axios.post(url, {}, { withCredentials: true });
      // refresh list from server to ensure consistency
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update user status');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const res = await axios.delete(`${apiBaseUrl}/api/users/${userId}`, { withCredentials: true });
      if (res.status === 200) {
        // refresh from server in case other changes exist
        await fetchUsers();
      } else {
        alert('Delete did not complete (server returned ' + res.status + ')');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to remove user');
    }
  };

  // Fetch users from server on mount
  useEffect(() => {
    let mounted = true;
    fetchUsers();
    return () => { mounted = false; };
  }, [apiBaseUrl]);

  // Metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const restrictedUsers = users.filter((u) => u.status === 'Restricted').length;

  // Helper: status badge class
  const getStatusBadgeClass = (status) => {
    if (status === 'Active') {
      return 'bg-surface-container-high text-primary border border-outline-variant';
    }
    return 'bg-error-container text-on-error-container border border-error/20';
  };

  // Helper: online dot color
  const getOnlineDotClass = (status) => {
    return status === 'Active' ? 'bg-green-500' : 'bg-error';
  };

  // Placeholder handlers for other interactive elements
  const handleNewAppointment = () => alert('Create new appointment');
  const handleInviteClient = () => alert('Invite client flow');
  const handleNotifications = () => alert('No new notifications');
  const handleHelp = () => alert('Help & support');
  const handleExport = () => alert('Export users list');
  const handleSort = () => alert('Sort functionality coming soon');
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Sidebar navigation placeholders
  const navItems = [
    { label: 'Overview', icon: 'dashboard', onClick: () => alert('Overview') },
    { label: 'Services', icon: 'content_cut', onClick: () => alert('Services') },
    { label: 'Appointments', icon: 'calendar_month', onClick: () => alert('Appointments') },
    { label: 'Clients', icon: 'group', active: true },
    { label: 'Settings', icon: 'settings', onClick: () => alert('Settings') },
  ];

  return (
    <div className="app">
      <AdminSidebar />

      <AdminHeader title="Client Management" />

      {/* Main Content */}
      <div className="main md:ml-64">
        <div className="content">
          {/* Page Header & Metrics */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-surface p-8 border border-outline-variant flex flex-col justify-between h-40 group hover:border-secondary transition-colors duration-500">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total Users</span>
                <div className="flex items-end justify-between">
                  <span className="font-headline-xl text-headline-xl text-primary leading-none">{totalUsers}</span>
                  <span className="material-symbols-outlined text-secondary text-4xl opacity-20 group-hover:opacity-100 transition-opacity">
                    group
                  </span>
                </div>
              </div>
              <div className="bg-surface p-8 border border-outline-variant flex flex-col justify-between h-40 group hover:border-secondary transition-colors duration-500">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Active Members</span>
                <div className="flex items-end justify-between">
                  <span className="font-headline-xl text-headline-xl text-primary leading-none">{activeUsers}</span>
                  <div className="flex items-center text-secondary font-bold">
                    <span className="material-symbols-outlined">trending_up</span>
                    <span className="ml-1">4.2%</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface p-8 border border-outline-variant flex flex-col justify-between h-40 group hover:border-error transition-colors duration-500">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Restricted</span>
                <div className="flex items-end justify-between">
                  <span className="font-headline-xl text-headline-xl text-primary leading-none">{restrictedUsers}</span>
                  <span className="material-symbols-outlined text-error text-4xl opacity-20 group-hover:opacity-100 transition-opacity">
                    block
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-outline-variant pb-6">
            <div className="flex gap-8">
              {['All Users', 'Active', 'Restricted'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`font-label-md text-label-md uppercase tracking-widest pb-2 transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSort}
                className="flex items-center gap-2 px-6 py-2 border border-outline-variant font-label-sm text-label-sm uppercase tracking-widest hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Sort By
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 border border-outline-variant font-label-sm text-label-sm uppercase tracking-widest hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export
              </button>
              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="flex items-center gap-2 px-6 py-2 border border-outline-variant font-label-sm text-label-sm uppercase tracking-widest hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                {loadingUsers ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Client Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-6 font-label-md text-label-md uppercase text-on-surface-variant tracking-widest w-1/3">Name &amp; Identity</th>
                  <th className="py-6 font-label-md text-label-md uppercase text-on-surface-variant tracking-widest">Joined Date</th>
                  <th className="py-6 font-label-md text-label-md uppercase text-on-surface-variant tracking-widest">Status</th>
                  <th className="py-6 font-label-md text-label-md uppercase text-on-surface-variant tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group border-b border-outline-variant hover:bg-surface-container-lowest transition-all duration-300 hover:translate-x-1"
                  >
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                            src={user.avatarUrl}
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getOnlineDotClass(
                              user.status
                            )} border-2 border-surface rounded-full`}
                          ></div>
                        </div>
                        <div>
                          <p className="font-body-lg text-primary font-semibold">{user.name}</p>
                          <p className="text-on-surface-variant font-label-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 font-body-md text-on-surface-variant">{user.joinedDate}</td>
                    <td className="py-6">
                      <span
                        className={`px-3 py-1 font-label-sm uppercase text-[10px] tracking-widest ${getStatusBadgeClass(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex justify-end gap-3">
                        {user.status === 'Active' ? (
                          <button
                            onClick={() => handleRestrictToggle(user.id, user.status)}
                            className="px-4 py-2 border border-outline text-on-surface-variant font-label-sm uppercase text-[10px] tracking-widest hover:bg-inverse-surface hover:text-surface transition-all"
                          >
                            Restrict
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestrictToggle(user.id, user.status)}
                            className="px-4 py-2 border border-secondary text-secondary font-label-sm uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-on-secondary transition-all"
                          >
                            Unrestrict
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="px-4 py-2 border border-error/30 text-error font-label-sm uppercase text-[10px] tracking-widest hover:bg-error hover:text-white transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-between border-t border-outline-variant pt-8 flex-wrap gap-4">
            <p className="text-on-surface-variant font-label-sm uppercase tracking-widest">
              Showing {filteredUsers.length ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} Users
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 3 && currentPage > 2) {
                  pageNum = currentPage - 1 + i;
                  if (pageNum > totalPages) return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 flex items-center justify-center border transition-all font-label-md ${
                      currentPage === pageNum
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleInviteClient}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:bg-secondary transition-all duration-300 z-50 group"
      >
        <span className="material-symbols-outlined text-3xl">person_add</span>
        <span className="absolute right-20 bg-primary text-on-primary px-4 py-2 text-label-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Invite Client
        </span>
      </button>

      {/* Custom scrollbar style */}
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cfc4c5; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminUserManagement;