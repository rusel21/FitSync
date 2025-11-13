import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        gender,
        address,
        contact,
        role: "user",
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        setMessage("❌ " + Object.values(error.response.data.errors).join(", "));
      } else if (error.response?.data?.message) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ Registration failed");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="flex w-full h-screen">
        {/* LEFT SIDE - Registration Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-950 overflow-y-auto">
          <div className="w-full max-w-md p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                FitSync
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Join our fitness community today
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                />
              </div>

              {/* Email */}
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
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                />
              </div>

              {/* Password with Toggle */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 pr-10"
                  />
                  {/* Show/Hide Password Button */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition-colors duration-200"
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

              {/* Gender - Fixed Dropdown */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                >
                  <option value="" className="text-gray-400">Select Gender</option>
                  <option value="male" className="text-gray-900 bg-white">
                    Male
                  </option>
                  <option value="female" className="text-gray-900 bg-white">
                    Female
                  </option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              >
                Create Account
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 sm:mt-8">
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                    message.includes("✅")
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {message}
                </div>
              )}
              <p className="text-gray-400 text-xs sm:text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Image Background */}
        <div className="flex-1 relative hidden lg:flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/public/bg.jpg"
              alt="Fitness motivation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black/70"></div>
          </div>

          <div className="relative z-10 text-center text-white px-6 max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-red-400/20">
                <span className="text-2xl">💪</span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
              Transform Your Body
            </h3>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8">
              Join thousands of members achieving their fitness goals with
              personalized training and expert guidance.
            </p>

            {/* Benefits */}
            <div className="space-y-4 text-left">
              {[
                { icon: "🔥", title: "Intense Workouts", desc: "Push your limits with challenging routines" },
                { icon: "📈", title: "Real Progress", desc: "Track your gains and improvements" },
                { icon: "⚡", title: "Energy & Strength", desc: "Build endurance and power" },
                { icon: "🎯", title: "Goal Oriented", desc: "Achieve your specific fitness targets" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-gray-200">
                  <div className="bg-red-500/30 p-2 rounded-lg border border-red-500/20">
                    <span className="text-red-400 font-bold">{item.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-200 text-sm italic">
                "The only bad workout is the one that didn't happen."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;