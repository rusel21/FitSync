import { useState } from "react";
import { 
  FaHome, 
  FaUser, 
  FaDumbbell, 
  FaChartBar, 
  FaMoneyBillWave, 
  FaClock, 
  FaUserShield, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
  FaUsers,
  FaEye,
  FaChartLine
} from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  // Function to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items configuration
  const navItems = [
    { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/admin/adminmembermanagement", icon: FaEye, label: "Member Overview" },
    { path: "/admin/membershipplanmanagement", icon: FaDumbbell, label: "Plan Management" },
    { path: "/admin/attendancelogs", icon: FaChartLine, label: "Attendance Analytics" },
    { path: "/admin/analytics", icon: FaChartBar, label: "Business Analytics" },
    { path: "/admin/paymentmanagement", icon: FaMoneyBillWave, label: "Revenue Reports" },
    { path: "/admin/staffmanagement", icon: FaUsers, label: "Staff Management" },
    { path: "/admin/rolemanagement", icon: FaUserShield, label: "System Permissions" },
    { path: "/admin/systemsettings", icon: FaCog, label: "System Settings" },
  ];

  return (
    <div className="min-h-screen w-screen flex bg-gray-900 text-white overflow-x-hidden">
      {/* 🔴 Sidebar - Updated for Reduced Admin Workload */}
      <div className={`bg-gray-800 border-r border-red-600 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {isOpen ? (
              <h2 className="text-xl font-bold text-white">FitSync Admin</h2>
            ) : (
              <h2 className="text-xl font-bold text-white">FS</h2>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              {isOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sidebar Menu - Updated for Admin's Strategic Role */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveLink(item.path);
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 group ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg border-l-4 border-red-400'
                        : 'text-gray-300 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    {isOpen && (
                      <span className="flex-1 flex items-center justify-between">
                        {item.label}
                        {isActive && (
                          <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></span>
                        )}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-colors duration-200 text-gray-300 hover:text-white group w-full"
            >
              <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* ⚫ Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-gray-800 border-b border-red-600 shadow-lg">
          <div className="flex items-center justify-between h-16 px-6">
            <div>
              <h1 className="text-xl font-semibold text-white">
                Admin Portal - Strategic Oversight
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Focused on business strategy and system management
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Current Page Indicator */}
              <div className="bg-red-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>
                  {navItems.find(item => isActiveLink(item.path))?.label || 'Dashboard'}
                </span>
              </div>

              {/* Admin Status Indicator */}
              <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                STRATEGIC MODE
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 relative">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                {isOpen && (
                  <div className="text-sm">
                    <p className="text-white font-medium">Admin User</p>
                    <p className="text-gray-400">Strategic Administrator</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-900 p-6 overflow-y-auto">
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* 🔴 Footer */}
        <footer className="bg-gray-800 border-t border-red-600 py-4 px-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; 2024 FitSync Admin Portal - Strategic Management System
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Reduced Operational Load</span>
              <p className="text-gray-400 text-sm">v2.0.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}