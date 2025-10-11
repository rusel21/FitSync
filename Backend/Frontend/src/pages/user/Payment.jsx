import React, { useState } from "react";
import Navbar from "../../components/navbar";
import "./../../css/Payment.css";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <>
      <Navbar />

      <div className="payment-container">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <svg
              className="logo-icon"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              />
            </svg>
            <h1 className="site-title">FitSync</h1>
          </div>
          <div className="header-right">
            <button className="icon-button">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div
              className="user-avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUBjmENAHUel5q3Fw5jAaWmvk79i1VS31q9ldyowdXdIzWYCuMdgY4WixvWLT9XYWGYWwFSeePXh80bmleWmu5ftIgridUKeWtvJ8q5ybu2UmFaPoZ4VbVC4Zw2f8i9K_XI5GH2HixCj-5ryAnPjKW0LIzBx043z1gofEXRgy6jmKnjD-y--So-E1VW0ITZ83N0UzrqVQMgObeaXDUm74uaZYQjr1pyJdLFsNJrZTeXDarqbMKDFhpONy1cTppSim5OJQqMYMzr4w")',
              }}
            ></div>
          </div>
        </header>

        {/* Main */}
        <main className="main-content">
          <div className="payment-card">
            <h2 className="title">Secure Payment</h2>

            <div className="payment-summary">
              <h3>Payment for Membership</h3>
              <p className="price">$99.00</p>
            </div>

            <h4 className="section-title">Select Payment Method</h4>

            <div className="payment-methods">
              {["card", "wallet", "paypal", "gcash"].map((method) => (
                <label
                  key={method}
                  className={`method-option ${
                    paymentMethod === method ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>
                    {method === "wallet" ? "e-Wallets" : method.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>

            {/* Card Form */}
            <form className="payment-form">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM / YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>

              <div className="form-group">
                <label>Name on Card</label>
                <input type="text" placeholder="Enter name on card" />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="save-card" />
                <label htmlFor="save-card">Save card for future payments</label>
              </div>

              <button type="submit" className="pay-btn">
                Pay Now
              </button>

              <p className="secure-note">
                <span className="material-symbols-outlined">lock</span>
                Payments are secure and encrypted.
              </p>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
