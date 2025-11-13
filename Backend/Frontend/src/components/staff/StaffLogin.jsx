import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, staffs } = useAuth(); // Get staff data from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        // Role-based redirection after successful login
        if (staffs?.role === 'Admin') {
          navigate('/admin/dashboard'); // Redirect admins to admin dashboard
        } else {
          navigate('/staff/profile'); // Redirect regular staff to staff profile
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Enhanced Header with Role Information */}
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            FitSync Staff Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to access your workspace
          </p>
          
          {/* Role Indicators */}
          <div className="mt-4 flex justify-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
              Staff Access
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Admin Access
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Staff email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {/* Password Input with Toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in to Portal'
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 text-sm">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              User Login
            </button>
            <span className="text-gray-500">•</span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-300">
                  <strong>Staff:</strong> Member management, check-ins, payments
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  <strong>Admin:</strong> Full system access + staff features
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;