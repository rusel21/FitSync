

const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Total Active Members', 
      value: '250', 
      icon: '👥',
      trend: '+12%',
      color: 'green'
    },
    { 
      title: 'Revenue (This Month)', 
      value: '$15,000', 
      icon: '💰',
      trend: '+8%',
      color: 'blue'
    },
    { 
      title: 'Check-ins Today', 
      value: '75', 
      icon: '🕒',
      trend: '+5%',
      color: 'purple'
    },
    { 
      title: 'Active Plans', 
      value: '5', 
      icon: '📋',
      trend: '+2',
      color: 'yellow'
    },
    { 
      title: 'Pending Renewals', 
      value: '12', 
      icon: '🔄',
      trend: '-3',
      color: 'red'
    },
  ];

  const members = [
    { name: 'Sophia Clark', plan: 'Premium', date: '2024-07-15', status: 'Expiring Soon' },
    { name: 'Ethan Carter', plan: 'Standard', date: '2024-07-20', status: 'Active' },
    { name: 'Olivia Bennett', plan: 'Basic', date: '2024-07-25', status: 'Expiring Soon' },
    { name: 'Liam Foster', plan: 'Premium', date: '2024-08-01', status: 'Active' },
    { name: 'Ava Hughes', plan: 'Standard', date: '2024-08-05', status: 'Active' },
  ];

  const recentActivities = [
    { action: 'New member registration', user: 'Emma Wilson', time: '2 hours ago' },
    { action: 'Membership renewal', user: 'Noah Martinez', time: '4 hours ago' },
    { action: 'Payment received', user: 'Isabella Lee', time: '6 hours ago' },
    { action: 'Plan upgrade', user: 'James Anderson', time: '1 day ago' },
  ];

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
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

  return (
    //<AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard Overview</h1>
          <p className="text-gray-300">A comprehensive view of key gym statistics and performance metrics</p>
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
                    {members.map((member, i) => (
                      <tr key={i} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">{member.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.plan === 'Premium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            member.plan === 'Standard' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {member.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{member.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-700">
                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
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
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-750 transition-colors duration-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.user}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-700">
              <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
                View All Activities →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-400 mt-2">+15%</p>
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
                <p className="text-gray-300 text-sm">Member Satisfaction</p>
                <p className="text-2xl font-bold text-yellow-400 mt-2">94%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Equipment Usage</p>
                <p className="text-2xl font-bold text-blue-400 mt-2">78%</p>
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
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Generate Report</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Manage Staff</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">View Analytics</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">System Settings</span>
          </button>
        </div>
      </div>
    //</AdminLayout>
  );
};

export default AdminDashboard;