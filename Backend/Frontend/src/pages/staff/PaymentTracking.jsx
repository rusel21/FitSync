import { useState } from "react";
import StaffLayout from "./StaffLayout";

const PaymentTracking = () => {
  const [selectedPayments, setSelectedPayments] = useState([]);

  const payments = [
    { id: 1, userId: "FTS001", name: "John Doe", membership: "Monthly Plan", amountDue: 50, amountPaid: 50, paymentDate: "2024-07-25", status: "paid" },
    { id: 2, userId: "FTS002", name: "Jane Smith", membership: "Premium Plan", amountDue: 99, amountPaid: 0, paymentDate: "2024-07-20", status: "overdue" },
    { id: 3, userId: "FTS003", name: "Mike Johnson", membership: "Yearly Plan", amountDue: 948, amountPaid: 948, paymentDate: "2024-07-18", status: "paid" },
    { id: 4, userId: "FTS004", name: "Sarah Wilson", membership: "Monthly Plan", amountDue: 50, amountPaid: 0, paymentDate: "2024-07-28", status: "pending" },
    { id: 5, userId: "FTS005", name: "Chris Brown", membership: "Quarterly Plan", amountDue: 267, amountPaid: 267, paymentDate: "2024-07-22", status: "paid" },
  ];

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPayments(payments.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleMarkAsPaid = () => {
    if (selectedPayments.length === 0) {
      alert("Please select payments to mark as paid");
      return;
    }
    alert(`Marking ${selectedPayments.length} payment(s) as paid`);
    // Add your API call here
  };

  const handleSendReminders = () => {
    if (selectedPayments.length === 0) {
      alert("Please select payments to send reminders");
      return;
    }
    alert(`Sending reminders for ${selectedPayments.length} payment(s)`);
    // Add your API call here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <StaffLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Payment Tracking</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Search by name, ID, membership..." 
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
            <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors">
              <option>Membership: All</option>
              <option>Daily Plan</option>
              <option>Semi-Monthly Plan</option>
              <option>Monthly Plan</option>
              <option>Premium Plan</option>
              <option>Yearly Plan</option>
              <option>Quarterly Plan</option>
            </select>
            <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors">
              <option>Status: All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <input 
              type="date" 
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Payments Received</p>
                <p className="text-2xl font-bold text-white mt-2">$12,450.00</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold text-white mt-2">$1,230.00</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-red-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Overdue Payments</p>
                <p className="text-2xl font-bold text-white mt-2">$450.00</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Payment History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedPayments.length === payments.length && payments.length > 0}
                      className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Membership Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount Due</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount Paid</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Payment Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                    </td>
                    <td className="px-4 py-3 text-white">{payment.userId}</td>
                    <td className="px-4 py-3 text-white">{payment.name}</td>
                    <td className="px-4 py-3 text-gray-300">{payment.membership}</td>
                    <td className="px-4 py-3 text-white">${payment.amountDue}.00</td>
                    <td className="px-4 py-3 text-white">${payment.amountPaid}.00</td>
                    <td className="px-4 py-3 text-gray-300">{payment.paymentDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-3">
              <button 
                onClick={handleMarkAsPaid}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-green-500 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Mark as Paid
              </button>
              <button 
                onClick={handleSendReminders}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-yellow-500 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Send Reminders
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              {selectedPayments.length > 0 ? `${selectedPayments.length} selected` : "1-5 of 124 payments"}
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Generate Report</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Payment Analytics</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Payment Calendar</span>
          </button>
        </div>
      </div>
    </StaffLayout>
  );
};

export default PaymentTracking;