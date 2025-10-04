import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/StaffProfile.css";
import NavStaff from "./NavStaff";

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const staffId = "Staff-0001"; // Replace with authenticated staff ID

  // Fetch staff data
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/staff/${staffId}`
        );
        setStaff(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [staffId]);

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
        `http://localhost:8000/api/staff/upload-picture/${staffId}`,
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
        `http://localhost:8000/api/staff/${staffId}`,
        formData
      );
      setStaff(response.data);
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile info:", error);
      setMessage("Failed to update profile info.");
    }
  };

  // Change password redirect
  const handleChangePassword = () => {
    window.location.href = "/change-password";
  };

  // Deactivate account
  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate this account?"))
      return;
    try {
      await axios.put(
        `http://localhost:8000/api/staff/${staffId}/deactivate`
      );
      setMessage("Account deactivated successfully.");
    } catch (err) {
      console.error("Error deactivating account:", err);
      setMessage("Failed to deactivate account.");
    }
  };

  if (loading) return <p className="loading">Loading staff profile...</p>;
  if (!staff) return <p className="error">No staff data found.</p>;

  return (
    <>
      <NavStaff />
      <div className="staff-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar">
              {preview ? (
                <img src={preview} alt="Preview" className="avatar-preview" />
              ) : staff.picture ? (
                <img
                    src={`http://127.0.0.1:8000/staff/image/${staff.picture}`}
                    alt={staff.name}
                    className="avatar-preview"
                  />

              ) : (
                staff.name?.charAt(0) || "?"
              )}
            </div>
            <div className="staff-info">
              <h1>{staff.name}</h1>
              <p>{staff.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          {editing ? (
            <>
              <div className="info-item">
                <span>Profile Picture:</span>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {selectedFile && (
                  <button
                    className="secondary"
                    onClick={handleUploadPicture}
                  >
                    Upload Picture
                  </button>
                )}
              </div>
              <div className="info-item">
                <span>Name:</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="info-item">
                <span>Phone:</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="info-item">
                <span>Address:</span>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-buttons">
                <button className="primary" onClick={handleSaveInfo}>
                  Save Info
                </button>
                <button
                  className="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="info-item">
                <span>Employee ID:</span>
                <p>{staff.staff_id}</p>
              </div>
              <div className="info-item">
                <span>Email:</span>
                <p>{staff.email}</p>
              </div>
              <div className="info-item">
                <span>Phone:</span>
                <p>{staff.phone || "Not provided"}</p>
              </div>
              <div className="info-item">
                <span>Address:</span>
                <p>{staff.address || "No address yet"}</p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
          <button className="secondary" onClick={handleChangePassword}>
            Change Password
          </button>
          <button className="secondary" onClick={handleDeactivate}>
            Deactivate Account
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}
      </div>
    </>
  );
};

export default StaffProfile;
