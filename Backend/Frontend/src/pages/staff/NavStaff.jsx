import { Link } from 'react-router-dom';
import '../../css/Navbar.css';

export default function NavStaff() {
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Brand */}
        <div className="navbar-brand">
          <Link to="/staff/profile">Staff</Link>
        </div>

        {/* Center: Links */}
        <ul className="navbar-links">
          <li>
            <Link to="/staff/membermanagement">Member Management</Link>
          </li>
          <li>
            <Link to="/staff/checkinsystem">Check-in System</Link>
          </li>
          <li>
            <Link to="/staff/paymenttracking">Payment Tracking</Link>
          </li>
        </ul>

        {/* Right: Logout */}
        <div className="navbar-logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
