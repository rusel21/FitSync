import React, { useState } from "react";
import UserLayout from "./UserLayout";

export default function Membership() {
  const [membershipType, setMembershipType] = useState("Premium");
  const [startDate, setStartDate] = useState("2024-07-28");
  const [endDate] = useState("2025-07-28");
  const [addons, setAddons] = useState({
    personalTrainer: true,
    groupClasses: false,
  });

  const handleAddonChange = (e) => {
    const { name, checked } = e.target;
    setAddons((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Membership Type: ${membershipType}\nStart Date: ${startDate}\nEnd Date: ${endDate}\nAdd-ons: ${Object.keys(addons)
        .filter((k) => addons[k])
        .join(", ")}`
    );
  };

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
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="Premium" className="bg-gray-700">Premium</option>
                <option value="Yearly" className="bg-gray-700">Yearly</option>
                <option value="Quarterly" className="bg-gray-700">Quarterly</option>
                <option value="Monthly" className="bg-gray-700">Monthly</option>
              </select>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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

            {/* Add-ons */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Add-ons</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="personalTrainer"
                      checked={addons.personalTrainer}
                      onChange={handleAddonChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-colors ${
                      addons.personalTrainer 
                        ? 'bg-red-600 border-red-600' 
                        : 'border-gray-500 group-hover:border-red-400'
                    }`}>
                      {addons.personalTrainer && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Personal Trainer</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="groupClasses"
                      checked={addons.groupClasses}
                      onChange={handleAddonChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-colors ${
                      addons.groupClasses 
                        ? 'bg-red-600 border-red-600' 
                        : 'border-gray-500 group-hover:border-red-400'
                    }`}>
                      {addons.groupClasses && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Group Classes</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors duration-200 border border-red-500 font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Membership Status Card */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Membership Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-400 mb-1">Type</p>
              <p className="text-lg font-bold text-red-400">{membershipType}</p>
            </div>
            <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className="text-lg font-bold text-green-400">Active</p>
            </div>
            <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-400 mb-1">Days Remaining</p>
              <p className="text-lg font-bold text-white">365</p>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-red-600/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Membership Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border ${
              membershipType === 'Premium' ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
            } transition-colors`}>
              <h4 className="font-semibold text-white">Premium</h4>
              <p className="text-2xl font-bold text-red-400 mt-2">$99<span className="text-sm text-gray-400">/mo</span></p>
            </div>
            <div className={`p-4 rounded-lg border ${
              membershipType === 'Yearly' ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
            } transition-colors`}>
              <h4 className="font-semibold text-white">Yearly</h4>
              <p className="text-2xl font-bold text-red-400 mt-2">$79<span className="text-sm text-gray-400">/mo</span></p>
            </div>
            <div className={`p-4 rounded-lg border ${
              membershipType === 'Quarterly' ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
            } transition-colors`}>
              <h4 className="font-semibold text-white">Quarterly</h4>
              <p className="text-2xl font-bold text-red-400 mt-2">$89<span className="text-sm text-gray-400">/mo</span></p>
            </div>
            <div className={`p-4 rounded-lg border ${
              membershipType === 'Monthly' ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
            } transition-colors`}>
              <h4 className="font-semibold text-white">Monthly</h4>
              <p className="text-2xl font-bold text-red-400 mt-2">$99<span className="text-sm text-gray-400">/mo</span></p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}