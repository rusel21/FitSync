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
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMembership, setFilterMembership] = useState("");

  // Dropdown options
  const genderOptions = ["Male", "Female", "Other"];
  const membershipOptions = ["Daily Plan", "Semi-Monthly Plan", "Monthly Plan", "Premium Plan", "Yearly Plan", "Quarterly Plan"];

  // Backend URL
  const BACKEND_URL = "http://127.0.0.1:8000";

  // Configure axios globally when component mounts
  useEffect(() => {
    axios.defaults.baseURL = BACKEND_URL;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterMembership]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('staff_token') || 
                    localStorage.getItem('admin_token') || 
                    localStorage.getItem('token');
      
      if (!token) {
        alert('No authentication token found. Please log in again.');
        return;
      }

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterMembership) params.append('membership_type', filterMembership);

      const url = `/api/admin/users?${params}`;

      const res = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 10000,
        withCredentials: true
      });

      // Handle different response formats
      if (res.data) {
        if (res.data.success) {
          setUsers(res.data.users || []);
        } else if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setUsers(res.data.users || res.data.data || []);
        }
      } else {
        throw new Error('Empty response from server');
      }
      
    } catch (err) {
      console.error('Error fetching users:', err);
      
      if (err.response) {
        if (err.response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('staff_token');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('token');
          window.location.reload();
        } else if (err.response.status === 403) {
          alert('Access denied. Admin privileges required.');
        } else {
          alert(`Error ${err.response.status}: ${err.response.data?.message || 'Server error'}`);
        }
      } else if (err.request) {
        alert('Network error: Could not connect to server. Please check if Laravel is running on port 8000.');
      } else {
        alert('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('staff_token') || 
                    localStorage.getItem('admin_token') || 
                    localStorage.getItem('token');
      
      const res = await axios.delete(`/api/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert('User deleted successfully!');
      } else {
        alert('Error deleting user: ' + res.data.message);
      }
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
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('staff_token') || 
                    localStorage.getItem('admin_token') || 
                    localStorage.getItem('token');
      
      const res = await axios.put(`/api/admin/users/${editingUser.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (res.data.success) {
        fetchUsers();
        setEditingUser(null);
        alert("User updated successfully!");
      } else {
        alert("Error updating user: " + res.data.message);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user. Please try again.");
    }
  };

  // Filter users based on search and filter (now handled by API)
  const filteredUsers = users;

  // Calculate stats from real data
  const totalMembers = users.length;
  const activeMembers = users.filter(u => u.membership_status === 'Active').length;
  const premiumPlans = users.filter(u => u.membership_type?.includes("Premium")).length;

  return (
    <StaffLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
          <p className="text-gray-300">List of all registered users with their details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-white mt-2">{totalMembers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Members</p>
                <p className="text-2xl font-bold text-white mt-2">{activeMembers}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Premium Plans</p>
                <p className="text-2xl font-bold text-white mt-2">{premiumPlans}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Members</label>
              <input 
                type="text" 
                placeholder="Search by name or email..." 
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
                onClick={fetchUsers}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Member Records</h2>
            <p className="text-gray-400 text-sm">
              {loading ? 'Loading...' : `${filteredUsers.length} members found`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Membership</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-3"></div>
                        Loading members data...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.gender}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{user.email}</td>
                      <td className="px-4 py-3 text-gray-300">{user.contact || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {user.membership_type || 'No Plan'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          user.membership_status === 'Active' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {user.membership_status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No members found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Showing {filteredUsers.length} of {users.length} members
            </div>
            <div className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Membership Type</label>
                  <select
                    value={formData.membership_type}
                    onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Membership</option>
                    {membershipOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex-1"
                >
                  Update User
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default MemberManagement;