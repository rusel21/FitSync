import { useState } from "react";
import AdminLayout from "./AdminLayout";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([
    { id: 1, name: "Sophia Carter", plan: "Premium", amount: "$99.99", method: "Stripe", date: "2024-07-26", status: "Paid" },
    { id: 2, name: "Ethan Bennett", plan: "Standard", amount: "$49.99", method: "GCash", date: "2024-07-25", status: "Paid" },
    { id: 3, name: "Olivia Hayes", plan: "Basic", amount: "$29.99", method: "PayPal", date: "2024-07-24", status: "Paid" },
    { id: 4, name: "Liam Foster", plan: "Premium", amount: "$99.99", method: "PayMaya", date: "2024-07-23", status: "Pending" },
    { id: 5, name: "Ava Morgan", plan: "Standard", amount: "$49.99", method: "Stripe", date: "2024-07-22", status: "Paid" },
    { id: 6, name: "Noah Parker", plan: "Basic", amount: "$29.99", method: "GCash", date: "2024-07-21", status: "Paid" },
    { id: 7, name: "Isabella Reed", plan: "Premium", amount: "$99.99", method: "PayPal", date: "2024-07-20", status: "Paid" },
    { id: 8, name: "Jackson Cole", plan: "Standard", amount: "$49.99", method: "PayMaya", date: "2024-07-19", status: "Failed" },
    { id: 9, name: "Mia Brooks", plan: "Basic", amount: "$29.99", method: "Stripe", date: "2024-07-18", status: "Paid" },
    { id: 10, name: "Aiden Hughes", plan: "Premium", amount: "$99.99", method: "GCash", date: "2024-07-17", status: "Paid" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0)
    .toFixed(2);

  const pendingPayments = payments.filter(p => p.status === "Pending").length;
  const failedPayments = payments.filter(p => p.status === "Failed").length;
  const successfulPayments = payments.filter(p => p.status === "Paid").length;

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod = filterMethod === "all" || payment.method === filterMethod;
    const matchesDate = !dateRange.start || !dateRange.end || 
                       (payment.date >= dateRange.start && payment.date <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'Stripe': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'GCash': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PayPal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PayMaya': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Premium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Standard': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Basic': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleMarkAsPaid = (paymentId) => {
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status: 'Paid' } : p
    ));
  };

  const handleRetryPayment = (paymentId) => {
    // Simulate retry logic
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status: 'Pending' } : p
    ));
  };

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue}`, color: 'green' },
    { label: 'Successful Payments', value: successfulPayments, color: 'blue' },
    { label: 'Pending Payments', value: pendingPayments, color: 'yellow' },
    { label: 'Failed Payments', value: failedPayments, color: 'red' }
  ];

  const paymentMethods = ['All', 'Stripe', 'GCash', 'PayPal', 'PayMaya'];
  const statusOptions = ['All', 'Paid', 'Pending', 'Failed'];

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payment Management</h1>
          <p className="text-gray-300">Monitor and manage all payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${
                  stat.color === 'green' ? 'bg-green-500/20' :
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  stat.color === 'yellow' ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                } rounded-full flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'yellow' ? 'text-yellow-400' :
                    'text-red-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input 
                type="text" 
                placeholder="Search by name or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option === 'All' ? 'all' : option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Method</label>
              <select 
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method === 'All' ? 'all' : method}>{method}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">From Date</label>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">To Date</label>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Payment Transactions</h2>
              <p className="text-gray-400 text-sm">
                {filteredPayments.length} of {payments.length} transactions shown
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-red-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Member Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Payment Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{payment.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPlanColor(payment.plan)}`}>
                          {payment.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-semibold">{payment.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMethodColor(payment.method)}`}>
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{payment.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          {payment.status === 'Pending' && (
                            <button
                              onClick={() => handleMarkAsPaid(payment.id)}
                              className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200"
                            >
                              Mark Paid
                            </button>
                          )}
                          {payment.status === 'Failed' && (
                            <button
                              onClick={() => handleRetryPayment(payment.id)}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                            >
                              Retry
                            </button>
                          )}
                          <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
                            Refund
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      No payment records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-gray-300 text-sm">Page 1 of 2</span>
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Revenue Analytics</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Payment Security</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Billing Calendar</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentManagement;