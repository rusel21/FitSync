import { useEffect, useState } from "react";
import axios from "axios";
import StaffLayout from "./StaffLayout";

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMembership, setFilterMembership] = useState("");

  // Dropdown options
  const genderOptions = ["Male", "Female", "Other"];
  const membershipOptions = ["Daily Plan", "Semi-Monthly Plan", "Monthly Plan", "Premium Plan", "Yearly Plan", "Quarterly Plan"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user. Please try again.");
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
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user. Please try again.");
    }
  };

  // Filter users based on search and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembership = !filterMembership || user.membership_type === filterMembership;
    return matchesSearch && matchesMembership;
  });

  return (
    <StaffLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
          <p className="text-gray-300">List of all registered users with their details</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Members</label>
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Membership</label>
              <select
                value={filterMembership}
                onChange={(e) => setFilterMembership(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="">All Memberships</option>
                {membershipOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSearchTerm(""); setFilterMembership(""); }}
                className="w-full border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-red-600/50">
            <p className="text-gray-300 text-sm">Total Members</p>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-green-600/50">
            <p className="text-gray-300 text-sm">Active Members</p>
            <p className="text-2xl font-bold text-white">
              {users.filter(u => u.membership_type && u.membership_type !== "N/A").length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-blue-600/50">
            <p className="text-gray-300 text-sm">Premium Plans</p>
            <p className="text-2xl font-bold text-white">
              {users.filter(u => u.membership_type?.includes("Premium")).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600/50">
            <p className="text-gray-300 text-sm">Staff Accounts</p>
            <p className="text-2xl font-bold text-white">
              {users.filter(u => u.role === "staff").length}
            </p>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Member List</h2>
            <span className="text-gray-400 text-sm">
              {filteredUsers.length} of {users.length} members
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading members...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Picture</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Gender</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Membership</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3 text-white font-mono text-sm">{user.user_id || user.id}</td>
                        <td className="px-4 py-3">
                          {user.picture ? (
                            <img
                              src={`http://localhost:8000/storage/${user.picture}`}
                              alt={user.name || "User"}
                              className="w-10 h-10 rounded-full object-cover border border-gray-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400 text-sm">
                              No Photo
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-gray-300">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.gender === 'Male' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            user.gender === 'Female' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {user.gender || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{user.contact || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.membership_type?.includes('Premium') ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            user.membership_type?.includes('Yearly') ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {user.membership_type || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            user.role === 'staff' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {user.role || "Member"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200 border border-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200 border border-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
                        No members found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Edit Member</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Membership Type</label>
                  <select
                    value={formData.membership_type}
                    onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Membership Type</option>
                    {membershipOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    readOnly
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default MemberManagement;