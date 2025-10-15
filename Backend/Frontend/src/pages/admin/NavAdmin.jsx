import {useState} from "react";
import {FaHome,FaUser,FaDumbbell,FaChartBar,FaMoneyBillWave,FaClock,FaUserShield,FaCog,FaSignOutAlt} from "react-icons/fa";
import "../../css/NavAdmin.css";
import { Link } from 'react-router-dom';


export default function NavAdmin(){

  const[isOpen,setIsOpen]=useState(true);

  const toggleSidebar=()=>{
    setIsOpen(!isOpen);
  }
  return(
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <h2 className="logo">
          {isOpen ? "FitSync Admin" : "FS"}
        </h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          </button>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/admin/dashboard">
          <FaHome/>
          <span>Dashboard</span></Link>
        </li>
        <li>
          <Link to ="/admin/membermanagement">
          <FaUser/>
          <span>Members</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/membershipplanmanagement">
          <FaDumbbell/>
          <span>Membership Plans</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/attendancelogs">
          <FaClock/>
          <span>Attendance</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/analytics">
          <FaChartBar/>
          <span>Analytics</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/paymentmanagement">
          <FaMoneyBillWave/>
          <span>Payments</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/rolemanagement">
          <FaUserShield/>
          <span>Roles&Permissions</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/systemsettings">
          <FaCog/>
          <span>Settings</span>
          </Link>
        </li>
        <li className="logout">
          <Link to="/login" onClick={() => {localStorage.removeItem('auth_token');}}>
          <FaSignOutAlt/>
        <span>Logout</span>
        </Link>
        </li>
      </ul>
    </div>

    
  )
}