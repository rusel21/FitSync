import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// CSRF token management
let csrfToken = null;
let isCsrfInitialized = false;

// Function to initialize CSRF token
const initializeCsrfToken = async () => {
  if (!isCsrfInitialized) {
    try {
      console.log('Initializing CSRF token...');
      
      // Make request to Laravel's CSRF endpoint
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
      
      // Get the CSRF token from cookies
      csrfToken = getCookie('XSRF-TOKEN');
      console.log('CSRF token initialized successfully:', !!csrfToken);
      isCsrfInitialized = true;
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
      // Don't block the app if CSRF fails
    }
  }
};

// Initialize CSRF token when the module loads
initializeCsrfToken();

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For non-GET requests, ensure we have CSRF token
    if (config.method !== 'get' && config.method !== 'GET') {
      // If we don't have a CSRF token, initialize it
      if (!csrfToken) {
        await initializeCsrfToken();
      }
      
      // Add CSRF token to headers
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
      }
    }
    
    console.log('Making request to:', config.url, 'with CSRF:', !!csrfToken);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    const originalRequest = error.config;
    
    if (error.response?.status === 419) {
      // CSRF token mismatch - reset and retry once
      console.log('CSRF token mismatch, resetting...');
      isCsrfInitialized = false;
      csrfToken = null;
      
      // Reinitialize CSRF token
      await initializeCsrfToken();
      
      // If this was a non-GET request and we have a new CSRF token, retry
      if (originalRequest.method !== 'get' && originalRequest.method !== 'GET' && csrfToken) {
        console.log('Retrying request with new CSRF token...');
        originalRequest.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
        return api.request(originalRequest);
      }
      
      // If retry not possible or failed, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to get cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default api;