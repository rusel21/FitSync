import AdminLayout from "./AdminLayout";

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports Dashboard</h1>
          <p className="text-gray-300">Comprehensive insights into gym performance and member behavior</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue per Month */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Revenue per Month</h3>
                <h1 className="text-3xl font-bold text-green-400 mb-2">$12,500</h1>
                <p className="text-gray-400">
                  Last 12 Months <span className="text-green-400 ml-2">↑15%</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <svg width="100%" height="80" viewBox="0 0 300 80">
                <path
                  d="M0,60 C30,40 60,50 90,20 C120,40 150,10 180,30 C210,50 240,15 270,40 C300,65 300,20 300,20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                <path
                  d="M0,60 C30,40 60,50 90,20 C120,40 150,10 180,30 C210,50 240,15 270,40 C300,65 300,20 300,20"
                  fill="url(#gradient)"
                  stroke="none"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Active vs Inactive Members */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Active vs Inactive Members</h3>
                <h1 className="text-3xl font-bold text-blue-400 mb-2">85%</h1>
                <p className="text-gray-400">
                  Current <span className="text-red-400 ml-2">↓5%</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Active (85%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Inactive (15%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Attendance Trends</h3>
                <h1 className="text-3xl font-bold text-purple-400 mb-2">72%</h1>
                <p className="text-gray-400">
                  Last 30 Days <span className="text-green-400 ml-2">↑10%</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-end justify-between h-20 mb-3">
                {[40, 60, 55, 50, 80, 45, 35].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-purple-500 to-purple-600 rounded-t w-6 transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-gray-400 text-xs mt-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Membership Plan */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Popular Membership Plan</h3>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Premium</h2>
                <p className="text-gray-400">
                  45% of members <span className="text-green-400 ml-2">↑8%</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { name: 'Premium', percentage: 45, color: 'bg-yellow-500' },
                { name: 'Basic', percentage: 30, color: 'bg-blue-500' },
                { name: 'VIP', percentage: 15, color: 'bg-purple-500' },
                { name: 'Trial', percentage: 10, color: 'bg-gray-500' }
              ].map((plan, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{plan.name}</span>
                    <span className="text-gray-400">{plan.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${plan.color}`}
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Peak Hours */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Peak Hours</h3>
            <div className="space-y-3">
              {[
                { time: '6:00 AM - 8:00 AM', percentage: 75 },
                { time: '12:00 PM - 2:00 PM', percentage: 45 },
                { time: '5:00 PM - 8:00 PM', percentage: 90 },
                { time: '8:00 PM - 10:00 PM', percentage: 60 }
              ].map((peak, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{peak.time}</span>
                    <span className="text-gray-400">{peak.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                      style={{ width: `${peak.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Retention */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Member Retention</h3>
            <div className="text-center">
              <div className="relative inline-block">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="78, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">78%</span>
                </div>
              </div>
              <p className="text-gray-400 mt-2">6-Month Retention Rate</p>
            </div>
          </div>

          {/* Equipment Usage */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Equipment Usage</h3>
            <div className="space-y-3">
              {[
                { equipment: 'Treadmills', usage: 85 },
                { equipment: 'Weight Stations', usage: 70 },
                { equipment: 'Yoga Studio', usage: 60 },
                { equipment: 'Pool', usage: 45 }
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.equipment}</span>
                    <span className="text-gray-400">{item.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                      style={{ width: `${item.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Export Reports</h3>
              <p className="text-gray-400">Download comprehensive analytics data</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-red-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF Report
              </button>
              <button className="border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Excel Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;