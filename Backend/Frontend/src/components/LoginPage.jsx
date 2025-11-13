import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axiosConfig";
import { setToken, setRole } from "../utils/auth";
import axios from "axios"; // Import axios directly for CSRF request

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize CSRF token when component mounts
  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        console.log("Initializing CSRF token...");
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
          withCredentials: true
        });
        console.log("CSRF token initialized successfully");
      } catch (error) {
        console.error("CSRF initialization failed:", error);
      }
    };
    
    initializeCsrf();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("Attempting login...");
      
      // Make login request - CSRF should already be set from useEffect
      const res = await api.post("/login", {
        email,
        password,
      });

      console.log("Login response:", res.data);

      // Use helper functions to set token and role
      setToken(res.data.token);
      setRole(res.data.user.role);

      setMessage("✅ Login successful!");

      // Small delay to show success message
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.user.role === "staff") {
          navigate("/staff/dashboard");
        } else {
          navigate("/userdashboard");
        }
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", error.response?.data);
      
      if (error.response?.status === 419) {
        // CSRF token mismatch - try to reinitialize
        setMessage("❌ Session issue. Please wait...");
        try {
          await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
            withCredentials: true
          });
          setMessage("✅ Session refreshed. Please try logging in again.");
        } catch (csrfError) {
          setMessage("❌ Session error. Please refresh the page.");
        }
      } else if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setMessage("❌ Network error. Please check your connection.");
      } else if (error.response?.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (errors?.email) {
          setMessage(`❌ ${errors.email[0]}`);
        } else if (errors?.password) {
          setMessage(`❌ ${errors.password[0]}`);
        } else {
          setMessage("❌ Validation error. Please check your input.");
        }
      } else {
        setMessage("❌ Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center p-0 m-0 overflow-hidden">
      <div className="flex w-full h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-950">
          <div className="w-full max-w-md p-6 sm:p-8">
            {/* Brand Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                FitSync
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Sign in to continue your fitness journey
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Input with Toggle */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-10"
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

              {/* Forgot Password Link */}
              <div className="flex justify-between items-center">
                <div></div> {/* Spacer */}
                <Link 
                  to="/forgot-password" 
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Form Footer */}
            <div className="text-center mt-6 sm:mt-8">
              {/* Message */}
              {message && (
                <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg text-sm font-medium ${
                  message.includes('✅') 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message}
                </div>
              )}

              {/* Register Link */}
              <p className="text-gray-400 text-xs sm:text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image Background */}
        <div className="flex-1 relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/Fitsync-Login.jpg" 
              alt="Fitness motivation"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
            {/* Red gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black/70"></div>
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 text-center text-white px-6 max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-red-400/20">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
              Continue Your Journey
            </h3>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8">
              Pick up where you left off and keep pushing towards your fitness goals with personalized tracking and support.
            </p>
            
            {/* Features List */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">📊</span>
                </div>
                <div>
                  <div className="font-medium text-white">Progress Tracking</div>
                  <div className="text-sm">Monitor your workouts and achievements</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">🎯</span>
                </div>
                <div>
                  <div className="font-medium text-white">Personalized Goals</div>
                  <div className="text-sm">Continue with your custom fitness plan</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">💪</span>
                </div>
                <div>
                  <div className="font-medium text-white">Workout History</div>
                  <div className="text-sm">Access your complete training log</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">⭐</span>
                </div>
                <div>
                  <div className="font-medium text-white">Achievements</div>
                  <div className="text-sm">Track your milestones and badges</div>
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-200 text-sm italic">
                "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;