import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import auth context

export default function StaffRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "Staff", // Changed from Manager to Admin
    phone: "",
    address: ""
  });
  const [picture, setPicture] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { staff: currentStaff, token } = useAuth(); // Get current staff and token

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!validTypes.includes(file.type)) {
        setMessage("❌ Please select a valid image file (JPG, JPEG, PNG)");
        return;
      }
      
      if (file.size > maxSize) {
        setMessage("❌ Image size must be less than 2MB");
        return;
      }
      
      setPicture(file);
      setMessage(""); // Clear any previous error messages
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setMessage("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Check if current user is admin
      if (!currentStaff || currentStaff.role !== 'Admin') {
        setMessage("❌ Only administrators can register new staff members");
        setLoading(false);
        return;
      }

      // Check if token exists
      if (!token) {
        setMessage("❌ Please login first");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append picture if selected
      if (picture) {
        formDataToSend.append('picture', picture);
      }

      const response = await fetch("http://localhost:8000/api/staff/register", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Staff member registered successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "Staff",
          phone: "",
          address: ""
        });
        setPicture(null);
        
        // Redirect after delay
        setTimeout(() => {
          navigate("/admin/staffmanagement");
        }, 2000);
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setMessage(`❌ ${errorMessages}`);
        } else {
          setMessage(`❌ ${data.message || "Registration failed"}`);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is admin
  const isAdmin = currentStaff?.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Register New Staff Member
          </h1>
          <p className="text-gray-300">
            {isAdmin 
              ? "Add a new staff member to the system" 
              : "Administrator access required"
            }
          </p>
          {!isAdmin && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">
                ❌ You need administrator privileges to register new staff members.
              </p>
            </div>
          )}
        </div>

        {/* Only show form if user is admin */}
        {isAdmin ? (
          <div className="bg-gray-800 rounded-xl border border-blue-600/50 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Staff Information</h2>
              <p className="text-gray-400 text-sm mt-1">
                Registering as: {currentStaff?.name} (Administrator)
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={loading}
                    minLength="6"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                    required
                    disabled={loading}
                    minLength="6"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {/* Role and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Administrator</option> {/* Changed from Manager */}
                  </select>
                  <p className="text-xs text-gray-400 mt-2">
                    Administrators have full system access
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={loading}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  placeholder="Enter address"
                />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={handlePictureChange}
                  disabled={loading}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Optional: JPG, PNG, max 2MB
                </p>
                {picture && (
                  <p className="text-green-400 text-xs mt-1">
                    ✅ {picture.name} selected
                  </p>
                )}
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  message.includes('✅') 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate("/admin/staffmanagement")}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 border border-blue-500 font-medium disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Registering...
                    </>
                  ) : (
                    "Register Staff"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Show alternative content for non-admin users
          <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
            <p className="text-gray-300 mb-6">
              You need administrator privileges to access this page.
            </p>
            <button
              onClick={() => navigate("/staff/profile")}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
            >
              Return to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}