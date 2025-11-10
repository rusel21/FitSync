import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axiosConfig";
import { setToken, setRole } from "../utils/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

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
      
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setMessage("❌ Network error. Please check your connection.");
      } else {
        setMessage("❌ Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
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

              {/* Password Input */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
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