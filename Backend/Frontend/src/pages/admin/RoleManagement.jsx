import { useState } from "react";
import { FaEdit, FaTrash, FaUserShield, FaUser, FaDumbbell, FaUserTie } from "react-icons/fa";
import AdminLayout from "./AdminLayout";

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Admin",
      description: "Full access to all system features and administrative controls",
      permissions: ["All Permissions", "User Management", "System Settings", "Billing", "Reports"],
      memberCount: 3,
      status: "active"
    },
    {
      id: 2,
      name: "Staff",
      description: "Manage daily operations, attendance, and member information",
      permissions: ["Attendance Management", "Member Profiles", "Payment Tracking", "Basic Reports"],
      memberCount: 12,
      status: "active"
    },
    {
      id: 3,
      name: "Trainer",
      description: "Manage training sessions and assigned member progress",
      permissions: ["Session Management", "Assigned Members", "Progress Tracking", "Schedule"],
      memberCount: 8,
      status: "active"
    },
    {
      id: 4,
      name: "Member",
      description: "View personal dashboard and manage own profile",
      permissions: ["Personal Dashboard", "Profile Management", "Booking", "Payment History"],
      memberCount: 245,
      status: "active"
    },
    {
      id: 5,
      name: "Manager",
      description: "Oversee staff operations and generate reports",
      permissions: ["Staff Management", "Advanced Reports", "Inventory", "Schedule Oversight"],
      memberCount: 2,
      status: "inactive"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return <FaUserShield className="w-5 h-5" />;
      case 'staff': return <FaUserTie className="w-5 h-5" />;
      case 'trainer': return <FaDumbbell className="w-5 h-5" />;
      case 'member': return <FaUser className="w-5 h-5" />;
      default: return <FaUserShield className="w-5 h-5" />;
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'staff': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'trainer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'member': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleDelete = (roleId) => {
    if (window.confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const handleToggleStatus = (roleId) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, status: role.status === 'active' ? 'inactive' : 'active' }
        : role
    ));
  };

  const stats = [
    { label: 'Total Roles', value: roles.length, color: 'blue' },
    { label: 'Active Roles', value: roles.filter(r => r.status === 'active').length, color: 'green' },
    { label: 'Total Users', value: roles.reduce((sum, role) => sum + role.memberCount, 0), color: 'purple' },
    { label: 'System Roles', value: '5', color: 'red' }
  ];

  const availablePermissions = [
    "User Management", "Role Management", "System Settings", "Billing", "Reports",
    "Attendance Management", "Member Profiles", "Payment Tracking", "Session Management",
    "Progress Tracking", "Schedule Management", "Inventory", "Staff Management"
  ];

  return (
   // <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Role Management & Access Control</h1>
          <p className="text-gray-300">Manage roles and permissions within the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  stat.color === 'green' ? 'bg-green-500/20' :
                  stat.color === 'purple' ? 'bg-purple-500/20' :
                  'bg-red-500/20'
                } rounded-full flex items-center justify-center`}>
                  <FaUserShield className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-red-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Roles</label>
              <input 
                type="text" 
                placeholder="Search by role name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 border border-red-500 flex items-center gap-2"
            >
              <FaUserShield className="w-4 h-4" />
              Add New Role
            </button>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">System Roles</h2>
            <p className="text-gray-400 text-sm">Manage access levels and permissions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ROLE NAME</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">DESCRIPTION</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">USERS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">STATUS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PERMISSIONS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            role.name === 'Admin' ? 'bg-red-500/20' :
                            role.name === 'Staff' ? 'bg-blue-500/20' :
                            role.name === 'Trainer' ? 'bg-green-500/20' :
                            'bg-purple-500/20'
                          }`}>
                            {getRoleIcon(role.name)}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{role.name}</p>
                            <p className="text-gray-400 text-xs">{role.memberCount} users</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-xs">
                        <p className="text-sm">{role.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-center">
                          <p className="text-white font-semibold text-lg">{role.memberCount}</p>
                          <p className="text-gray-400 text-xs">users</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(role.status)}`}>
                          {role.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {role.permissions.slice(0, 3).map((permission, index) => (
                            <span 
                              key={index}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(role.name)}`}
                            >
                              {permission}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="text-blue-400 text-xs">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(role)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                            title="Edit Role"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                            title="Delete Role"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(role.id)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                              role.status === 'active'
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                            }`}
                          >
                            {role.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No roles found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <FaUserShield className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" />
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Permission Templates</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <FaUserTie className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" />
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Access Logs</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <FaDumbbell className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" />
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Security Settings</span>
          </button>
        </div>

        {/* Add/Edit Role Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">
                  {editingRole ? 'Edit Role' : 'Add New Role'}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Enter role name"
                      defaultValue={editingRole?.name || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      defaultValue={editingRole?.status || 'active'}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Enter role description"
                      rows="3"
                      defaultValue={editingRole?.description || ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Permissions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availablePermissions.map((permission, index) => (
                      <label key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2" />
                        <span className="text-gray-300 text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500">
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setEditingRole(null);
                    }}
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
   // </AdminLayout>
  );
};

export default RoleManagement;