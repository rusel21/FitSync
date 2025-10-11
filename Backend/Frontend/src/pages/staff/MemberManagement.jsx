import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/MemberManagement.css";
import NavAdmin from "../admin/NavAdmin";
import NavStaff from "./NavStaff";

const MemberManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
    contact: "",
    membership_type: "",
    role: "",
  });
  const [role, setRole] = useState(null); // <-- Track current user role

  // Dropdown options
  const genderOptions = ["Male", "Female", "Other"];
  const membershipOptions = ["Daily Plan", "Semi-Monthly Plan", "Monthly Plan"];

  useEffect(() => {
    // Get role from localStorage or API
    const storedRole = localStorage.getItem("role") || "staff"; // default for demo
    setRole(storedRole);

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      address: user.address || "",
      contact: user.contact || "",
      membership_type: user.membership_type || "",
      role: user.role || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const { role, ...dataToUpdate } = formData;
      await axios.put(`http://localhost:8000/api/users/${editingUser.id}`, dataToUpdate);
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const isAdmin = role === "admin";

  return (
    <div className="member-management-layout">
      {/* Dynamic Navigation */}
      {isAdmin ? <NavAdmin /> : <NavStaff />}

      <div className="member-management">
        <h2>Member Management</h2>
        <p className="subtitle">List of all registered users with their details.</p>

        {/* User Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>User Id</th>
              <th>Picture</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Membership Type</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.user_id || user.id}</td>
                  <td>
                    {user.picture ? (
                      <img
                        src={`http://localhost:8000/storage/${user.picture}`}
                        alt={user.name || "User"}
                        className="user-img"
                      />
                    ) : (
                      <span className="no-img">No Photo</span>
                    )}
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.address}</td>
                  <td>{user.contact}</td>
                  <td className="highlight">{user.membership_type || "N/A"}</td>
                  <td>{user.role || "N/A"}</td>
                  <td className="actions">
                    {/* Staff can only view */}
                    {isAdmin ? (
                      <>
                        <button onClick={() => handleEdit(user)} className="btn-edit">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="view-only">View Only</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "15px" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editingUser && isAdmin && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit User</h3>

              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <select
                className="select-dropdown"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="">-- Select Gender --</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />

              <select
                className="select-dropdown"
                value={formData.membership_type}
                onChange={(e) =>
                  setFormData({ ...formData, membership_type: e.target.value })
                }
              >
                <option value="">-- Select Membership Type --</option>
                {membershipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={formData.role}
                readOnly
                className="readonly-input"
              />

              <div className="modal-actions">
                <button onClick={handleUpdate} className="btn-edit">
                  Save
                </button>
                <button onClick={() => setEditingUser(null)} className="btn-delete">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManagement;
