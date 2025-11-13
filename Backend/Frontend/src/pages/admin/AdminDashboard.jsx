import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    pendingRenewals: [],
    recentActivities: [],
    quickStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { staff: currentStaff, token } = useAuth();

  // Default data structure to prevent undefined errors
  const defaultDashboardData = {
    stats: {
      totalMembers: 0,
      monthlyRevenue: 0,
      todayCheckins: 0,
      activePlans: 0,
      pendingRenewals: 0,
      memberGrowth: '+0%',
      revenueGrowth: '+0%',
      checkinGrowth: '+0%',
      planGrowth: '+0',
      renewalChange: '-0'
    },
    pendingRenewals: [],
    recentActivities: [],
    quickStats: {
      monthlyGrowth: '+0%',
      equipmentUsage: '0%'
    }
  };

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Set default data even on error to prevent crashes
      setDashboardData(defaultDashboardData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStaff?.role === 'Admin' && token) {
      fetchDashboardData();
    }
  }, [currentStaff, token]);

  // Safe data access
  const data = dashboardData || defaultDashboardData;

  // Stats cards data - using safe data access
  const stats = [
    { 
      title: 'Total Active Members', 
      value: data.stats?.totalMembers?.toLocaleString() || '0', 
      icon: '👥',
      trend: data.stats?.memberGrowth || '+0%',
      color: 'green'
    },
    { 
      title: 'Revenue (This Month)', 
      value: `$${data.stats?.monthlyRevenue?.toLocaleString() || '0'}`, 
      icon: '💰',
      trend: data.stats?.revenueGrowth || '+0%',
      color: 'blue'
    },
    { 
      title: 'Check-ins Today', 
      value: data.stats?.todayCheckins?.toLocaleString() || '0', 
      icon: '🕒',
      trend: data.stats?.checkinGrowth || '+0%',
      color: 'purple'
    },
    { 
      title: 'Active Plans', 
      value: data.stats?.activePlans?.toLocaleString() || '0', 
      icon: '📋',
      trend: data.stats?.planGrowth || '+0',
      color: 'yellow'
    },
    { 
      title: 'Pending Renewals', 
      value: data.stats?.pendingRenewals?.toLocaleString() || '0', 
      icon: '🔄',
      trend: data.stats?.renewalChange || '-0',
      color: 'red'
    },
  ];

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    const statusColors = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Expiring Soon': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Expired': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Pending': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTrendColor = (color) => {
    const colors = {
      green: 'text-green-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400'
    };
    return colors[color] || 'text-gray-400';
  };

  const getPlanColor = (plan) => {
    if (!plan) return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    
    const planColors = {
      'Premium': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Standard': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'Basic': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
      'VIP': 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    };
    return planColors[plan] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  };

  // Quick action handlers
  const handleGenerateReport = () => {
    navigate('/admin/reports');
  };

  const handleManageStaff = () => {
    navigate('/admin/staffmanagement');
  };

  const handleViewAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleSystemSettings = () => {
    navigate('/admin/systemsettings');
  };

  const handleViewAllRenewals = () => {
    navigate('/admin/memberships');
  };

  const handleViewAllActivities = () => {
    navigate('/admin/activities');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData.stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300">{error}</span>
              </div>
              <button 
                onClick={fetchDashboardData}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard Overview</h1>
          <p className="text-gray-300">A comprehensive view of key gym statistics and performance metrics</p>
          <div className="flex items-center space-x-3 mt-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Admin Control
            </span>
            <span className="text-gray-400 text-sm">
              Welcome back, {currentStaff?.name || 'Admin'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl border border-red-600/50 p-6 hover:border-red-600/70 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{stat.icon}</div>
                <span className={`text-sm font-medium ${getTrendColor(stat.color)}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-gray-300 text-sm mb-1">{stat.title}</p>
                <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Renewals Table */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Pending Renewals / Expiring Memberships</h2>
                <p className="text-gray-400 text-sm">Memberships requiring attention</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">MEMBER NAME</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">MEMBERSHIP PLAN</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">EXPIRY DATE</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data.pendingRenewals && data.pendingRenewals.length > 0 ? (
                      data.pendingRenewals.map((member, i) => (
                        <tr key={i} className="hover:bg-gray-750 transition-colors">
                          <td className="px-4 py-3 text-white font-medium">{member.name || 'Unknown Member'}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(member.plan)}`}>
                              {member.plan || 'No Plan'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {member.expiry_date ? new Date(member.expiry_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                              {member.status || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                          No pending renewals at the moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-700">
                <button 
                  onClick={handleViewAllRenewals}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                >
                  View All Renewals →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Recent Activities</h2>
              <p className="text-gray-400 text-sm">Latest gym operations</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {data.recentActivities && data.recentActivities.length > 0 ? (
                  data.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-750 transition-colors duration-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{activity.action || 'Unknown Action'}</p>
                        <p className="text-gray-400 text-xs">{activity.user || 'Unknown User'}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time || 'Recently'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No recent activities
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-700">
              <button 
                onClick={handleViewAllActivities}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
              >
                View All Activities →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  {data.quickStats?.monthlyGrowth || '+0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Equipment Usage</p>
                <p className="text-2xl font-bold text-blue-400 mt-2">
                  {data.quickStats?.equipmentUsage || '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={handleGenerateReport}
            className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Generate Report</span>
          </button>
          
          <button 
            onClick={handleManageStaff}
            className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Manage Staff</span>
          </button>
          
          <button 
            onClick={handleViewAnalytics}
            className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">View Analytics</span>
          </button>
          
          <button 
            onClick={handleSystemSettings}
            className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;