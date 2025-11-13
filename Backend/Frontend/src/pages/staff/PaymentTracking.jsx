import { useState, useEffect } from "react";
import StaffLayout from "./StaffLayout";

const PaymentTracking = () => {
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    membership_type: 'all',
    status: 'all',
    date: ''
  });
  const [summary, setSummary] = useState({
    total_received: 0,
    pending_amount: 0,
    overdue_amount: 0
  });

  // Fetch payments on component mount and filter change
  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/staff/payments?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setPayments(data.payments);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS MISSING FUNCTION
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPayments(payments.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleMarkAsPaid = async () => {
    if (selectedPayments.length === 0) {
      alert("Please select payments to mark as paid");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/staff/payments/mark-paid', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_ids: selectedPayments })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Successfully marked ${data.updated_count} payment(s) as paid`);
        setSelectedPayments([]);
        fetchPayments(); // Refresh the list
      } else {
        alert('Failed to mark payments as paid: ' + data.message);
      }
    } catch (error) {
      console.error('Error marking payments as paid:', error);
      alert('Failed to mark payments as paid');
    }
  };

  const handleSendReminders = async () => {
    if (selectedPayments.length === 0) {
      alert("Please select payments to send reminders");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/staff/payments/send-reminders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_ids: selectedPayments })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Reminders sent for ${data.reminder_count} payment(s)`);
      } else {
        alert('Failed to send reminders: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Failed to send reminders');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchPayments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "cancelled": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatCurrency = (amount) => {
    return '₱' + parseFloat(amount).toFixed(2);
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
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
            <select 
              value={filters.membership_type}
              onChange={(e) => handleFilterChange('membership_type', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            >
              <option value="all">Membership: All</option>
              <option value="Daily Plan">Daily Plan</option>
              <option value="Semi-Monthly Plan">Semi-Monthly Plan</option>
              <option value="Monthly Plan">Monthly Plan</option>
              <option value="Premium Plan">Premium Plan</option>
              <option value="Yearly Plan">Yearly Plan</option>
              <option value="Quarterly Plan">Quarterly Plan</option>
            </select>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            >
              <option value="all">Status: All</option>
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input 
              type="date" 
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
            <button 
              onClick={handleApplyFilters}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500"
            >
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
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(summary.total_received)}</p>
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
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(summary.pending_amount)}</p>
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
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(summary.overdue_amount)}</p>
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
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                      Loading payments...
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedPayments.includes(payment.id)}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-4 py-3 text-white">{payment.user_display_id || payment.user_id}</td>
                      <td className="px-4 py-3 text-white">{payment.name}</td>
                      <td className="px-4 py-3 text-gray-300">{payment.membership_type}</td>
                      <td className="px-4 py-3 text-white">{formatCurrency(payment.amount_due)}</td>
                      <td className="px-4 py-3 text-white">{formatCurrency(payment.amount_paid)}</td>
                      <td className="px-4 py-3 text-gray-300">{payment.payment_date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-3">
              <button 
                onClick={handleMarkAsPaid}
                disabled={selectedPayments.length === 0}
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-green-500 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Mark as Paid
              </button>
              <button 
                onClick={handleSendReminders}
                disabled={selectedPayments.length === 0}
                className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-yellow-500 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Send Reminders
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              {selectedPayments.length > 0 ? `${selectedPayments.length} selected` : `${payments.length} payments`}
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