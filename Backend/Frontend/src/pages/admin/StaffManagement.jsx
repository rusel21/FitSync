import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { staff: currentStaff, token } = useAuth();

  // Mock roles data (you can replace this with API call if needed)
  const roles = [
    { id: 1, name: 'Admin', permissions: ['full_access'], memberCount: 1 },
    { id: 2, name: 'Staff', permissions: ['members', 'payments', 'attendance'], memberCount: 0 },
  ];

  const permissionGroups = {
    members: ['create', 'read', 'update', 'deactivate'],
    attendance: ['check_in', 'check_out', 'reports'],
    payments: ['process', 'track', 'remind'],
    communications: ['send', 'templates', 'automate'],
    scheduling: ['manage', 'approve', 'coordinate'],
    reports: ['generate', 'export']
  };

  // Fetch staff members from API
  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/staff', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setStaffMembers(response.data.staff || response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStaff?.role === 'Admin' && token) {
      fetchStaffMembers();
    }
  }, [currentStaff, token]);

  const filteredStaff = staffMembers.filter(staff =>
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      // Update staff status - you'll need to implement this endpoint
      const response = await axios.put(`http://localhost:8000/api/staff/${staffId}`, {
        status: currentStatus === 'Active' ? 'Inactive' : 'Active'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setMessage(`Staff member ${currentStatus === 'Active' ? 'deactivated' : 'activated'} successfully`);
      fetchStaffMembers(); // Refresh the list
    } catch (error) {
      console.error('Error updating staff status:', error);
      setError('Failed to update staff status');
    }
  };

  const resetStaffPassword = async (staffId) => {
    try {
      // Implement password reset endpoint
      const response = await axios.post(`http://localhost:8000/api/staff/${staffId}/reset-password`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setMessage('Password reset email sent successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password');
    }
  };

  const deleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/staff/${staffId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setMessage('Staff member deleted successfully');
      fetchStaffMembers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError('Failed to delete staff member');
    }
  };

  const exportStaffData = () => {
    const dataToExport = selectedStaff.length > 0 ? 
      staffMembers.filter(s => selectedStaff.includes(s.id)) : 
      staffMembers;
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Role', 'Phone', 'Status', 'Join Date'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(staff => [
        staff.name,
        staff.email,
        staff.role,
        staff.phone || '',
        staff.status || 'Active',
        staff.created_at || new Date().toISOString().split('T')[0]
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    setMessage(`Exported ${dataToExport.length} staff records`);
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // Check if current user is admin
  const isAdmin = currentStaff?.role === 'Admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need administrator privileges to access this page.</p>
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
              <p className="text-gray-400">Manage staff accounts, permissions, and system access</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Admin Control
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Staff</p>
                <p className="text-2xl font-bold text-white">{staffMembers.length}</p>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Staff</p>
                <p className="text-2xl font-bold text-green-400">
                  {staffMembers.filter(s => s.status !== 'Inactive').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {staffMembers.filter(s => s.role === 'Admin').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Regular Staff</p>
                <p className="text-2xl font-bold text-purple-400">
                  {staffMembers.filter(s => s.role === 'Staff').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6 border border-gray-700">
          <div className="flex border-b border-gray-700">
            {['staff', 'roles', 'permissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-red-400 border-b-2 border-red-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Staff Management Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                {/* Search and Actions */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search staff by name, email, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate('/staff/register')}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Staff</span>
                    </button>
                    <button
                      onClick={exportStaffData}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Staff Table */}
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaff(staffMembers.map(s => s.id));
                              } else {
                                setSelectedStaff([]);
                              }
                            }}
                            className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Staff Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Role & Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedStaff.includes(staff.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStaff([...selectedStaff, staff.id]);
                                } else {
                                  setSelectedStaff(selectedStaff.filter(id => id !== staff.id));
                                }
                              }}
                              className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{staff.name}</div>
                              <div className="text-sm text-gray-400">{staff.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-white">{staff.role}</div>
                              <div className="text-sm text-gray-400">{staff.phone || 'No phone'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              staff.status !== 'Inactive' 
                                ? 'bg-green-900 text-green-200' 
                                : 'bg-red-900 text-red-200'
                            }`}>
                              {staff.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {staff.created_at ? new Date(staff.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => navigate(`/admin/staff/${staff.staff_id || staff.id}`)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => toggleStaffStatus(staff.id, staff.status)}
                                className={`${
                                  staff.status !== 'Inactive' 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-green-400 hover:text-green-300'
                                } transition-colors`}
                              >
                                {staff.status !== 'Inactive' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                onClick={() => resetStaffPassword(staff.id)}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                Reset Password
                              </button>
                              <button 
                                onClick={() => deleteStaff(staff.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Roles Management Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">System Roles</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roles.map((role) => (
                    <div key={role.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-red-600 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-white">{role.name}</h4>
                        <span className="bg-red-900 text-red-200 px-2 py-1 rounded text-sm">
                          {staffMembers.filter(s => s.role === role.name).length} members
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400 text-sm">Permissions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {role.permissions.map(permission => (
                              <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-900 text-purple-200">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Permission Groups</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.entries(permissionGroups).map(([group, permissions]) => (
                    <div key={group} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="text-md font-semibold text-white mb-4 capitalize">{group}</h4>
                      <div className="space-y-2">
                        {permissions.map(permission => (
                          <label key={permission} className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm capitalize">{permission}</span>
                            <input 
                              type="checkbox" 
                              defaultChecked
                              className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}