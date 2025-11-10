import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffLayout from "./StaffLayout";
import { useAuth } from "../../context/AuthContext";

const StaffProfile = () => {
  const { staff: authStaff, token } = useAuth();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch staff data using authenticated profile endpoint
  useEffect(() => {
    const fetchStaff = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/staff/profile");
        setStaff(response.data.staff);
        setFormData(response.data.staff);
      } catch (error) {
        console.error("Error fetching staff:", error);
        if (error.response?.status === 401) {
          setMessage("Please log in again");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [token]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection (with preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload profile picture
  const handleUploadPicture = async () => {
    if (!selectedFile) return;

    try {
      const data = new FormData();
      data.append("picture", selectedFile);

      const response = await axios.post(
        "http://localhost:8000/api/staff/upload-picture",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setStaff((prev) => ({
        ...prev,
        picture: response.data.picture_url,
      }));

      setMessage(response.data.message);
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error uploading picture:", error);
      setMessage("Failed to upload picture.");
    }
  };

  // Save profile info
  const handleSaveInfo = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/staff/profile",
        formData
      );
      setStaff(response.data.staff);
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile info:", error);
      setMessage("Failed to update profile info.");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    const newPassword = prompt("Enter new password:");
    const confirmPassword = prompt("Confirm new password:");

    if (!newPassword || !confirmPassword) {
      setMessage("Password change cancelled.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/staff/change-password", {
        current_password: prompt("Enter current password:"),
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage(error.response?.data?.message || "Failed to change password.");
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading staff profile...</p>
          </div>
        </div>
      </StaffLayout>
    );
  }

  if (!staff) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-400 text-lg">No staff data found. Please log in.</p>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Staff Profile</h1>
          <p className="text-gray-300">Manage your staff account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Profile Information</h2>
          </div>

          <div className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-red-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : staff.picture ? (
                    <img
                      src={staff.picture}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <span>{staff.name?.charAt(0) || "?"}</span>
                  )}
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{staff.name}</h1>
                <p className="text-red-400 font-medium">{staff.role}</p>
                <p className="text-gray-400 text-sm mt-1">Employee ID: {staff.staff_id}</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {editing ? (
                <>
                  {selectedFile && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <p className="text-red-400 text-sm mb-2">New picture selected. Click "Upload Picture" to save.</p>
                      <button
                        onClick={handleUploadPicture}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Upload Picture
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button 
                      onClick={handleSaveInfo}
                      className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                    <label className="text-sm text-gray-400">Employee ID</label>
                    <p className="text-white font-medium">{staff.staff_id}</p>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white font-medium">{staff.email}</p>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="text-white font-medium">{staff.phone || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-600 md:col-span-2">
                    <label className="text-sm text-gray-400">Address</label>
                    <p className="text-white font-medium">{staff.address || "No address yet"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Account Actions</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-red-500 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : null}
              <button 
                onClick={handleChangePassword}
                className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg border ${
            message.includes("success") || message.includes("updated") 
              ? "bg-green-500/10 border-green-500/30 text-green-400" 
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message}
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default StaffProfile;