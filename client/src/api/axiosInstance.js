import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Simple in-memory GET cache
const getCache = new Map();

instance.interceptors.request.use((config) => {
  // attach any auth headers if needed
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // basic centralized error handling
    if (error.response && error.response.status === 401) {
      // could dispatch logout or redirect
    }
    return Promise.reject(error);
  }
);

// helper: cached GET
instance.cachedGet = async (url, opts = {}) => {
  const key = url + JSON.stringify(opts.params || {});
  if (!opts.force && getCache.has(key)) {
    return { data: getCache.get(key), fromCache: true };
  }
  const res = await instance.get(url, { params: opts.params });
  getCache.set(key, res.data);
  return { data: res.data, fromCache: false };
};

instance.clearCache = (urlPrefix) => {
  if (!urlPrefix) return getCache.clear();
  for (const key of Array.from(getCache.keys())) {
    if (key.startsWith(urlPrefix)) getCache.delete(key);
  }
};

export default instance;
