import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('staff_token'));
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('staff_token');
      
      if (savedToken) {
        // Set axios default headers BEFORE making any requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        setToken(savedToken);
        console.log('✅ Token initialized from localStorage:', savedToken);
      } else {
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        console.log('❌ No token found in localStorage');
      }
    };

    initializeAuth();
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('staff_token', token);
      console.log('✅ Axios headers updated with token');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('staff_token');
      console.log('✅ Axios headers cleared');
    }
  }, [token]);

  // Verify token on app load and when token changes
  useEffect(() => {
    const verifyToken = async () => {
      console.log('🔄 Verifying token...', token);
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Making profile request...');
        const response = await axios.get('http://localhost:8000/api/staff/profile');
        console.log('✅ Token verification successful:', response.data);
        setStaff(response.data.staff);
      } catch (error) {
        console.error('❌ Token verification failed:', error);
        if (error.response?.status === 401) {
          console.log('🔄 401 received, logging out...');
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login...', email);
      
      // Remove any existing auth headers for login
      delete axios.defaults.headers.common['Authorization'];
      
      const response = await axios.post('http://localhost:8000/api/staff/login', {
        email,
        password
      });

      console.log('✅ Login response:', response.data);

      const { token: newToken, staff: staffData } = response.data;
      
      // Set token first (this will trigger the useEffect)
      setToken(newToken);
      setStaff(staffData);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Only try to logout if we have a valid token
      if (token) {
        await axios.post('http://localhost:8000/api/staff/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setStaff(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('staff_token');
      console.log('✅ Logged out successfully');
    }
  };

  const value = {
    staff,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!staff && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};