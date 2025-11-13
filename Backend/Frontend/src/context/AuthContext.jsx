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
  const [backendOnline, setBackendOnline] = useState(null);
  const [corsFixed, setCorsFixed] = useState(false);

  // Configure axios with better error handling
  useEffect(() => {
    console.log('🔄 Configuring axios...');
    
    axios.defaults.baseURL = 'http://127.0.0.1:8000';
    axios.defaults.timeout = 8000;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    const savedToken = localStorage.getItem('staff_token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setToken(savedToken);
      console.log('✅ Token loaded from localStorage');
    }
  }, []);

  // Enhanced backend check with CORS handling
  useEffect(() => {
    const checkBackend = async () => {
      console.log('🔍 Checking Laravel backend with CORS diagnostics...');
      
      // Test 1: Try direct API endpoint (might bypass some CORS issues)
      try {
        console.log('🔄 Testing direct API endpoint...');
        const response = await axios.get('/api/test-cors', {
          timeout: 3000,
          validateStatus: () => true // Accept any status code
        });
        
        console.log('✅ Backend responded to API endpoint:', response.status);
        setBackendOnline(true);
        setCorsFixed(true);
        return;
      } catch (apiError) {
        console.log('❌ API endpoint failed:', apiError.message);
      }

      // Test 2: Try without credentials (simpler CORS request)
      try {
        console.log('🔄 Testing without credentials...');
        const response = await axios.get('/api/test-cors', {
          timeout: 3000,
          withCredentials: false, // Try without credentials
          validateStatus: () => true
        });
        
        console.log('✅ Backend responded without credentials:', response.status);
        setBackendOnline(true);
        return;
      } catch (simpleError) {
        console.log('❌ Simple request also failed:', simpleError.message);
      }

      // Test 3: Try a completely different approach - fetch API
      try {
        console.log('🔄 Testing with fetch API...');
        const response = await fetch('http://127.0.0.1:8000/api/test-cors', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Fetch API worked:', data);
          setBackendOnline(true);
          return;
        } else {
          console.log('❌ Fetch API failed with status:', response.status);
        }
      } catch (fetchError) {
        console.log('❌ Fetch API also failed:', fetchError.message);
      }

      console.error('🚨 All connection attempts failed - CORS is blocking everything');
      setBackendOnline(false);
    };

    checkBackend();
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('staff_token', token);
      console.log('✅ Token saved to localStorage and axios headers');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('staff_token');
      console.log('✅ Token removed from storage and headers');
    }
  }, [token]);

  // Skip token verification if CORS is blocking everything
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || backendOnline === false) {
        setLoading(false);
        return;
      }

      console.log('🔄 Verifying token...');
      
      try {
        const response = await axios.get('/api/staff/profile', {
          timeout: 5000,
          validateStatus: (status) => status < 500 // Don't throw on 401/403
        });
        
        console.log('✅ Token verification successful');
        
        if (response.data.staff) {
          setStaff(response.data.staff);
        } else {
          console.error('❌ No staff data in response');
          logout();
        }
      } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        
        if (error.response?.status === 401) {
          console.log('🔄 401 - token invalid');
          logout();
        } else if (error.code === 'ERR_NETWORK') {
          console.log('🌐 Network error - might be CORS');
          // Don't set backendOnline to false here - we already checked it
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && backendOnline !== null) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token, backendOnline]);

  const login = async (email, password) => {
    if (backendOnline === false) {
      return { 
        success: false, 
        message: 'Cannot connect to server. Please check:\n1. Laravel is running on http://127.0.0.1:8000\n2. CORS is properly configured\n3. Server is not blocked by firewall' 
      };
    }

    setLoading(true);
    
    try {
      console.log('🔄 Attempting login...');

      // Try to get CSRF cookie but don't fail if it doesn't work
      try {
        await axios.get('/sanctum/csrf-cookie', { timeout: 3000 });
        console.log('✅ CSRF cookie obtained');
      } catch (csrfError) {
        console.warn('⚠️ CSRF cookie failed, continuing...:', csrfError.message);
      }
      
      const response = await axios.post('/api/staff/login', {
        email,
        password
      }, {
        timeout: 8000,
        validateStatus: (status) => status < 500 // Don't throw on 400-level errors
      });

      console.log('✅ Login response received');

      const { token: newToken, staff: staffData } = response.data;

      if (!newToken) {
        throw new Error('No authentication token received');
      }

      setToken(newToken);
      setStaff(staffData);
      setBackendOnline(true);
      
      return { 
        success: true, 
        message: 'Login successful!',
        staff: staffData
      };

    } catch (error) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Login failed. ';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Network error - check if Laravel server is running and CORS is configured.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Invalid email or password.';
      } else if (error.response?.status === 422) {
        errorMessage += 'Please check your input.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message.includes('timeout')) {
        errorMessage += 'Server timeout.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token && backendOnline) {
        await axios.post('/api/staff/logout', {}, { timeout: 3000 });
      }
    } catch (error) {
      console.error('Logout API call failed:', error.message);
    } finally {
      setStaff(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('staff_token');
      console.log('✅ Logged out');
    }
  };

  const retryConnection = async () => {
    console.log('🔄 Retrying connection...');
    setLoading(true);
    
    try {
      // Try multiple endpoints
      const endpoints = ['/api/test-cors', '/sanctum/csrf-cookie', '/api/staff/profile'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, { 
            timeout: 3000,
            validateStatus: () => true
          });
          console.log(`✅ ${endpoint} responded:`, response.status);
          setBackendOnline(true);
          setLoading(false);
          return true;
        } catch (error) {
          console.log(`❌ ${endpoint} failed:`, error.message);
        }
      }
      
      setBackendOnline(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const diagnoseCors = async () => {
    console.log('🔧 Running CORS diagnostics...');
    
    const tests = [
      { name: 'API Test Endpoint', url: '/api/test-cors' },
      { name: 'CSRF Cookie', url: '/sanctum/csrf-cookie' },
      { name: 'Membership Plans', url: '/api/membership/plans' }
    ];

    for (const test of tests) {
      try {
        const response = await axios.get(test.url, {
          timeout: 3000,
          validateStatus: () => true
        });
        console.log(`✅ ${test.name}: Status ${response.status}`);
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }
  };

  const value = {
    staff,
    token,
    login,
    logout,
    loading,
    backendOnline,
    retryConnection,
    diagnoseCors,
    isAuthenticated: !!staff && !!token,
    corsIssues: backendOnline === false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;