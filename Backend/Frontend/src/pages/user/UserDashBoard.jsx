import React, { useState } from "react";
import Navbar from "../../components/navbar";
import "./../../css/Dash.css";

export default function UserDashBoard() {
  return (
    <div className="membership-container">
      {/* ✅ Navbar */}
      <Navbar />

      {/* MAIN */}
      <main className="main">
        <h2>Membership Dashboard</h2>
        <div className="dashboard">
          {/* Left Section */}
          <div className="membership-card">
            <div className="membership-info">
              <span className="status-badge">Active</span>
              <h3>Premium Membership</h3>
              <p>Expires on July 15, 2024</p>
              <button className="renew-btn">Renew Membership</button>
            </div>
          </div>

          {/* Right Section */}
          <div className="attendance-card">
            <h3>Attendance</h3>
            <p className="attendance-number">25</p>
            <p className="attendance-note">Check-ins in the last 30 days</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="notifications">
          <h3>Notifications</h3>
          <div className="notification-item">
            <span className="material-symbols-outlined notif-icon">event_repeat</span>
            <div>
              <p className="notif-title">Membership Renewal Reminder</p>
              <p className="notif-text">
                Your membership is expiring soon. Renew now to continue enjoying our facilities.
              </p>
            </div>
          </div>

          <div className="notification-item">
            <span className="material-symbols-outlined notif-icon">login</span>
            <div>
              <p className="notif-title">Check-in Confirmation</p>
              <p className="notif-text">You have successfully checked in at 6:00 AM.</p>
            </div>
          </div>

          <div className="notification-item">
            <span className="material-symbols-outlined notif-icon">logout</span>
            <div>
              <p className="notif-title">Check-out Confirmation</p>
              <p className="notif-text">You have successfully checked out at 7:30 AM.</p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 Fitness Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
