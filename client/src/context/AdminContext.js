import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from '../api/axiosInstance';

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState({ appointments: false, services: false, offers: false, users: false });
  const [error, setError] = useState({ appointments: null, services: null, offers: null, users: null });

  const fetchAppointments = useCallback(async (opts = { force: false }) => {
    setLoading((s) => ({ ...s, appointments: true }));
    setError((s) => ({ ...s, appointments: null }));
    try {
      const res = await axios.cachedGet('/api/appointments', { force: opts.force });
      setAppointments(res.data || res);
      return res.data || res;
    } catch (err) {
      setError((s) => ({ ...s, appointments: err }));
      throw err;
    } finally {
      setLoading((s) => ({ ...s, appointments: false }));
    }
  }, []);

  const fetchServices = useCallback(async (opts = { force: false }) => {
    setLoading((s) => ({ ...s, services: true }));
    setError((s) => ({ ...s, services: null }));
    try {
      const res = await axios.cachedGet('/api/services', { force: opts.force });
      setServices(res.data || res);
      return res.data || res;
    } catch (err) {
      setError((s) => ({ ...s, services: err }));
      throw err;
    } finally {
      setLoading((s) => ({ ...s, services: false }));
    }
  }, []);

  const fetchOffers = useCallback(async (opts = { force: false }) => {
    setLoading((s) => ({ ...s, offers: true }));
    setError((s) => ({ ...s, offers: null }));
    try {
      const res = await axios.cachedGet('/api/offers', { force: opts.force });
      setOffers(res.data || res);
      return res.data || res;
    } catch (err) {
      setError((s) => ({ ...s, offers: err }));
      throw err;
    } finally {
      setLoading((s) => ({ ...s, offers: false }));
    }
  }, []);

  const fetchUsers = useCallback(async (opts = { force: false }) => {
    setLoading((s) => ({ ...s, users: true }));
    setError((s) => ({ ...s, users: null }));
    try {
      const res = await axios.cachedGet('/api/users', { force: opts.force });
      setUsers(res.data || res);
      return res.data || res;
    } catch (err) {
      setError((s) => ({ ...s, users: err }));
      throw err;
    } finally {
      setLoading((s) => ({ ...s, users: false }));
    }
  }, []);

  const clearCache = useCallback((prefix) => axios.clearCache(prefix), []);

  const value = {
    appointments,
    services,
    offers,
    users,
    loading,
    error,
    fetchAppointments,
    fetchServices,
    fetchOffers,
    fetchUsers,
    clearCache,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
