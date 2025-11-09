import { Link } from 'react-router-dom';

export default function UserLayout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

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
                <Link
                  to="/userdashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors text-gray-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/membership"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors text-gray-300"
                >
                  Membership
                </Link>
                <Link
                  to="/user/payment"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors text-gray-300"
                >
                  Payment
                </Link>
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
            <Link
              to="/userdashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors text-gray-300"
            >
              Dashboard
            </Link>
            <Link
              to="/user/membership"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors text-gray-300"
            >
              Membership
            </Link>
            <Link
              to="/user/payment"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors text-gray-300"
            >
              Payment
            </Link>
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
