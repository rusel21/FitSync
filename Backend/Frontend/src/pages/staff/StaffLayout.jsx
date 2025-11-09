import { Link, useLocation } from "react-router-dom";

export default function StaffLayout({ children }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  // Function to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items configuration
  const navItems = [
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
      path: "/staff/scheduling", 
      label: "Scheduling",
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

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900 text-white overflow-x-hidden">
      {/* 🔴 Navigation */}
      <nav className="w-full bg-gray-800 border-b border-red-600 shadow-lg">
        <div className="flex items-center justify-between h-16 px-6 lg:px-12">
          {/* Left: Brand */}
          <Link
            to="/staff/dashboard"
            className="text-xl font-bold text-white hover:text-red-400 transition-colors"
          >
            Staff Portal
          </Link>

          {/* Center: Links - Enhanced with new responsibilities */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = isActiveLink(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg border-b-2 border-red-400'
                      : 'text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse ml-1"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Logout */}
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

        {/* Mobile Menu - Enhanced with new items */}
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
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
                      ? 'bg-red-600 text-white border-l-4 border-red-400'
                      : 'text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {mobileLabel}
                  {isActive && (
                    <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse ml-auto"></span>
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
      <main className="flex-1 w-full bg-gray-900 px-6 py-8 overflow-x-hidden">
        {/* Current Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            {navItems.find(item => isActiveLink(item.path))?.label || 'Staff Dashboard'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isActiveLink("/staff/membermanagement") && "Manage member accounts, profiles, and membership details"}
            {isActiveLink("/staff/checkinsystem") && "Handle daily check-ins, attendance tracking, and member access"}
            {isActiveLink("/staff/paymenttracking") && "Process payments, track dues, and send payment reminders"}
            {isActiveLink("/staff/communications") && "Send messages, manage templates, and handle member communications"}
            {isActiveLink("/staff/scheduling") && "Manage class schedules, trainer availability, and bookings"}
            {isActiveLink("/staff/reports") && "Generate operational reports and analyze performance metrics"}
            {!navItems.find(item => isActiveLink(item.path)) && "Daily operations and member management"}
          </p>
        </div>
        
        <div className="w-full h-full">{children}</div>
      </main>

      {/* 🔴 Footer */}
      <footer className="w-full bg-gray-800 border-t border-red-600 py-4 text-center">
        <p className="text-gray-300 text-sm">&copy; 2024 FitSync Staff Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}