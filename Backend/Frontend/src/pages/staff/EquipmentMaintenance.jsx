import { useState } from 'react';
import StaffLayout from './StaffLayout';

export default function EquipmentManagement() {
  const [activeView, setActiveView] = useState('facilities');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const facilities = [
    { 
      id: 1, 
      name: 'Main Gym Floor', 
      type: 'Weight Training', 
      capacity: 50, 
      currentUsage: 35, 
      status: 'Available',
      maintenance: 'No issues'
    },
    { 
      id: 2, 
      name: 'Cardio Zone', 
      type: 'Cardio Equipment', 
      capacity: 30, 
      currentUsage: 28, 
      status: 'Available',
      maintenance: 'No issues'
    },
    { 
      id: 3, 
      name: 'Yoga Studio', 
      type: 'Group Exercise', 
      capacity: 25, 
      currentUsage: 0, 
      status: 'Available',
      maintenance: 'No issues'
    },
    { 
      id: 4, 
      name: 'Pool Area', 
      type: 'Aquatic', 
      capacity: 40, 
      currentUsage: 15, 
      status: 'Maintenance',
      maintenance: 'Weekly cleaning'
    },
  ];

  const equipment = [
    { 
      id: 1, 
      name: 'Treadmill T-500', 
      type: 'Cardio', 
      location: 'Cardio Zone', 
      status: 'Operational',
      lastMaintenance: '2024-12-10',
      nextMaintenance: '2025-01-10'
    },
    { 
      id: 2, 
      name: 'Bench Press Rack', 
      type: 'Strength', 
      location: 'Main Gym Floor', 
      status: 'Operational',
      lastMaintenance: '2024-12-15',
      nextMaintenance: '2025-01-15'
    },
    { 
      id: 3, 
      name: 'Stationary Bike B-200', 
      type: 'Cardio', 
      location: 'Cardio Zone', 
      status: 'Maintenance',
      lastMaintenance: '2024-12-05',
      nextMaintenance: '2024-12-20'
    },
    { 
      id: 4, 
      name: 'Yoga Mats Set', 
      type: 'Accessories', 
      location: 'Yoga Studio', 
      status: 'Operational',
      lastMaintenance: '2024-12-18',
      nextMaintenance: '2025-01-18'
    },
  ];

  const maintenanceRequests = [
    { 
      id: 1, 
      equipment: 'Treadmill T-500', 
      issue: 'Belt slipping', 
      reportedBy: 'John Member', 
      date: '2024-12-19', 
      priority: 'High',
      status: 'Pending'
    },
    { 
      id: 2, 
      equipment: 'Pool Filter', 
      issue: 'Reduced water flow', 
      reportedBy: 'Staff - Mike', 
      date: '2024-12-18', 
      priority: 'Medium',
      status: 'In Progress'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
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
        return 'bg-red-900 text-red-200';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-200';
      case 'Low':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Facility Management</h1>
          <p className="text-gray-400">Manage gym facilities, equipment maintenance, and resource allocation</p>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-4 mb-6">
          {['facilities', 'equipment', 'maintenance', 'reports'].map((view) => (
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

        {/* Facilities View */}
        {activeView === 'facilities' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Facility Overview</h2>
              <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors">
                Add Facility
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {facilities.map((facility) => (
                <div key={facility.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{facility.name}</h3>
                      <p className="text-gray-400 text-sm">{facility.type}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                      {facility.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Capacity:</span>
                      <span className="text-white">{facility.currentUsage}/{facility.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(facility.currentUsage / facility.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{facility.maintenance}</span>
                    <div className="flex space-x-2">
                      <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
                        Manage
                      </button>
                      <button className="text-gray-400 hover:text-white text-sm transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment View */}
        {activeView === 'equipment' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Equipment Inventory</h2>
              <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors">
                Add Equipment
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Equipment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Next Maintenance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{item.type}</td>
                      <td className="px-6 py-4 text-gray-400">{item.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{item.nextMaintenance}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
                            Maintain
                          </button>
                          <button className="text-gray-400 hover:text-white text-sm transition-colors">
                            Edit
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

        {/* Maintenance View */}
        {activeView === 'maintenance' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Maintenance Requests</h2>
            
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{request.equipment}</h3>
                      <p className="text-gray-400 text-sm">{request.issue}</p>
                      <p className="text-gray-500 text-xs mt-1">Reported by: {request.reportedBy} on {request.date}</p>
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
                  <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors">
                      Start Work
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors">
                      Update
                    </button>
                    <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {maintenanceRequests.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No maintenance requests at the moment
              </div>
            )}
          </div>
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Facility Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
                <div className="text-2xl font-bold text-red-400 mb-2">92%</div>
                <div className="text-gray-400 text-sm">Equipment Operational</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
                <div className="text-2xl font-bold text-green-400 mb-2">15</div>
                <div className="text-gray-400 text-sm">Active Maintenance Tasks</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
                <div className="text-2xl font-bold text-blue-400 mb-2">78%</div>
                <div className="text-gray-400 text-sm">Facility Utilization</div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-semibold transition-colors">
                Generate Facility Report
              </button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}