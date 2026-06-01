import React, { useState, useMemo } from 'react';

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

const AdminClientManagement = () => {
  // State
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocus, setSearchFocus] = useState(false);
  const itemsPerPage = 5;

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

  // User actions
  const handleRestrictToggle = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'Active' ? 'Restricted' : 'Active',
            }
          : user
      )
    );
  };

  const handleRemoveUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    }
  };

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
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-8 px-6 z-50">
        <div className="mb-12">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">L'Atelier</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Admin Suite</p>
        </div>
        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex items-center gap-4 py-2 w-full text-left transition-colors duration-200 ease-in-out font-body-md text-body-md ${
                item.active
                  ? 'text-secondary font-bold border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleNewAppointment}
            className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300"
          >
            New Appointment
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Navigation Bar */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] border-b border-outline-variant bg-surface/90 backdrop-blur-md flex justify-between items-center h-20 px-gutter z-40">
          <div className="flex items-center flex-1 max-w-md">
            <div className={`relative w-full transition-transform duration-300 ${searchFocus ? 'scale-105' : ''}`}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors font-body-md text-body-md outline-none"
                placeholder="Search users by name or email..."
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleNotifications}
                className="text-on-surface-variant hover:text-secondary transition-all scale-95 active:scale-100"
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button
                onClick={handleHelp}
                className="text-on-surface-variant hover:text-secondary transition-all scale-95 active:scale-100"
              >
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>
            <div className="flex items-center gap-3">
              <img
                alt="Administrator Profile"
                className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOeRFVZQBbm3lDkyI9Py_jOmmn0iMUsu6OKBFh-5KC5AHTN__zDzBAcHFQvyQf-0QpDsNGKE2DKbl9ifVo3XTaF-P4zOpu2iJX8tFIfAxwcaG02FlUphMZkQOFCdVsNBpDa-c1dHrzD8ZScZNmZ9YIG2MC9hxHr3B5E0xQMfRHTCsij4N-d4eUEEe7-Mh496S2AsCG2vqlnTdPSGbipiATgMKSycrsZNQ0y_6Nn3Mhigrc3RTBdNjEZXxhKxHVWFuKxDYYoNv-DvSl"
              />
              <div>
                <p className="font-label-md text-label-md text-primary">Admin Jane</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Chief of Style</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="pt-32 pb-section-gap-desktop px-gutter max-w-container-max-width mx-auto">
          {/* Page Header & Metrics */}
          <div className="mb-12">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-8">Client Management</h2>
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
                            onClick={() => handleRestrictToggle(user.id)}
                            className="px-4 py-2 border border-outline text-on-surface-variant font-label-sm uppercase text-[10px] tracking-widest hover:bg-inverse-surface hover:text-surface transition-all"
                          >
                            Restrict
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestrictToggle(user.id)}
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
        </section>
      </main>

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