import { useState } from 'react';
import AdminLayout from './AdminLayout';
export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Mock staff data
  const staffMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@fitsync.com',
      role: 'Senior Staff',
      department: 'Operations',
      status: 'Active',
      joinDate: '2023-05-15',
      lastActive: '2024-12-19',
      permissions: ['members', 'payments', 'attendance', 'communications'],
      phone: '+1234567890'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@fitsync.com',
      role: 'Staff',
      department: 'Front Desk',
      status: 'Active',
      joinDate: '2024-01-10',
      lastActive: '2024-12-19',
      permissions: ['members', 'attendance'],
      phone: '+1234567891'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma@fitsync.com',
      role: 'Trainer',
      department: 'Fitness',
      status: 'Active',
      joinDate: '2023-11-20',
      lastActive: '2024-12-18',
      permissions: ['scheduling', 'communications'],
      phone: '+1234567892'
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@fitsync.com',
      role: 'Staff',
      department: 'Operations',
      status: 'Inactive',
      joinDate: '2024-03-01',
      lastActive: '2024-12-10',
      permissions: ['members'],
      phone: '+1234567893'
    }
  ];

  const roles = [
    { id: 1, name: 'Senior Staff', permissions: ['full_access'], memberCount: 2 },
    { id: 2, name: 'Staff', permissions: ['members', 'payments', 'attendance'], memberCount: 8 },
    { id: 3, name: 'Trainer', permissions: ['scheduling', 'communications'], memberCount: 5 },
    { id: 4, name: 'Reception', permissions: ['members', 'attendance'], memberCount: 3 }
  ];

  const permissionGroups = {
    members: ['create', 'read', 'update', 'deactivate'],
    attendance: ['check_in', 'check_out', 'reports'],
    payments: ['process', 'track', 'remind'],
    communications: ['send', 'templates', 'automate'],
    scheduling: ['manage', 'approve', 'coordinate'],
    reports: ['generate', 'export']
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStaffStatus = (staffId, currentStatus) => {
    // Implementation for toggling staff status
    alert(`${currentStatus === 'Active' ? 'Deactivating' : 'Activating'} staff member ${staffId}`);
  };

  const resetStaffPassword = (staffId) => {
    // Implementation for password reset
    alert(`Resetting password for staff member ${staffId}`);
  };

  const exportStaffData = () => {
    const dataToExport = selectedStaff.length > 0 ? 
      staffMembers.filter(s => selectedStaff.includes(s.id)) : 
      staffMembers;
    
    alert(`Exporting ${dataToExport.length} staff records`);
  };

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto">
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
                {staffMembers.filter(s => s.status === 'Active').length}
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
              <p className="text-gray-400 text-sm">Roles</p>
              <p className="text-2xl font-bold text-yellow-400">{roles.length}</p>
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
              <p className="text-gray-400 text-sm">Avg. Activity</p>
              <p className="text-2xl font-bold text-purple-400">92%</p>
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
                    onClick={() => setShowAddStaffModal(true)}
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
                        Role & Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Permissions
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
                            <div className="text-sm text-gray-400">{staff.department}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            staff.status === 'Active' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-red-900 text-red-200'
                          }`}>
                            {staff.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {staff.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {staff.permissions.slice(0, 3).map(permission => (
                              <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-900 text-blue-200">
                                {permission}
                              </span>
                            ))}
                            {staff.permissions.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">
                                +{staff.permissions.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <div className="flex space-x-2">
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                              Edit
                            </button>
                            <button 
                              onClick={() => toggleStaffStatus(staff.id, staff.status)}
                              className={`${
                                staff.status === 'Active' 
                                  ? 'text-yellow-400 hover:text-yellow-300' 
                                  : 'text-green-400 hover:text-green-300'
                              } transition-colors`}
                            >
                              {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => resetStaffPassword(staff.id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Reset Password
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
                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors">
                  Create New Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-red-600 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-white">{role.name}</h4>
                      <span className="bg-red-900 text-red-200 px-2 py-1 rounded text-sm">
                        {role.memberCount} members
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
                      <div className="flex space-x-2 pt-2">
                        <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded text-sm transition-colors">
                          Edit Role
                        </button>
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm transition-colors">
                          View Members
                        </button>
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
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded text-sm transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-red-600">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Staff Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Role</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500">
                  <option>Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Department</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter department"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition-colors">
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}