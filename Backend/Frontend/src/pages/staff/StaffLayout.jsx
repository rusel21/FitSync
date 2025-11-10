import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StaffLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/staff/login");
  };

  // Function to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items configuration
  const navItems = [
    { 
      path: "/staff/profile", 
      label: "Profile",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
    },
    { 
      path: "/staff/membermanagement", 
      label: "Members",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
    },
    { 
      path: "/staff/checkinsystem", 
      label: "Check-ins",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
    },
    { 
      path: "/staff/paymenttracking", 
      label: "Payments",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
    },
    { 
      path: "/staff/communications", 
      label: "Communications",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
    },
    { 
      path: "/staff/equipmentmanagement", 
      label: "Facilities",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
    },
    { 
      path: "/staff/reports", 
      label: "Reports",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
    },
  ];

  // Add Admin Portal link if user is Admin
  const adminNavItem = staff?.role === 'Admin' 
    ? [
        { 
          path: "/admin/dashboard", 
          label: "Admin Portal", 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>,
          isAdmin: true
        }
      ]
    : [];

  const allNavItems = [...navItems, ...adminNavItem];

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900 text-white overflow-x-hidden">
      {/* 🔴 Navigation */}
      <nav className="w-full bg-gray-800 border-b border-red-600 shadow-lg">
        <div className="flex items-center justify-between h-16 px-6 lg:px-12">
          {/* Left: Brand */}
          <Link
            to="/staff/profile"
            className="text-xl font-bold text-white hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            FitSync Staff
          </Link>

          {/* Center: Links */}
          <div className="hidden md:flex items-center space-x-2">
            {allNavItems.map((item) => {
              const isActive = isActiveLink(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive
                      ? item.isAdmin 
                        ? 'bg-blue-600 text-white shadow-lg border-b-2 border-blue-400' 
                        : 'bg-red-600 text-white shadow-lg border-b-2 border-red-400'
                      : item.isAdmin
                        ? 'text-blue-300 hover:bg-blue-600 hover:text-white'
                        : 'text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ml-1 ${
                      item.isAdmin ? 'bg-blue-300' : 'bg-red-300'
                    }`}></span>
                  )}
                  {item.isAdmin && (
                    <span className="ml-1 px-1 py-0.5 bg-blue-500 text-xs rounded text-white">
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-4">
            {staff && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  staff.role === 'Admin' ? 'bg-blue-600' : 'bg-red-600'
                }`}>
                  {staff.name?.charAt(0) || 'S'}
                </div>
                <div className="text-right">
                  <div className="font-medium">{staff.name}</div>
                  <div className={`text-xs ${
                    staff.role === 'Admin' ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {staff.role}
                    {staff.role === 'Admin' && ' ⚡'}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors duration-200 border border-red-500 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-1">
            {allNavItems.map((item) => {
              const isActive = isActiveLink(item.path);
              const mobileLabel = item.label === "Members" ? "Member Management" : 
                                item.label === "Check-ins" ? "Check-in System" :
                                item.label === "Payments" ? "Payment Tracking" :
                                item.label;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? item.isAdmin
                        ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                        : 'bg-red-600 text-white border-l-4 border-red-400'
                      : item.isAdmin
                        ? 'text-blue-300 hover:bg-blue-600 hover:text-white'
                        : 'text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{mobileLabel}</span>
                  {item.isAdmin && (
                    <span className="px-1.5 py-0.5 bg-blue-500 text-xs rounded text-white">
                      Admin
                    </span>
                  )}
                  {isActive && (
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      item.isAdmin ? 'bg-blue-300' : 'bg-red-300'
                    }`}></span>
                  )}
                </Link>
              );
            })}
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-500 text-white transition-colors duration-200 border border-red-500 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ⚫ Main Content */}
      <main className="flex-1 w-full bg-gray-900 px-4 sm:px-6 py-6 overflow-x-hidden">
        {/* Current Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {allNavItems.find(item => isActiveLink(item.path))?.label || 'Staff Dashboard'}
                {staff?.role === 'Admin' && location.pathname.startsWith('/staff/') && (
                  <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                    Staff Mode
                  </span>
                )}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {isActiveLink("/staff/profile") && "Manage your staff profile and account settings"}
                {isActiveLink("/staff/membermanagement") && "Manage member accounts, profiles, and membership details"}
                {isActiveLink("/staff/checkinsystem") && "Handle daily check-ins, attendance tracking, and member access"}
                {isActiveLink("/staff/paymenttracking") && "Process payments, track dues, and send payment reminders"}
                {isActiveLink("/staff/communications") && "Send messages, manage templates, and handle member communications"}
                {isActiveLink("/staff/equipmentmanagement") && "Manage gym equipment, maintenance schedules, and facility bookings"}
                {isActiveLink("/staff/reports") && "Generate operational reports and analyze performance metrics"}
                {isActiveLink("/admin/dashboard") && "System-wide management and strategic oversight"}
                {!allNavItems.find(item => isActiveLink(item.path)) && "Daily operations and member management"}
              </p>
            </div>
            {staff && (
              <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-300">
                <span className={`px-3 py-1 rounded-full border ${
                  staff.role === 'Admin' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                    : 'bg-gray-800 border-gray-700'
                }`}>
                  ID: {staff.staff_id}
                </span>
                {staff.role === 'Admin' && (
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
                    Administrator Access
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full h-full">{children}</div>
      </main>

      {/* 🔴 Footer */}
      <footer className="w-full bg-gray-800 border-t border-red-600 py-4 text-center">
        <p className="text-gray-300 text-sm">
          &copy; 2024 FitSync Staff Portal. {staff?.name ? `Logged in as ${staff.name} (${staff.role})` : 'All rights reserved.'}
        </p>
      </footer>
    </div>
  );
}