import axios from 'axios';

// Dynamically determine backend API URL
const getBaseUrl = () => {
  // If explicitly configured via Vite env
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.trim();
    return raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
  }
  // If running locally in development, use relative path (Vite proxy to localhost:5000)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '/api';
  }
  // Production default: live Railway backend server
  return 'https://beaconbridge-server-production.up.railway.app/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bba_token') || localStorage.getItem('edulearn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid infinite redirect loops if already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
        localStorage.removeItem('bba_token');
        localStorage.removeItem('bba_user');
        localStorage.removeItem('edulearn_token');
        localStorage.removeItem('edulearn_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
