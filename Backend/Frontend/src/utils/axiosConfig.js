import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 500) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;