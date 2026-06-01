import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
 	const { logout, user, loading } = useAuth();

	const linkClass = ({ isActive }) =>
		`block px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-gray-700 font-semibold' : 'text-gray-200 hover:bg-gray-700'}`;

	const handleLogout = (e) => {
		e.preventDefault();
		try { logout && logout(); } catch (err) { /* ignore */ }
	};

	return (
		<aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex-col z-40">
			<div className="p-6 border-b border-gray-800">
				<NavLink to="/admin" className="text-2xl font-serif text-white">Admin</NavLink>
				{/* user preview */}
				<div className="mt-4 flex items-center gap-3">
					{loading ? (
						<div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
					) : (
						<>
								{(user && (user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture)) ? (
									<img src={user.avatar_url || user.photo || user.avatar || user.avatarUrl || user.picture} alt={user.name || user.email} className="w-10 h-10 rounded-full object-cover" />
							) : (
								<div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">{(user && (user.name || user.email)) ? (user.name ? user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : (user.email[0]||'U').toUpperCase()) : 'U'}</div>
							)}
							<div>
								<div className="text-sm font-medium">{user?.name || user?.displayName || user?.email || 'Account'}</div>
								<div className="text-xs text-gray-400">Profile</div>
							</div>
						</>
					)}
				</div>
			</div>
			<nav className="p-4 flex-1 overflow-auto space-y-1">
				<NavLink to="/admin" className={linkClass}>Dashboard</NavLink>
				<NavLink to="/admin/services" className={linkClass}>Services</NavLink>
				<NavLink to="/admin/appointments" className={linkClass}>Appointments</NavLink>
				<NavLink to="/admin/offers" className={linkClass}>Offers</NavLink>
				<NavLink to="/admin/users" className={linkClass}>Users</NavLink>
				<NavLink to="/admin/settings" className={linkClass}>Settings</NavLink>
			</nav>
			<div className="p-4 border-t border-gray-800">
				<button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white">Logout</button>
				<div className="mt-3 text-sm text-gray-400">v1.0</div>
			</div>
		</aside>
	);
}
