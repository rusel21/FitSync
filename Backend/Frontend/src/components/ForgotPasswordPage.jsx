import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("Sending password reset request...");
      
      const res = await api.post("/forgot-password", {
        email,
      });

      console.log("Reset request response:", res.data);

      setMessage("✅ Password reset link sent! Check your email.");
      setEmail(""); // Clear email field

    } catch (error) {
      console.error("Password reset error:", error);
      
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors?.email) {
          setMessage(`❌ ${errors.email[0]}`);
        } else {
          setMessage("❌ Please check your email address.");
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setMessage("❌ Network error. Please check your connection.");
      } else {
        setMessage("❌ Failed to send reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center p-0 m-0 overflow-hidden">
      <div className="flex w-full h-screen">
        {/* Left Side - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-950">
          <div className="w-full max-w-md p-6 sm:p-8">
            {/* Brand Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                FitSync
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2">
                Reset Your Password
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Enter your email to receive a reset link
              </p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                    <span>Sending Reset Link...</span>
                  </div>
                ) : (
                  "Send Reset Link"
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

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h4 className="text-gray-200 font-medium mb-2 text-sm">📧 What happens next?</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Check your email for a password reset link</li>
                <li>• The link will expire in 1 hour</li>
                <li>• Follow the instructions in the email</li>
                <li>• Can't find the email? Check your spam folder</li>
              </ul>
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
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
              Secure Account Recovery
            </h3>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8">
              We'll send you a secure link to reset your password and get you back to your fitness journey.
            </p>
            
            {/* Security Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">⏱️</span>
                </div>
                <div>
                  <div className="font-medium text-white">Time-Sensitive</div>
                  <div className="text-sm">Reset links expire after 1 hour</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">🔐</span>
                </div>
                <div>
                  <div className="font-medium text-white">Secure Process</div>
                  <div className="text-sm">Encrypted token-based reset</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-200">
                <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">📨</span>
                </div>
                <div>
                  <div className="font-medium text-white">Email Verification</div>
                  <div className="text-sm">Sent only to registered email</div>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-200 text-sm">
                <strong>Security Tip:</strong> Never share your reset link with anyone. FitSync will never ask for your password via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;