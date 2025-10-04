import { useState } from "react";
import NavStaff from "./NavStaff";
import "../../css/PaymentTracking.css"; // import the custom css

const PaymentTracking = () => {
  return (
    <>
    <NavStaff/>
    <div className="payment-tracking">
      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <h1>Payment Tracking</h1>
          <div className="filters">
            <input type="text" placeholder="Search by name, ID, membership..." />
            <select>
              <option>Membership: All</option>
              <option>Daily Plan</option>
              <option>Semi-Monthly Plan</option>
              <option>Monthly Plan</option>
            </select>
            <select>
              <option>Status: All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <input type="date" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card total-payments">
            <p>Total Payments Received</p>
            <p>$12,450.00</p>
          </div>
          <div className="card pending-payments">
            <p>Pending Payments</p>
            <p>$1,230.00</p>
          </div>
          <div className="card overdue-payments">
            <p>Overdue Payments</p>
            <p>$450.00</p>
          </div>
        </div>

        {/* Payment Table */}
        <div className="payment-table">
          <div className="table-header">
            <h2>Payment History</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Membership Type</th>
                  <th>Amount Due</th>
                  <th>Amount Paid</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>FTS001</td>
                  <td>John Doe</td>
                  <td>Monthly Plan</td>
                  <td>$50.00</td>
                  <td>$50.00</td>
                  <td>2024-07-25</td>
                  <td><span className="status paid">Paid</span></td>
                </tr>
                {/* Repeat rows */}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="buttons">
              <button className="mark-paid">Mark as Paid</button>
              <button className="send-reminder">Send Reminders</button>
            </div>
            <div className="pagination">1-5 of 124 payments</div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default PaymentTracking;
