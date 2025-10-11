import React from "react";
import Navbar from "../../components/navbar";
import "./../../css/Dash.css";

export default function UserDashBoard() {
  return (
    <>
      <Navbar />

      <div className="dashboard">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <svg
              className="logo-icon"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="logo-text">FitSync</span>
          </div>

         {/*  <nav className="nav">
            <a href="#">Overview</a>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Support</a>
          </nav>
        */}
          <button className="btn-primary">Get Started</button>
        </header>

        {/* Main content */}
        <main className="main">
          <div className="login-card">
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your account.</p>

            <form>
              <input type="email" placeholder="Email address" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="btn-primary full">
                Log in
              </button>
            </form>

            <div className="extra-links">
              <a href="#">Forgot your password?</a>
              <p>
                Don't have an account? <a href="#">Sign up</a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
