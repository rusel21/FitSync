import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "./UserLayout";
import api from "../../utils/axiosConfig";

export default function Membership() {
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: "",
    start_date: new Date().toISOString().split('T')[0]
  });

  // Fetch current membership and plans
  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log('🔍 Testing API connection...');
      
      // First test a simple public endpoint
      try {
        const testResponse = await api.get('/test-cors');
        console.log('✅ CORS test passed:', testResponse.data);
      } catch (testError) {
        console.error('❌ CORS test failed:', testError);
        setError('Cannot connect to server. Please check if the backend is running.');
        return;
      }

      // Fetch plans first (this should work as it's public)
      console.log('📡 Fetching membership plans...');
      const plansRes = await api.get('/membership/plans');
      console.log('✅ Plans response:', plansRes.data);
      
      // Ensure plans data is properly formatted
      if (plansRes.data.plans && Array.isArray(plansRes.data.plans)) {
        const formattedPlans = plansRes.data.plans.map(plan => ({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features : [],
          price: parseFloat(plan.price) || 0,
          original_price: parseFloat(plan.original_price) || plan.price
        }));
        setPlans(formattedPlans);
        
        // Set default type if no type is selected
        if (formattedPlans.length > 0 && !formData.type) {
          setFormData(prev => ({
            ...prev,
            type: formattedPlans[0].type
          }));
        }
      } else {
        console.warn('⚠️ No plans array in response');
        setError('No membership plans available.');
      }

      // Try to fetch current membership - 404 is NORMAL when no membership exists
      try {
        console.log('📡 Fetching current membership...');
        const membershipRes = await api.get('/membership/current');
        console.log('✅ Membership response:', membershipRes.data);
        
        if (membershipRes.data.has_membership) {
          setMembership(membershipRes.data.membership);
          setFormData(prev => ({
            ...prev,
            type: membershipRes.data.membership.type,
            start_date: membershipRes.data.membership.start_date
          }));
        } else {
          console.log('ℹ️ No active membership found');
          setMembership(null);
        }
      } catch (membershipError) {
        // 404 is EXPECTED when user has no membership - this is not an error!
        if (membershipError.response?.status === 404) {
          console.log('ℹ️ No active membership found (404 response) - this is normal for new users');
          setMembership(null);
          // Don't set error - this is normal behavior
        } else if (membershipError.response?.status === 401) {
          console.log('🔐 User not authenticated for membership endpoint');
          setError('Please log in to access membership information.');
        } else {
          console.error('❌ Unexpected error fetching membership:', membershipError);
          // Only set error for unexpected errors, not 404s
          if (membershipError.code !== 'ERR_BAD_REQUEST' || membershipError.response?.status !== 404) {
            setError('Unexpected error loading membership information.');
          }
        }
      }

    } catch (error) {
      console.error('❌ Error in fetchMembershipData:', error);
      
      // Only show errors for network issues or other critical failures
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (error.response?.status === 401) {
        setError('Please log in to access membership information.');
      } else if (error.response?.status !== 404) { // Don't show error for 404s
        setError('Failed to load membership information.');
      }
      
      // Fallback to your actual seeded data only if plans failed to load
      if (plans.length === 0) {
        console.log('🔄 Using fallback plans data');
        const seededPlans = [
          {
            type: "Daily Plan",
            name: "Daily Pass",
            price: 50.00,
            original_price: 50.00,
            discount: "0%",
            duration: "1 Day",
            billing_cycle: "daily",
            features: [
              "Single day access",
              "Basic equipment usage",
              "Locker access",
              "Shower facilities"
            ],
            is_popular: false
          },
          {
            type: "Semi-Monthly Plan",
            name: "Semi-Monthly Plan",
            price: 350.00,
            original_price: 400.00,
            discount: "12%",
            duration: "15 Days",
            billing_cycle: "semi-monthly",
            features: [
              "15 days unlimited access",
              "All equipment usage",
              "Locker access",
              "Shower facilities",
              "Free towel service",
              "Basic fitness assessment"
            ],
            is_popular: false
          },
          {
            type: "Monthly Plan",
            name: "Monthly Membership",
            price: 500.00,
            original_price: 600.00,
            discount: "17%",
            duration: "30 Days",
            billing_cycle: "monthly",
            features: [
              "30 days unlimited access",
              "All equipment usage",
              "Locker access",
              "Shower facilities",
              "Free towel service",
              "Basic fitness assessment",
              "2 free personal training sessions",
              "Nutrition consultation"
            ],
            is_popular: true
          }
        ];
        setPlans(seededPlans);
        if (!formData.type) {
          setFormData(prev => ({ ...prev, type: seededPlans[0].type }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!formData.type) {
      alert('Please select a membership type');
      return;
    }

    const selectedPlan = plans.find(plan => plan.type === formData.type);
    if (selectedPlan) {
      console.log('🎯 Proceeding to payment with plan:', selectedPlan);
      // Navigate to payment page with the selected plan
      navigate('/user/payment', { 
        state: { 
          selectedPlan: selectedPlan,
          startDate: formData.start_date
        }
      });
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your membership? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Cancelling membership...');
      await api.post('/membership/cancel');
      alert('Membership cancelled successfully!');
      await fetchMembershipData(); // Refresh data
    } catch (error) {
      console.error('❌ Error cancelling membership:', error);
      setError('Failed to cancel membership. Please try again.');
    }
  };

  const calculateEndDate = (type, startDate) => {
    const start = new Date(startDate);
    switch(type) {
      case 'Daily Plan': 
        return new Date(start.setDate(start.getDate() + 1)).toISOString().split('T')[0];
      case 'Semi-Monthly Plan': 
        return new Date(start.setDate(start.getDate() + 15)).toISOString().split('T')[0];
      case 'Monthly Plan': 
        return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
      default: 
        return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
    }
  };

  // Format price with discount display
  const formatPriceDisplay = (plan) => {
    if (!plan) return null;
    
    const price = parseFloat(plan.price) || 0;
    const originalPrice = parseFloat(plan.original_price) || price;
    
    if (originalPrice > price) {
      return (
        <div className="text-center">
          <span className="text-2xl font-bold text-red-400">₱{price.toFixed(0)}</span>
          <span className="text-sm text-gray-400 ml-2 line-through">₱{originalPrice.toFixed(0)}</span>
          <div className="text-sm text-green-400 mt-1">{plan.discount || '0%'} OFF</div>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <span className="text-2xl font-bold text-red-400">
          ₱{price.toFixed(0)}<span className="text-sm text-gray-400">/{plan.billing_cycle || 'month'}</span>
        </span>
      </div>
    );
  };

  // Safely get features array
  const getFeatures = (plan) => {
    if (!plan) return [];
    return Array.isArray(plan.features) ? plan.features : [];
  };

  // Get selected plan details
  const getSelectedPlan = () => {
    return plans.find(plan => plan.type === formData.type);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading membership information...</p>
            <p className="text-gray-500 text-sm mt-2">Checking server connection</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const endDate = calculateEndDate(formData.type, formData.start_date);
  const selectedPlan = getSelectedPlan();
  const selectedPlanFeatures = getFeatures(selectedPlan);

  return (
    <UserLayout>
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Error Message - Only show critical errors */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-red-300 font-medium">{error}</p>
                <p className="text-red-400 text-sm mt-1">
                  If this persists, please check that the backend server is running on http://127.0.0.1:8000
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message - Show when plans loaded but membership not found */}
        {plans.length > 0 && !membership && !error && (
          <div className="mb-6 p-4 bg-blue-900/50 border border-blue-600 rounded-lg">
            <div className="flex items-center">
              <div className="text-blue-400 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-300 font-medium">No active membership found</p>
                <p className="text-blue-400 text-sm mt-1">
                  Select a plan below to start your FitSync membership journey!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">FitSync Membership</h1>
          <p className="text-gray-300">
            {membership ? 'Manage your current membership' : 'Choose your membership plan and proceed to payment'}
          </p>
        </div>

        {/* Membership Form */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {membership ? 'Update Membership' : 'Choose Membership Plan'}
            </h2>
          </div>
          
          <div className="p-6">
            {/* Membership Type */}
            <div className="mb-6">
              <label htmlFor="membership-type" className="block text-sm font-medium text-gray-300 mb-2">
                Membership Type
              </label>
              {plans.length > 0 ? (
                <select
                  id="membership-type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                >
                  {plans.map(plan => (
                    <option key={plan.type} value={plan.type} className="bg-gray-700">
                      {plan.name} - ₱{parseFloat(plan.price || 0).toFixed(0)}/{plan.billing_cycle || 'month'}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-red-400 p-2 bg-gray-700 rounded">
                  No membership plans available. Please contact support.
                </div>
              )}
            </div>

            {/* Selected Plan Preview */}
            {selectedPlan && (
              <div className="mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-3">Selected Plan</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-lg">{selectedPlan.name || selectedPlan.type}</h4>
                    <p className="text-gray-300">{selectedPlan.duration || 'Custom Duration'}</p>
                    {selectedPlanFeatures.length > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        Includes: {selectedPlanFeatures.slice(0, 2).join(', ')}
                        {selectedPlanFeatures.length > 2 && '...'}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 md:mt-0">
                    {formatPriceDisplay(selectedPlan)}
                  </div>
                </div>
              </div>
            )}

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
                  min={new Date().toISOString().split('T')[0]}
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
              <div className="flex space-x-4 ml-auto">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!formData.type}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:bg-red-400 transition-colors duration-200 border border-red-500 font-medium disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {membership ? 'Update Membership' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Membership Status */}
        {membership && (
          <div className="mb-8 bg-gray-800 rounded-xl border border-red-600/50 p-6">
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
                <p className="text-lg font-bold text-white">₱{membership.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Available Membership Plans */}
        {plans.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">
              {membership ? 'Available Membership Plans' : 'Choose Your Plan'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map(plan => {
                const planFeatures = getFeatures(plan);
                return (
                  <div 
                    key={plan.type}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.type === plan.type 
                        ? 'border-red-500 bg-red-500/10 transform scale-105 shadow-lg' 
                        : 'border-gray-600 bg-gray-750 hover:border-gray-500 hover:bg-gray-700'
                    } ${plan.is_popular ? 'ring-2 ring-red-400' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: plan.type }))}
                  >
                    {/* Popular Badge */}
                    {plan.is_popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-4">
                      <h4 className="font-bold text-white text-xl mb-2">{plan.name || plan.type}</h4>
                      <div className="mb-3">
                        {formatPriceDisplay(plan)}
                      </div>
                      <p className="text-gray-300 text-sm">{plan.duration || 'Custom Duration'}</p>
                    </div>

                    {/* Features */}
                    {planFeatures.length > 0 && (
                      <ul className="space-y-3 mb-6">
                        {planFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Select Button */}
                    <button
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        formData.type === plan.type
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {formData.type === plan.type ? 'Selected' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}