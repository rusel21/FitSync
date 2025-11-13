import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AttendanceLogs = () => {
    const [search, setSearch] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [stats, setStats] = useState([
        { label: 'Total Check-ins', value: '0', color: 'blue' },
        { label: 'Currently Active', value: '0', color: 'green' },
        { label: 'Avg. Duration', value: '0h', color: 'purple' },
        { label: 'Peak Hour', value: 'N/A', color: 'red' }
    ]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // ✅ FIXED: Use absolute URL for API calls
    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    // Fetch admin attendance data
    const fetchAttendanceData = async () => {
        setLoading(true);
        try {
            console.log('📍 Fetching admin attendance data...');
            
            const response = await axios.get(`${API_BASE_URL}/admin/attendance`, {
                params: {
                    date: date,
                    status: filterStatus === 'all' ? '' : filterStatus,
                    search: search
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            console.log('✅ Admin attendance data:', response.data);
            
            if (response.data.success) {
                setAttendanceLogs(response.data.attendanceLogs || []);
                if (response.data.stats) {
                    setStats(response.data.stats);
                }
            } else {
                console.error('API error:', response.data.message);
                setAttendanceLogs([]);
            }
        } catch (error) {
            console.error('❌ Error fetching attendance data:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
                
                if (error.response.status === 403) {
                    alert('Access denied. Admin privileges required.');
                } else if (error.response.status === 404) {
                    alert('Attendance endpoint not found. Please check the API route.');
                } else if (error.response.status === 500) {
                    alert('Server error. Please try again later.');
                }
            } else if (error.code === 'ERR_NETWORK') {
                alert('Network error. Please make sure Laravel backend is running on http://127.0.0.1:8000');
            }
            setAttendanceLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAttendanceData();
        }
    }, [date, filterStatus, search, token]);

    const handleExport = async () => {
        try {
            console.log('📍 Exporting attendance report...');
            
            const response = await axios.post(`${API_BASE_URL}/admin/attendance/export`, {
                start_date: date,
                end_date: date,
                format: 'csv'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            console.log('✅ Export response:', response.data);
            
            if (response.data.success) {
                if (response.data.data) {
                    downloadCSV(response.data.data, `attendance-report-${date}.csv`);
                    alert('Report exported successfully!');
                } else {
                    alert('Export completed but no data received');
                }
            } else {
                alert('Export failed: ' + response.data.message);
            }
        } catch (error) {
            console.error('❌ Error exporting report:', error);
            alert('Export failed: ' + (error.response?.data?.message || error.message));
        }
    };

    // Helper function to download CSV
    const downloadCSV = (data, filename) => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        try {
            const headers = Object.keys(data[0]).join(',');
            const csvData = data.map(row => 
                Object.values(row).map(value => 
                    `"${String(value || '').replace(/"/g, '""')}"`
                ).join(',')
            ).join('\n');
            
            const csv = `${headers}\n${csvData}`;
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating CSV:', error);
            alert('Error generating export file');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: 
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'In Gym';
            case 'completed':
                return 'Completed';
            default: 
                return 'Unknown';
        }
    };

    // Format check-out display
    const formatCheckOut = (checkOut) => {
        return checkOut === '-' ? 'Not checked out' : checkOut;
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Attendance Logs</h1>
                <p className="text-gray-300">View and manage daily attendance records</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${
                                stat.color === 'blue' ? 'bg-blue-500/20' :
                                stat.color === 'green' ? 'bg-green-500/20' :
                                stat.color === 'purple' ? 'bg-purple-500/20' :
                                'bg-red-500/20'
                            } rounded-full flex items-center justify-center`}>
                                <svg className={`w-6 h-6 ${
                                    stat.color === 'blue' ? 'text-blue-400' :
                                    stat.color === 'green' ? 'text-green-400' :
                                    stat.color === 'purple' ? 'text-purple-400' :
                                    'text-red-400'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Search Members</label>
                        <input 
                            type="text" 
                            placeholder="Search by member name..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Date</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Currently Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Attendance Records</h2>
                        <p className="text-gray-400 text-sm">
                            {loading ? 'Loading...' : `${attendanceLogs.length} records found`}
                        </p>
                    </div>
                    <button 
                        onClick={handleExport}
                        disabled={attendanceLogs.length === 0 || loading}
                        className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-red-500 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-750">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Member Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Check-In Time</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Check-Out Time</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Duration</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-3"></div>
                                            Loading attendance data...
                                        </div>
                                    </td>
                                </tr>
                            ) : attendanceLogs.length > 0 ? (
                                attendanceLogs.map((log, index) => (
                                    <tr key={index} className="hover:bg-gray-750 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">
                                            {log.name || 'Unknown Member'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">
                                            {log.checkIn || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">
                                            {formatCheckOut(log.checkOut)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">
                                            {log.duration || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}>
                                                {getStatusText(log.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                                        No attendance records found for the selected criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="text-gray-400 text-sm">
                        Showing {attendanceLogs.length} records for {date}
                    </div>
                    <div className="text-gray-400 text-sm">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                    onClick={() => fetchAttendanceData()} 
                    disabled={loading}
                    className="bg-gray-800 hover:bg-gray-750 disabled:bg-gray-700 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group"
                >
                    <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-white text-sm group-hover:text-gray-200 transition-colors">
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </span>
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
                    <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Report Settings</span>
                </button>
            </div>
        </div>
    );
};

export default AttendanceLogs;