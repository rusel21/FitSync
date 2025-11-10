import { useState, useEffect } from "react";
import UserLayout from "./UserLayout";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewMembership = async () => {
    setRenewing(true);
    try {
      const response = await api.post('/dashboard/renew-membership');
      alert(response.data.message);
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error renewing membership:', error);
      alert(error.response?.data?.message || 'Failed to renew membership');
    } finally {
      setRenewing(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/user/myprofile");
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  const getActivityIcon = (activity) => {
    const baseClasses = "w-5 h-5";
    
    switch (activity.icon) {
      case 'check-in':
        return (
          <svg className={`${baseClasses} text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'check-out':
        return (
          <svg className={`${baseClasses} text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case 'membership':
        return (
          <svg className={`${baseClasses} text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'payment':
        return (
          <svg className={`${baseClasses} text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      default:
        return (
          <svg className={`${baseClasses} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium border";
    
    switch (priority) {
      case 'urgent':
        return <span className={`${baseClasses} bg-red-600 text-white border-red-500`}>Urgent</span>;
      case 'high':
        return <span className={`${baseClasses} bg-orange-600 text-white border-orange-500`}>Important</span>;
      case 'normal':
        return <span className={`${baseClasses} bg-green-600 text-white border-green-500`}>Today</span>;
      default:
        return <span className={`${baseClasses} bg-gray-600 text-white border-gray-500`}>Info</span>;
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const { membership, attendance, workout_stats, recent_activities, quick_stats } = dashboardData;

  return (
    <UserLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Membership Dashboard</h2>
          <p className="text-gray-300">Welcome back! Here's your fitness overview.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Membership Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-red-600/50 hover:border-red-600/70 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">Membership Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                membership?.is_active 
                  ? 'bg-green-500 text-white border-green-400' 
                  : 'bg-red-500 text-white border-red-400'
              }`}>
                {membership?.status || 'Inactive'}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white mb-1">
                  {membership?.type || 'No Membership'}
                </h4>
                <p className="text-gray-300">
                  {membership ? `Expires on ${new Date(membership.end_date).toLocaleDateString()}` : 'Get started with a membership'}
                </p>
              </div>
              
              {/* Progress Bar */}
              {membership && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{width: `${membership.progress_percentage}%`}}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-300">
                    {membership.progress_percentage}% of period used ({membership.progress_days_used}/{membership.progress_total_days} days)
                  </p>
                </div>
              )}

              {membership?.is_active && (
                <button 
                  onClick={handleRenewMembership}
                  disabled={renewing}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 border border-red-500 disabled:cursor-not-allowed"
                >
                  {renewing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Renewing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Renew Membership
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-red-600/50 hover:border-red-600/70 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Attendance</h3>
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{attendance?.checkins_this_month || 0}</div>
              <p className="text-gray-300 mb-2">Check-ins this month</p>
              <div className={`text-sm font-medium flex items-center justify-center gap-1 ${
                attendance?.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {getTrendIcon(attendance?.trend)}
                {Math.abs(attendance?.percentage_change || 0)}% from last month
              </div>
            </div>
          </div>

          {/* Workout Stats Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-red-600/50 hover:border-red-600/70 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Workout Stats</h3>
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30 group-hover:border-red-500/50 transition-colors">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{workout_stats?.workouts_completed || 0}</div>
                  <div className="text-gray-300 text-sm">Workouts Completed</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30 group-hover:border-red-500/50 transition-colors">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{workout_stats?.total_time_hours || 0}h</div>
                  <div className="text-gray-300 text-sm">Total Time</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30 group-hover:border-red-500/50 transition-colors">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">+{workout_stats?.progress_percentage || 0}%</div>
                  <div className="text-gray-300 text-sm">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-red-600/50 hover:border-red-600/70 transition-colors duration-300 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {recent_activities?.map((activity, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 hover:border-${activity.color}-500/50 transition-colors duration-300 ${
                  activity.priority === 'urgent' 
                    ? 'bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30' 
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-${activity.color}-500/20 p-2 rounded-lg border border-${activity.color}-500/30`}>
                    {getActivityIcon(activity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{activity.title}</h4>
                      {getPriorityBadge(activity.priority)}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{activity.message}</p>
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {(!recent_activities || recent_activities.length === 0) && (
              <div className="col-span-2 text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-300">No recent activities found</p>
                <p className="text-gray-400 text-sm">Your activities will appear here</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleProfileClick}
            className="bg-gray-800 hover:bg-gray-750 border border-gray-600 hover:border-red-500/50 rounded-lg p-4 text-center transition-colors duration-300 group cursor-pointer"
          >
            <svg className="w-6 h-6 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">My Profile</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 hover:border-red-500/50 rounded-lg p-4 text-center transition-colors duration-300 group">
            <svg className="w-6 h-6 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Settings</span>
          </button>
        </section>
      </div>
    </UserLayout>
  );
}