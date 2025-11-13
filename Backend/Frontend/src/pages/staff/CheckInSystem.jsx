import { useEffect, useState } from "react";
import StaffLayout from "./StaffLayout";
import { useAuth } from "../../context/AuthContext"; // ✅ Import staff auth context
import axios from "axios"; // ✅ Use axios directly (configured in AuthContext)

export default function CheckInSystem() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // ✅ Use staff auth context
  const { staff, isAuthenticated, backendOnline, retryConnection } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated]);

  // ✅ ADDED: Ensure CSRF token is available using staff auth
  const ensureCsrfToken = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error('CSRF token error:', error);
    }
  };

  const fetchMembers = async () => {
    if (!isAuthenticated) {
      setMessage("❌ Please log in as staff to access check-in system");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Fetching attendance data...');
      
      // ✅ Use axios directly (already configured in AuthContext)
      const res = await axios.get("/api/staff/attendance");
      
      console.log('🔍 API Response:', res.data);
      
      // ✅ SAFE: Handle different response formats
      let membersData = [];
      
      if (Array.isArray(res.data)) {
        membersData = res.data;
      } else if (res.data && Array.isArray(res.data.attendance_logs)) {
        membersData = res.data.attendance_logs;
      } else if (res.data && Array.isArray(res.data.data)) {
        membersData = res.data.data;
      } else if (res.data && Array.isArray(res.data.members)) {
        membersData = res.data.members;
      } else if (res.data && res.data.success && Array.isArray(res.data.attendanceLogs)) {
        membersData = res.data.attendanceLogs;
      } else {
        console.warn('⚠️ Unexpected response format:', res.data);
        membersData = [];
      }
      
      console.log('✅ Processed members data:', membersData);
      setMembers(membersData);
    } catch (err) {
      console.error('❌ Error fetching members:', err);
      console.error('❌ Error details:', err.response?.data);
      
      if (err.response?.status === 401) {
        setMessage("❌ Staff authentication failed. Please log in again.");
      } else if (err.response?.status === 403) {
        setMessage("❌ Access denied. Staff authorization required.");
      } else if (err.code === 'ERR_NETWORK') {
        setMessage("❌ Network error. Please check backend connection.");
      } else {
        setMessage("Failed to fetch members: " + (err.response?.data?.message || err.message));
      }
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!isAuthenticated) {
      setMessage("❌ Please log in as staff first");
      return;
    }

    if (!userId.trim()) return setMessage("Please enter a user ID");
    
    setCheckingIn(true);
    setMessage("");
    try {
      console.log('🔄 Checking in user:', userId);
      
      // ✅ Ensure CSRF token is available first
      await ensureCsrfToken();
      
      const res = await axios.post("/api/staff/attendance/checkin", { 
        user_id: userId 
      });
      
      console.log('✅ Check-in response:', res.data);
      setMessage(res.data.message || "Check-in successful!");
      setUserId("");
      
      // Refresh the list after successful check-in
      setTimeout(() => {
        fetchMembers();
      }, 500);
      
    } catch (err) {
      console.error('❌ Check-in error:', err.response?.data || err.message);
      
      // Handle CSRF token issues
      if (err.response?.status === 419) {
        setMessage("❌ Session expired. Please try again.");
      } else if (err.response?.status === 401) {
        setMessage("❌ Staff authentication failed. Please log in again.");
      } else {
        setMessage(err.response?.data?.message || "Error checking in");
      }
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!isAuthenticated) {
      setMessage("❌ Please log in as staff first");
      return;
    }

    if (!selected) return setMessage("Please select a member to check out");
    
    setCheckingOut(true);
    setMessage("");
    try {
      console.log('🔄 Checking out attendance ID:', selected);
      
      // ✅ Ensure CSRF token is available first
      await ensureCsrfToken();
      
      const res = await axios.put(`/api/staff/attendance/checkout/${selected}`);
      
      console.log('✅ Check-out response:', res.data);
      setMessage(res.data.message || "Check-out successful!");
      setSelected(null);
      
      // Refresh the list after successful check-out
      setTimeout(() => {
        fetchMembers();
      }, 500);
      
    } catch (err) {
      console.error('❌ Check-out error:', err.response?.data || err.message);
      
      // Handle CSRF token issues
      if (err.response?.status === 419) {
        setMessage("❌ Session expired. Please try again.");
      } else if (err.response?.status === 401) {
        setMessage("❌ Staff authentication failed. Please log in again.");
      } else {
        setMessage(err.response?.data?.message || "Error checking out");
      }
    } finally {
      setCheckingOut(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ✅ SAFE: Always ensure we're working with arrays
  const checkedInMembers = Array.isArray(members) 
    ? members.filter(m => m.check_in && !m.check_out)
    : [];

  const todayMembers = Array.isArray(members) 
    ? members.filter(m => {
        if (!m.check_in) return false;
        try {
          const checkInDate = new Date(m.check_in).toDateString();
          const today = new Date().toDateString();
          return checkInDate === today;
        } catch (error) {
          console.warn('Invalid date format:', m.check_in);
          return false;
        }
      })
    : [];

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return "-";
    }
  };

  // ✅ ADDED: Show connection status
  if (!backendOnline) {
    return (
      <StaffLayout>
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">🔌</div>
            <h2 className="text-2xl font-bold text-white mb-2">Backend Offline</h2>
            <p className="text-gray-300 mb-4">Cannot connect to Laravel backend server.</p>
            <button 
              onClick={retryConnection}
              className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </StaffLayout>
    );
  }

  // ✅ ADDED: Show login required
  if (!isAuthenticated) {
    return (
      <StaffLayout>
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-yellow-400 text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-300">Please log in as staff to access the check-in system.</p>
          </div>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="w-full">
        {/* Header with Staff Info */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Check-in System</h1>
              <p className="text-gray-300">Manage member attendance and gym access</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">Logged in as</p>
              <p className="text-white font-semibold">{staff?.name}</p>
              <p className="text-gray-400 text-xs">{staff?.role}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Currently Checked In</p>
                <p className="text-3xl font-bold text-white mt-2">{checkedInMembers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Today's Visitors</p>
                <p className="text-3xl font-bold text-white mt-2">{todayMembers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-red-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Current Time</p>
                <p className="text-xl font-bold text-white mt-2">{getCurrentTime()}</p>
                <p className="text-sm text-gray-400">{getCurrentDate()}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Check-in/Check-out */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Check-in / Check-out</h2>
            <p className="text-gray-300 mb-6">Enter user ID to check-in or select a member to check-out</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter user ID (e.g., SYNC-0001)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-center text-lg font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Format: SYNC-XXXX (e.g., SYNC-0001)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleCheckIn}
                  disabled={checkingIn || !userId.trim()}
                  className="bg-green-600 hover:bg-green-500 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 border border-green-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkingIn ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {checkingIn ? "Checking In..." : "Check-in"}
                </button>

                <button 
                  onClick={handleCheckOut}
                  disabled={checkingOut || !selected}
                  className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 border border-red-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkingOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  {checkingOut ? "Checking Out..." : "Check-out"}
                </button>
              </div>

              {message && (
                <div className={`p-3 rounded-lg border ${
                  message.includes("success") || message.includes("checked in") || message.includes("checked out") 
                    ? "bg-green-500/10 border-green-500/30 text-green-400" 
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  <div className="flex items-center gap-2">
                    {message.includes("success") || message.includes("checked in") || message.includes("checked out") ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {message}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-750 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-400">{checkedInMembers.length}</p>
                  <p className="text-xs text-gray-400">Currently In Gym</p>
                </div>
                <div className="bg-gray-750 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-400">{todayMembers.length}</p>
                  <p className="text-xs text-gray-400">Visited Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Checked-in Members */}
          <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Attendance Logs</h3>
                  <p className="text-gray-400 text-sm">All attendance records</p>
                </div>
                <button 
                  onClick={fetchMembers}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-300">Loading attendance data...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-gray-750 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Check-in Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Check-out Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {Array.isArray(members) && members.length > 0 ? (
                      members.map((m) => (
                        <tr 
                          key={m.id}
                          onClick={() => setSelected(m.id)}
                          className={`cursor-pointer transition-colors ${
                            selected === m.id ? 'bg-red-500/10 border-l-4 border-l-red-500' : 'hover:bg-gray-750'
                          } ${!m.check_out ? 'bg-green-500/5' : ''}`}
                        >
                          <td className="px-4 py-3 text-white text-sm">{m.id}</td>
                          <td className="px-4 py-3 text-white font-mono text-sm">{m.user_code || m.user_id || "-"}</td>
                          <td className="px-4 py-3 text-white font-medium">{m.user_name || "-"}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">
                            {formatTime(m.check_in)}
                          </td>
                          <td className={`px-4 py-3 text-sm ${
                            m.check_out ? 'text-green-400' : 'text-red-400 font-semibold'
                          }`}>
                            {m.check_out ? formatTime(m.check_out) : "IN GYM"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Selection Info */}
            {selected && (
              <div className="px-6 py-3 border-t border-gray-700 bg-red-500/10">
                <p className="text-red-400 text-sm">
                  Selected: {Array.isArray(members) ? members.find(m => m.id === selected)?.user_name : 'N/A'} 
                  ({Array.isArray(members) ? members.find(m => m.id === selected)?.user_code : 'N/A'})
                  <button 
                    onClick={() => setSelected(null)}
                    className="ml-2 text-red-300 hover:text-red-100 text-xs underline"
                  >
                    Clear
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}