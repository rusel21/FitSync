import React, { useState, useEffect } from "react";
import UserLayout from "./UserLayout";
import api from "../../utils/axiosConfig";

export default function Membership() {
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "Monthly",
    start_date: new Date().toISOString().split('T')[0]
  });

  // Fetch current membership and plans
  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      const [membershipRes, plansRes] = await Promise.all([
        api.get('/membership/current'),
        api.get('/membership/plans')
      ]);

      if (membershipRes.data.has_membership) {
        setMembership(membershipRes.data.membership);
        setFormData(prev => ({
          ...prev,
          type: membershipRes.data.membership.type,
          start_date: membershipRes.data.membership.start_date
        }));
      }

      setPlans(plansRes.data.plans);
    } catch (error) {
      console.error('Error fetching membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.post('/membership/update', formData);
      alert('Membership updated successfully!');
      await fetchMembershipData(); // Refresh data
    } catch (error) {
      console.error('Error updating membership:', error);
      alert('Error updating membership. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your membership?')) {
      return;
    }

    try {
      await api.post('/membership/cancel');
      alert('Membership cancelled successfully!');
      await fetchMembershipData(); // Refresh data
    } catch (error) {
      console.error('Error cancelling membership:', error);
      alert('Error cancelling membership. Please try again.');
    }
  };

  const calculateEndDate = (type, startDate) => {
    const start = new Date(startDate);
    switch(type) {
      case 'Daily Plan': return new Date(start.setDate(start.getDate() + 1)).toISOString().split('T')[0];
      case 'Semi-Monthly Plan': return new Date(start.setDate(start.getDate() + 15)).toISOString().split('T')[0];
      case 'Monthly': return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
      case 'Premium': return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
      case 'Yearly': return new Date(start.setFullYear(start.getFullYear() + 1)).toISOString().split('T')[0];
      case 'Quarterly': return new Date(start.setMonth(start.getMonth() + 3)).toISOString().split('T')[0];
      default: return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading membership information...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const endDate = calculateEndDate(formData.type, formData.start_date);

  return (
    <UserLayout>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">FitSync Membership</h1>
          <p className="text-gray-300">Manage your membership details and preferences</p>
        </div>

        {/* Membership Form */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Membership Information</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Membership Type */}
            <div className="mb-6">
              <label htmlFor="membership-type" className="block text-sm font-medium text-gray-300 mb-2">
                Membership Type
              </label>
              <select
                id="membership-type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                {plans.map(plan => (
                  <option key={plan.type} value={plan.type} className="bg-gray-700">
                    {plan.type} - ${plan.price}/{plan.billing_cycle}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-2">
                  End Date (auto-calculated)
                </label>
                <input 
                  type="date" 
                  id="end-date" 
                  value={endDate} 
                  disabled
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between space-x-4 pt-4 border-t border-gray-700">
              {membership && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                  Cancel Membership
                </button>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:bg-red-400 transition-colors duration-200 border border-red-500 font-medium disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Current Membership Status */}
        {membership && (
          <div className="mt-8 bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Membership Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400 mb-1">Type</p>
                <p className="text-lg font-bold text-red-400">{membership.type}</p>
              </div>
              <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className={`text-lg font-bold ${membership.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {membership.status}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400 mb-1">Days Remaining</p>
                <p className="text-lg font-bold text-white">{membership.days_remaining}</p>
              </div>
              <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400 mb-1">Price</p>
                <p className="text-lg font-bold text-white">${membership.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Information */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Membership Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div 
                key={plan.type}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  formData.type === plan.type 
                    ? 'border-red-500 bg-red-500/10 transform scale-105' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: plan.type }))}
              >
                <h4 className="font-semibold text-white">{plan.type}</h4>
                <p className="text-2xl font-bold text-red-400 mt-2">
                  ${plan.price}<span className="text-sm text-gray-400">/{plan.billing_cycle}</span>
                </p>
                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}