import { Link } from 'react-router-dom';
import '../css/Navbar.css';

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Brand */}
        <div className="navbar-brand">
          <Link to="/userdashboard">FitSync</Link>
        </div>

        {/* Center: Links */}
        <ul className="navbar-links">
          <li>
            <Link to="/userdashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/user/membership">Membership</Link>
          </li>
          <li>
            <Link to="/user/payment">Payment</Link>
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
