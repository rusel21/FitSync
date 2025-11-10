
import axios from 'axios';
import { getStaffToken, logoutStaff } from './staffAuth';

// Create axios instance for staff API calls
const staffApi = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request interceptor to add staff token to all requests
staffApi.interceptors.request.use(
  (config) => {
    const token = getStaffToken();
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
staffApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired
      logoutStaff();
    }
    return Promise.reject(error);
  }
);

export default staffApi;