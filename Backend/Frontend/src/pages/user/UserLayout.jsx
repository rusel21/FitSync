import { Link, useLocation } from 'react-router-dom';

export default function UserLayout({ children }) {
  const location = useLocation();

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
    { path: "/userdashboard", label: "Dashboard" },
    { path: "/user/membership", label: "Membership" },
    { path: "/user/payment", label: "Payment" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-red-600 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand */}
            <div className="flex-shrink-0">
              <Link 
                to="/userdashboard" 
                className="text-xl font-bold text-white hover:text-red-400 transition-colors"
              >
                FitSync
              </Link>
            </div>

            {/* Center: Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = isActiveLink(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg border-b-2 border-red-400'
                          : 'text-gray-300 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Logout */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md border border-red-500/50 
                         hover:from-red-600 hover:to-red-800 hover:shadow-red-500/30 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = isActiveLink(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-red-600 text-white border-l-4 border-red-400'
                      : 'text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full bg-gray-900">
        <div className="h-full w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <p className="text-gray-300">&copy; 2024 FitSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}