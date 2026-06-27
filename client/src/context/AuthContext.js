import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const AuthContext = createContext(null);

const DEFAULT_API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = (typeof window !== 'undefined' && window.__API_BASE__) || process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL;

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const refreshUser = useCallback(async () => {
		setLoading(true);
		setError(null);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 8000);

		try {
			const response = await fetch(`${API_BASE_URL}/auth/me`, {
				method: "GET",
				credentials: "include",
				cache: 'no-store',
				signal: controller.signal,
				headers: { Accept: "application/json", "Cache-Control": "no-cache", Pragma: "no-cache" },
			});

			clearTimeout(timeoutId);

			const data = await response.json();
			// 401 just means the user isn't logged in — not an error for guests
			if (!response.ok) {
				setUser(null);
				return;
			}
			if (data && typeof data === "object" && !data.role) {
				data.role = "customer";
			}
			setUser(data);
		} catch (err) {
			if (err.name === 'AbortError') {
				setError(new Error('Auth fetch timeout'));
			} else {
				setError(err);
			}
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	const loginWithGoogle = useCallback(() => {
		window.location.assign(`${API_BASE_URL}/auth/google`);
	}, []);

	const logout = useCallback(() => {
		window.location.assign(`${API_BASE_URL}/auth/logout`);
	}, []);

	const value = useMemo(
		() => ({
			user,
			loading,
			error,
			refreshUser,
			loginWithGoogle,
			logout,
			apiBaseUrl: API_BASE_URL,
		}),
		[user, loading, error, refreshUser, loginWithGoogle, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
