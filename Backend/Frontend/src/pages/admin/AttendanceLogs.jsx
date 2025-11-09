import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const AttendanceLogs = () => {
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("2024-07-29");
    const [filterStatus, setFilterStatus] = useState("all");

    const members = [
        {
            name: "Rex Felicio",
            checkIn: "9:00 AM",
            checkOut: "5:00 PM",
            status: "completed",
            duration: "8 hours"
        },
        {
            name: "Darell Daigan",
            checkIn: "10:00 AM",
            checkOut: "6:00 PM",
            status: "completed", 
            duration: "8 hours"
        },
        {
            name: "Marc Uy",
            checkIn: "11:00 AM",
            checkOut: "4:00 PM",
            status: "completed",
            duration: "5 hours"
        },
        {
            name: "Sarah Johnson",
            checkIn: "7:00 AM",
            checkOut: "-",
            status: "active",
            duration: "Currently in gym"
        },
        {
            name: "Mike Chen",
            checkIn: "8:30 AM",
            checkOut: "3:45 PM",
            status: "completed",
            duration: "7 hours 15 min"
        }
    ];

    // Filter by search and status
    const filtered = members.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterStatus === "all" || m.status === filterStatus)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'In Gym';
            case 'completed': return 'Completed';
            default: return 'Unknown';
        }
    };

    const stats = [
        { label: 'Total Check-ins', value: '24', color: 'blue' },
        { label: 'Currently Active', value: '3', color: 'green' },
        { label: 'Avg. Duration', value: '6.5h', color: 'purple' },
        { label: 'Peak Hour', value: '5-7 PM', color: 'red' }
    ];

    return (
        <AdminLayout>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
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
                                {filtered.length} of {members.length} records shown
                            </p>
                        </div>
                        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-red-500 flex items-center gap-2">
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
                                {filtered.length > 0 ? (
                                    filtered.map((m, i) => (
                                        <tr key={i} className="hover:bg-gray-750 transition-colors">
                                            <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                                            <td className="px-4 py-3 text-gray-300">{m.checkIn}</td>
                                            <td className="px-4 py-3 text-gray-300">{m.checkOut}</td>
                                            <td className="px-4 py-3 text-gray-300">{m.duration}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(m.status)}`}>
                                                    {getStatusText(m.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                                            No attendance records found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
                        <div className="text-gray-400 text-sm">
                            Showing {filtered.length} records
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-gray-300 text-sm">Page 1 of 3</span>
                            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
                        <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-white text-sm group-hover:text-gray-200 transition-colors">View Analytics</span>
                    </button>
                    
                    <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
                        <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Monthly Report</span>
                    </button>
                    
                    <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
                        <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Settings</span>
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AttendanceLogs;