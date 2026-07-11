import axios from 'axios';

// In dev, VITE_API_URL is unset, so this falls back to '/api', which
// Vite's dev server proxies to http://localhost:5000 (see vite.config.js).
// In production, set VITE_API_URL to your deployed backend's URL.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach the saved JWT to every outgoing request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
