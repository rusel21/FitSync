import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await axios.post('http://localhost:8000/api/admin/analytics/export', 
        { type },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (response.data.success) {
        alert(`Report generated successfully!`);
        // In a real implementation, you would trigger download
        // window.location.href = response.data.download_url;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report');
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Analytics</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    revenuePerMonth,
    memberStats,
    attendanceTrends,
    popularPlans
  } = analyticsData;

  // Helper function to generate SVG path for revenue chart
  const generateRevenuePath = (data) => {
    if (!data || !data.length) return 'M0,60 L300,60';
    
    const maxRevenue = Math.max(...data.map(d => d.revenue || 0));
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = maxRevenue > 0 ? 80 - ((item.revenue || 0) / maxRevenue * 60) : 60;
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  };

  // Helper function to generate bar heights for attendance
  const getAttendanceHeight = (checkins, maxCheckins) => {
    if (maxCheckins === 0) return 20;
    return Math.max(10, (checkins / maxCheckins) * 80);
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports Dashboard</h1>
        <p className="text-gray-300">Comprehensive insights into gym performance and member behavior</p>
        {analyticsData.note && (
          <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-400 text-sm">{analyticsData.note}</p>
          </div>
        )}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue per Month */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Revenue per Month</h3>
              <h1 className="text-3xl font-bold text-green-400 mb-2">
                ${(revenuePerMonth?.total || 0).toLocaleString()}
              </h1>
              <p className="text-gray-400">
                Last 12 Months <span className={`${revenuePerMonth?.growth >= 0 ? 'text-green-400' : 'text-red-400'} ml-2`}>
                  {revenuePerMonth?.growth >= 0 ? '↑' : '↓'}{Math.abs(revenuePerMonth?.growth || 0)}%
                </span>
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
                d={generateRevenuePath(revenuePerMonth?.data || [])}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              />
              <path
                d={generateRevenuePath(revenuePerMonth?.data || [])}
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
              <h1 className="text-3xl font-bold text-blue-400 mb-2">{memberStats?.activePercentage || 0}%</h1>
              <p className="text-gray-400">
                Current <span className={`${memberStats?.growth >= 0 ? 'text-green-400' : 'text-red-400'} ml-2`}>
                  {memberStats?.growth >= 0 ? '↑' : '↓'}{Math.abs(memberStats?.growth || 0)}%
                </span>
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
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${memberStats?.activePercentage || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-300">Active ({memberStats?.activePercentage || 0}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-gray-300">Inactive ({memberStats?.inactivePercentage || 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Trends */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Attendance Trends</h3>
              <h1 className="text-3xl font-bold text-purple-400 mb-2">{attendanceTrends?.average || 0}</h1>
              <p className="text-gray-400">
                Daily Average <span className={`${attendanceTrends?.trend >= 0 ? 'text-green-400' : 'text-red-400'} ml-2`}>
                  {attendanceTrends?.trend >= 0 ? '↑' : '↓'}{Math.abs(attendanceTrends?.trend || 0)}%
                </span>
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
              {attendanceTrends?.data?.map((day, index) => {
                const maxCheckins = Math.max(...attendanceTrends.data.map(d => d.checkins || 0));
                const height = getAttendanceHeight(day.checkins || 0, maxCheckins);
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-purple-500 to-purple-600 rounded-t w-6 transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-gray-400 text-xs mt-1">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Membership Plan */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Popular Membership Plan</h3>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">{popularPlans?.mostPopular || 'No Data'}</h2>
              <p className="text-gray-400">
                Most Popular <span className={`${popularPlans?.growth >= 0 ? 'text-green-400' : 'text-red-400'} ml-2`}>
                  {popularPlans?.growth >= 0 ? '↑' : '↓'}{Math.abs(popularPlans?.growth || 0)}%
                </span>
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {popularPlans?.plans?.map((plan, index) => {
              const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-gray-500'];
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{plan.name}</span>
                    <span className="text-gray-400">{plan.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${colors[index] || 'bg-gray-500'}`}
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {(!popularPlans?.plans || popularPlans.plans.length === 0) && (
              <div className="text-center text-gray-400 py-4">
                No membership plan data available
              </div>
            )}
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
            <button 
              onClick={() => handleExport('pdf')}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-red-500 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF Report
            </button>
            <button 
              onClick={() => handleExport('excel')}
              className="border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Excel Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;