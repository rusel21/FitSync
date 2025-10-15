import NavAdmin from "./NavAdmin";
import "../../css/PaymentManagement.css";

const payments = [
  { name: "Sophia Carter", plan: "Premium", amount: "$99.99", method: "Stripe", date: "2024-07-26", status: "Paid" },
  { name: "Ethan Bennett", plan: "Standard", amount: "$49.99", method: "GCash", date: "2024-07-25", status: "Paid" },
  { name: "Olivia Hayes", plan: "Basic", amount: "$29.99", method: "PayPal", date: "2024-07-24", status: "Paid" },
  { name: "Liam Foster", plan: "Premium", amount: "$99.99", method: "PayMaya", date: "2024-07-23", status: "Pending" },
  { name: "Ava Morgan", plan: "Standard", amount: "$49.99", method: "Stripe", date: "2024-07-22", status: "Paid" },
  { name: "Noah Parker", plan: "Basic", amount: "$29.99", method: "GCash", date: "2024-07-21", status: "Paid" },
  { name: "Isabella Reed", plan: "Premium", amount: "$99.99", method: "PayPal", date: "2024-07-20", status: "Paid" },
  { name: "Jackson Cole", plan: "Standard", amount: "$49.99", method: "PayMaya", date: "2024-07-19", status: "Failed" },
  { name: "Mia Brooks", plan: "Basic", amount: "$29.99", method: "Stripe", date: "2024-07-18", status: "Paid" },
  { name: "Aiden Hughes", plan: "Premium", amount: "$99.99", method: "GCash", date: "2024-07-17", status: "Paid" },
];

const PaymentManagement = () => {
  return (
    <>
    
    <NavAdmin/>
    <div className="payment-container">
      <div className="header">
        <h1>Payment Management</h1>
        <a href="#" className="report-link">View Revenue Reports</a>
      </div>

      <table className="payment-table">
        <thead>
          <tr>
            <th>Member Name</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, index) => (
            <tr key={index}>
              <td>{p.name}</td>
              <td>{p.plan}</td>
              <td>{p.amount}</td>
              <td>{p.method}</td>
              <td>{p.date}</td>
              <td>
                <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default PaymentManagement;
