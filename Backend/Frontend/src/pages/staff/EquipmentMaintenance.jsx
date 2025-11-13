import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import StaffLayout from './StaffLayout';

export default function EquipmentManagement() {
  const [activeView, setActiveView] = useState('inventory');
  const [equipmentData, setEquipmentData] = useState({
    equipment: [],
    maintenanceRequests: [],
    reports: {},
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchEquipmentData = async (view = 'inventory') => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/staff/equipment/management?view=${view}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setEquipmentData(response.data);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
      setError('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (equipmentData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/staff/equipment/equipment', equipmentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchEquipmentData(activeView);
      return response.data;
    } catch (error) {
      console.error('Error adding equipment:', error);
      throw error;
    }
  };

  const handleUpdateEquipment = async (id, updateData) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/staff/equipment/equipment/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchEquipmentData(activeView);
      return response.data;
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  };

  const handleCreateMaintenanceRequest = async (requestData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/staff/equipment/maintenance-requests', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchEquipmentData(activeView);
      return response.data;
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      throw error;
    }
  };

  const handleUpdateMaintenanceRequest = async (id, updateData) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/staff/equipment/maintenance-requests/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchEquipmentData(activeView);
      return response.data;
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      throw error;
    }
  };

  const handlePerformMaintenance = async (id, maintenanceData) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/staff/equipment/equipment/${id}/maintenance`, maintenanceData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchEquipmentData(activeView);
      return response.data;
    } catch (error) {
      console.error('Error performing maintenance:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEquipmentData(activeView);
  }, [activeView]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-900 text-green-200';
      case 'Maintenance':
        return 'bg-yellow-900 text-yellow-200';
      case 'Out of Service':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
      case 'Critical':
        return 'bg-red-900 text-red-200';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-200';
      case 'Low':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  if (loading) {
    return (
      <StaffLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading equipment data...</p>
          </div>
        </div>
      </StaffLayout>
    );
  }

  if (error) {
    return (
      <StaffLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Equipment Data</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => fetchEquipmentData(activeView)}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Equipment Management</h1>
          <p className="text-gray-400">Manage gym equipment, maintenance schedules, and service requests</p>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-4 mb-6">
          {['inventory', 'maintenance', 'reports'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeView === view
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Equipment Inventory View */}
        {activeView === 'inventory' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Equipment Inventory</h2>
              <button 
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => {/* Add equipment modal logic */}}
              >
                Add Equipment
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Equipment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Next Maintenance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {equipmentData.equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{item.name}</div>
                        {item.model && <div className="text-gray-400 text-sm">{item.model}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{item.type}</td>
                      <td className="px-6 py-4 text-gray-400">{item.category}</td>
                      <td className="px-6 py-4 text-gray-400">{item.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                          {item.needs_maintenance && item.status === 'Operational' && (
                            <span className="ml-1 w-2 h-2 bg-red-400 rounded-full"></span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-400">{item.next_maintenance || 'Not scheduled'}</div>
                        {item.days_until_maintenance !== null && (
                          <div className={`text-xs ${item.days_until_maintenance <= 7 ? 'text-red-400' : 'text-gray-500'}`}>
                            {item.days_until_maintenance > 0 
                              ? `${item.days_until_maintenance} days` 
                              : item.days_until_maintenance === 0 
                                ? 'Today' 
                                : `${Math.abs(item.days_until_maintenance)} days overdue`
                            }
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                            onClick={() => {/* Maintenance modal logic */}}
                          >
                            Maintain
                          </button>
                          <button 
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                            onClick={() => {/* Edit modal logic */}}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {equipmentData.equipment.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No equipment found. Add your first piece of equipment to get started.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Maintenance View */}
        {activeView === 'maintenance' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Maintenance Requests</h2>
              <button 
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => {/* Create maintenance request modal logic */}}
              >
                New Request
              </button>
            </div>
            
            <div className="space-y-4">
              {equipmentData.maintenanceRequests.map((request) => (
                <div key={request.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{request.equipment_name}</h3>
                      <p className="text-gray-400 text-sm">{request.title}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Reported by: {request.reported_by} ({request.reported_by_type}) on {request.date}
                      </p>
                      {request.assigned_to && (
                        <p className="text-gray-500 text-xs mt-1">Assigned to: {request.assigned_to}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{request.description}</p>
                  
                  {request.is_overdue && (
                    <div className="bg-red-900/50 border border-red-700 rounded px-3 py-2 mb-3">
                      <p className="text-red-200 text-sm">⚠️ This request is overdue</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {request.status === 'Pending' && (
                      <button 
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors"
                        onClick={() => handleUpdateMaintenanceRequest(request.id, { status: 'In Progress' })}
                      >
                        Start Work
                      </button>
                    )}
                    {request.status === 'In Progress' && (
                      <button 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors"
                        onClick={() => {/* Update modal logic */}}
                      >
                        Update
                      </button>
                    )}
                    <button 
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors"
                      onClick={() => handleUpdateMaintenanceRequest(request.id, { status: 'Completed' })}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {equipmentData.maintenanceRequests.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No maintenance requests at the moment
              </div>
            )}
          </div>
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Equipment Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  {equipmentData.reports.equipment_operational_rate || 0}%
                </div>
                <div className="text-gray-400 text-sm">Equipment Operational Rate</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {equipmentData.reports.active_maintenance_tasks || 0}
                </div>
                <div className="text-gray-400 text-sm">Active Maintenance Tasks</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  ${equipmentData.reports.monthly_maintenance_cost || 0}
                </div>
                <div className="text-gray-400 text-sm">Monthly Maintenance Cost</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-white mb-1">{equipmentData.reports.total_equipment || 0}</div>
                <div className="text-gray-400 text-xs">Total Equipment</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-green-400 mb-1">{equipmentData.reports.operational_equipment || 0}</div>
                <div className="text-gray-400 text-xs">Operational</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-yellow-400 mb-1">{equipmentData.reports.maintenance_equipment || 0}</div>
                <div className="text-gray-400 text-xs">Under Maintenance</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-red-400 mb-1">{equipmentData.reports.needs_maintenance || 0}</div>
                <div className="text-gray-400 text-xs">Needs Maintenance</div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-semibold transition-colors">
                Generate Equipment Report
              </button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}