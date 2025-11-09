import axios from "axios";
import { useEffect, useState } from "react";
import StaffLayout from "./StaffLayout";

export default function CheckInSystem() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/attendance");
      setMembers(res.data);
    } catch (err) {
      setMessage("Failed to fetch members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!userId.trim()) return setMessage("Please enter a user ID");
    
    setCheckingIn(true);
    setMessage("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/attendance/checkin", { user_id: userId });
      setMessage(res.data.message);
      setUserId("");
      fetchMembers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error checking in");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selected) return setMessage("Please select a member to check out");
    
    setCheckingOut(true);
    setMessage("");
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/attendance/checkout/${selected}`);
      setMessage(res.data.message);
      setSelected(null);
      fetchMembers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error checking out");
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

  const checkedInMembers = members.filter(m => m.check_in && !m.check_out);
  const todayMembers = members.filter(m => {
    if (!m.check_in) return false;
    const checkInDate = new Date(m.check_in).toDateString();
    const today = new Date().toDateString();
    return checkInDate === today;
  });

  return (
    <StaffLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Check-in System</h1>
          <p className="text-gray-300">Manage member attendance and gym access</p>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                <input
                  type="text"
                  placeholder="Enter user ID (e.g., FTS001)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-center text-lg"
                />
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
                  {message}
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
              <h3 className="text-xl font-bold text-white">Checked-in Members</h3>
              <p className="text-gray-400 text-sm">Members currently in the facility</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-300">Loading attendance data...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Check-in Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Check-out Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {members.length > 0 ? (
                      members.map((m) => (
                        <tr 
                          key={m.id}
                          onClick={() => setSelected(m.id)}
                          className={`cursor-pointer transition-colors ${
                            selected === m.id ? 'bg-red-500/10 border-l-4 border-l-red-500' : 'hover:bg-gray-750'
                          } ${!m.check_out ? 'bg-green-500/5' : ''}`}
                        >
                          <td className="px-4 py-3 text-white text-sm">{m.id}</td>
                          <td className="px-4 py-3 text-white font-mono">{m.user_code || m.user_id}</td>
                          <td className="px-4 py-3 text-white font-medium">{m.user_name || "-"}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {m.check_in ? new Date(m.check_in).toLocaleTimeString() : "-"}
                          </td>
                          <td className={`px-4 py-3 ${
                            m.check_out ? 'text-green-400' : 'text-red-400 font-semibold'
                          }`}>
                            {m.check_out ? new Date(m.check_out).toLocaleTimeString() : "IN GYM"}
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
                  Selected: {members.find(m => m.id === selected)?.user_name} 
                  ({members.find(m => m.id === selected)?.user_code})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}