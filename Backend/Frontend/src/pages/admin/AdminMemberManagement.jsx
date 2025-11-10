import { useState } from 'react';
//import AdminLayout from './AdminLayout';

export default function AdminMemberManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Mock data for demonstration
  const members = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+1234567890', 
      membership: 'Premium',
      joinDate: '2024-01-15',
      status: 'Active',
      lastCheckin: '2024-12-19',
      paymentStatus: 'Paid',
      totalVisits: 45
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '+1234567891', 
      membership: 'Basic',
      joinDate: '2024-02-01',
      status: 'Active',
      lastCheckin: '2024-12-18',
      paymentStatus: 'Overdue',
      totalVisits: 28
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      phone: '+1234567892', 
      membership: 'Premium',
      joinDate: '2024-01-20',
      status: 'Inactive',
      lastCheckin: '2024-12-10',
      paymentStatus: 'Paid',
      totalVisits: 12
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah@example.com', 
      phone: '+1234567893', 
      membership: 'Standard',
      joinDate: '2024-03-05',
      status: 'Active',
      lastCheckin: '2024-12-19',
      paymentStatus: 'Paid',
      totalVisits: 67
    },
  ];

  const analytics = {
    totalMembers: 1247,
    activeMembers: 892,
    newThisMonth: 45,
    avgVisitsPerWeek: 3.2,
    membershipDistribution: {
      premium: 356,
      standard: 512,
      basic: 379
    },
    retentionRate: '78%'
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membership.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportMemberData = () => {
    // Implementation for exporting member data
    const dataToExport = selectedMembers.length > 0 ? 
      members.filter(m => selectedMembers.includes(m.id)) : 
      members;
    
    alert(`Exporting ${dataToExport.length} member records`);
  };

  const generateAnalyticsReport = () => {
    alert(`Generating analytics report for ${dateRange.start || 'all time'} to ${dateRange.end || 'present'}`);
  };

  return (
   // <AdminLayout>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Member Overview</h1>
            <p className="text-gray-400">View member analytics and insights - Administrative Access Only</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              View Only
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-white">{analytics.totalMembers}</p>
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
              <p className="text-gray-400 text-sm">Active Members</p>
              <p className="text-2xl font-bold text-green-400">{analytics.activeMembers}</p>
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
              <p className="text-gray-400 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-yellow-400">{analytics.newThisMonth}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Retention Rate</p>
              <p className="text-2xl font-bold text-purple-400">{analytics.retentionRate}</p>
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
          {['overview', 'analytics', 'reports'].map((tab) => (
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search members by name, email, or membership..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={exportMemberData}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Data</span>
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers(members.map(m => m.id));
                            } else {
                              setSelectedMembers([]);
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Membership
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMembers([...selectedMembers, member.id]);
                              } else {
                                setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                              }
                            }}
                            className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.membership === 'Premium' 
                              ? 'bg-purple-900 text-purple-200' 
                              : member.membership === 'Standard'
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-gray-700 text-gray-200'
                          }`}>
                            {member.membership}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.status === 'Active' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-red-900 text-red-200'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {member.lastCheckin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.paymentStatus === 'Paid' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-red-900 text-red-200'
                          }`}>
                            {member.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <button className="text-red-400 hover:text-red-300 mr-3 transition-colors">
                            View Details
                          </button>
                          <button 
                            className="text-gray-500 hover:text-gray-400 cursor-not-allowed transition-colors"
                            title="Staff handles member management"
                            disabled
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View Only Notice */}
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-red-300 font-medium">View Only Access</p>
                    <p className="text-red-400 text-sm">
                      Staff members handle all member management operations. This view is for monitoring and analytics purposes only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Membership Distribution */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Membership Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.membershipDistribution).map(([plan, count]) => (
                      <div key={plan} className="flex justify-between items-center">
                        <span className="text-gray-400 capitalize">{plan}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(count / analytics.totalMembers) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-white font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Average Weekly Visits</span>
                        <span className="text-white font-medium">{analytics.avgVisitsPerWeek}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(analytics.avgVisitsPerWeek / 7) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Member Retention</span>
                        <span className="text-white font-medium">{analytics.retentionRate}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: analytics.retentionRate }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Range Selector for Reports */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Generate Analytics Report</h3>
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">End Date</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={generateAnalyticsReport}
                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Report Cards */}
                {[
                  { title: 'Monthly Membership Report', description: 'Comprehensive membership analytics', type: 'monthly' },
                  { title: 'Attendance Trends', description: 'Member visit patterns and peak hours', type: 'attendance' },
                  { title: 'Revenue Analysis', description: 'Payment and revenue breakdown', type: 'revenue' },
                  { title: 'Member Retention', description: 'Retention rates and churn analysis', type: 'retention' },
                  { title: 'Class Utilization', description: 'Class attendance and popularity', type: 'classes' },
                  { title: 'Equipment Usage', description: 'Equipment utilization metrics', type: 'equipment' },
                ].map((report, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-red-600 transition-colors">
                    <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{report.description}</p>
                    <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm transition-colors">
                      Generate Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    //</AdminLayout>
  );
}