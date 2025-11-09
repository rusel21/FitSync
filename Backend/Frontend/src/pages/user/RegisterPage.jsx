import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

              {/* Password */}
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                />
              </div>

              {/* Gender */}
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
                  <option value="">Select Gender</option>
                  <option value="male" className="text-gray-900">
                    Male
                  </option>
                  <option value="female" className="text-gray-900">
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