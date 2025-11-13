import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../utils/axiosConfig";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  useEffect(() => {
    // Get token and email from URL parameters
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    if (!urlToken || !urlEmail) {
      setMessage("❌ Invalid reset link. Please request a new one.");
      setTokenValid(false);
      return;
    }

    setToken(urlToken);
    setEmail(decodeURIComponent(urlEmail));

    // Verify token validity
    verifyToken(urlToken, decodeURIComponent(urlEmail));
  }, [searchParams]);

  const verifyToken = async (token, email) => {
    try {
      console.log("Verifying reset token...");
      
      const res = await api.post("/verify-reset-token", {
        token,
        email,
      });

      console.log("Token verification response:", res.data);
      
      setTokenValid(true);
      setMessage("✅ Token verified. You can now set your new password.");

    } catch (error) {
      console.error("Token verification error:", error);
      
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Invalid or expired reset token.");
      }
      setTokenValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate passwords match
    if (password !== passwordConfirmation) {
      setMessage("❌ Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      console.log("Resetting password...");
      
      const res = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      console.log("Password reset response:", res.data);

      setMessage("✅ Password reset successfully! Redirecting to login...");

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Password reset error:", error);
      
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors?.password) {
          setMessage(`❌ ${errors.password[0]}`);
        } else {
          setMessage("❌ Please check your input.");
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setMessage("❌ Network error. Please check your connection.");
      } else {
        setMessage("❌ Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <span className="text-2xl text-red-400">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="space-y-3">
            <Link 
              to="/forgot-password" 
              className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Request New Reset Link
            </Link>
            <Link 
              to="/login" 
              className="block w-full bg-gray-700 text-gray-200 py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center p-0 m-0 overflow-hidden">
      <div className="flex w-full h-screen">
        {/* Left Side - Reset Password Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-950">
          <div className="w-full max-w-md p-6 sm:p-8">
            {/* Brand Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                FitSync
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2">
                Set New Password
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Create a new password for your account
              </p>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Display (read-only) */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
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

              {/* Back to Login Link */}
              <p className="text-gray-400 text-xs sm:text-sm">
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200 hover:underline"
                >
                  Back to Login
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-green-400/20">
                <span className="text-2xl">🔑</span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
              New Beginning
            </h3>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8">
              Set a strong new password and continue your fitness journey with enhanced security.
            </p>
            
            {/* Password Tips */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-green-500/30 p-2 rounded-lg border border-green-500/20">
                  <span className="text-green-400 font-bold">💪</span>
                </div>
                <div>
                  <div className="font-medium text-white">Strong & Secure</div>
                  <div className="text-sm">Use a mix of letters, numbers & symbols</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-green-500/30 p-2 rounded-lg border border-green-500/20">
                  <span className="text-green-400 font-bold">🎯</span>
                </div>
                <div>
                  <div className="font-medium text-white">Minimum Length</div>
                  <div className="text-sm">At least 6 characters required</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-green-500/30 p-2 rounded-lg border border-green-500/20">
                  <span className="text-green-400 font-bold">🔄</span>
                </div>
                <div>
                  <div className="font-medium text-white">Easy to Remember</div>
                  <div className="text-sm">Choose something memorable but secure</div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-200 text-sm">
                <strong>Success!</strong> Once reset, you'll be redirected to login with your new password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;