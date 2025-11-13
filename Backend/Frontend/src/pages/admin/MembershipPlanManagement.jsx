import { FaPlus, FaEdit, FaTrash, FaStar, FaDumbbell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function MembershipPlanManagement() {
  const [plans, setPlans] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    duration: '',
    price: '',
    original_price: '',
    discount: '0%',
    perks: [],
    status: 'active'
  });

  const { staff: currentStaff, token } = useAuth();

  // Fetch membership plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8000/api/admin/membership-plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.data.plans) {
        setPlans(response.data.plans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      setError('Failed to load membership plans. Please try again.');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch plan types
  const fetchPlanTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/membership-plans/types', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setPlanTypes(response.data.types);
    } catch (error) {
      console.error('Error fetching plan types:', error);
      // Default types if API fails
      setPlanTypes(['Daily Plan', 'Semi-Monthly Plan', 'Monthly Plan', 'Premium', 'Quarterly', 'Yearly']);
    }
  };

  useEffect(() => {
    if (currentStaff?.role === 'Admin' && token) {
      fetchPlans();
      fetchPlanTypes();
    }
  }, [currentStaff, token]);

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      type: plan.type || '',
      duration: plan.duration || '',
      price: plan.price ? plan.price.toString() : '',
      original_price: plan.original_price ? plan.original_price.toString() : '',
      discount: plan.discount || '0%',
      perks: Array.isArray(plan.perks) ? plan.perks : [],
      status: plan.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/membership-plans/${planId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setPlans(plans.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleToggleStatus = async (planId) => {
    try {
      const plan = plans.find(p => p.id === planId);
      const newStatus = plan.status === 'active' ? 'inactive' : 'active';
      
      await axios.put(`http://localhost:8000/api/admin/membership-plans/${planId}`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      setPlans(plans.map(plan => 
        plan.id === planId 
          ? { ...plan, status: newStatus }
          : plan
      ));
    } catch (error) {
      console.error('Error updating plan status:', error);
      alert('Failed to update plan status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        name: formData.name,
        type: formData.type,
        duration: formData.duration,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : parseFloat(formData.price),
        discount: formData.discount,
        perks: formData.perks,
        status: formData.status
      };

      if (editingPlan) {
        // Update existing plan
        const response = await axios.put(`http://localhost:8000/api/admin/membership-plans/${editingPlan.id}`, planData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setPlans(plans.map(plan => plan.id === editingPlan.id ? response.data.plan : plan));
      } else {
        // Create new plan
        const response = await axios.post('http://localhost:8000/api/admin/membership-plans', planData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setPlans([...plans, response.data.plan]);
      }

      setShowModal(false);
      setEditingPlan(null);
      setFormData({
        name: '',
        type: '',
        duration: '',
        price: '',
        original_price: '',
        discount: '0%',
        perks: [],
        status: 'active'
      });
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPerk = () => {
    const newPerk = prompt('Enter a new perk:');
    if (newPerk && newPerk.trim()) {
      setFormData(prev => ({
        ...prev,
        perks: [...prev.perks, newPerk.trim()]
      }));
    }
  };

  const removePerk = (index) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₱${price.toFixed(0)}`;
    }
    if (typeof price === 'string') {
      return `₱${parseFloat(price).toFixed(0)}`;
    }
    return '₱0';
  };

  const stats = [
    { label: 'Total Plans', value: plans.length, color: 'blue' },
    { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, color: 'green' },
    { label: 'Total Members', value: plans.reduce((sum, plan) => sum + (plan.members || 0), 0), color: 'purple' },
    { 
      label: 'Avg. Price', 
      value: plans.length > 0 
        ? `₱${Math.round(plans.reduce((sum, plan) => sum + (plan.price || 0), 0) / plans.length)}` 
        : '₱0', 
      color: 'yellow' 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Membership Plans</h1>
          <p className="text-gray-300">Create, edit, and delete membership packages</p>
          <div className="flex items-center space-x-3 mt-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Admin Control
            </span>
            <span className="text-gray-400 text-sm">
              Welcome back, {currentStaff?.name}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchPlans}
              className="mt-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

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
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  stat.color === 'green' ? 'bg-green-500/20' :
                  stat.color === 'purple' ? 'bg-purple-500/20' :
                  'bg-yellow-500/20'
                } rounded-full flex items-center justify-center`}>
                  <FaDumbbell className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-yellow-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Header Actions */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Plan Management</h2>
              <p className="text-gray-400 text-sm">Manage all membership plans and pricing</p>
            </div>
            <button 
              onClick={() => {
                setEditingPlan(null);
                setFormData({
                  name: '',
                  type: '',
                  duration: '',
                  price: '',
                  original_price: '',
                  discount: '0%',
                  perks: [],
                  status: 'active'
                });
                setShowModal(true);
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 border border-red-500 flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Add New Plan
            </button>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Available Plans</h2>
          </div>

          <div className="overflow-x-auto">
            {plans.length === 0 ? (
              <div className="text-center py-12">
                <FaDumbbell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Plans Found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first membership plan.</p>
                <button 
                  onClick={() => {
                    setEditingPlan(null);
                    setFormData({
                      name: '',
                      type: '',
                      duration: '',
                      price: '',
                      original_price: '',
                      discount: '0%',
                      perks: [],
                      status: 'active'
                    });
                    setShowModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 border border-red-500 flex items-center gap-2 mx-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  Create First Plan
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PLAN NAME</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">TYPE</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">DURATION</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PRICE</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">MEMBERS</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">STATUS</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PERKS</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {plans.map((plan) => {
                    const displayPrice = formatPrice(plan.price);
                    const displayOriginalPrice = plan.original_price ? formatPrice(plan.original_price) : null;
                    
                    return (
                      <tr key={plan.id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              plan.type === 'Yearly' ? 'bg-yellow-500/20' :
                              plan.type === 'Quarterly' ? 'bg-blue-500/20' :
                              plan.type === 'Monthly Plan' ? 'bg-green-500/20' :
                              plan.type === 'Premium' ? 'bg-purple-500/20' :
                              'bg-gray-500/20'
                            }`}>
                              <FaStar className={`w-5 h-5 ${
                                plan.type === 'Yearly' ? 'text-yellow-400' :
                                plan.type === 'Quarterly' ? 'text-blue-400' :
                                plan.type === 'Monthly Plan' ? 'text-green-400' :
                                plan.type === 'Premium' ? 'text-purple-400' :
                                'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{plan.name}</p>
                              {plan.discount !== "0%" && plan.discount !== "0" && (
                                <p className="text-green-400 text-xs">Save {plan.discount}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{plan.type}</td>
                        <td className="px-4 py-3 text-gray-300">{plan.duration}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white font-semibold">{displayPrice}</p>
                            {displayOriginalPrice && displayOriginalPrice !== displayPrice && (
                              <p className="text-gray-400 text-sm line-through">{displayOriginalPrice}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">{plan.members || 0}</span>
                            <span className="text-gray-400 text-sm">members</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                            {getStatusText(plan.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1 max-w-xs">
                            {Array.isArray(plan.perks) && plan.perks.slice(0, 2).map((perk, i) => (
                              <div key={i} className="flex items-center space-x-2 text-sm">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span className="text-gray-300 truncate">{perk}</span>
                              </div>
                            ))}
                            {Array.isArray(plan.perks) && plan.perks.length > 2 && (
                              <span className="text-blue-400 text-xs">+{plan.perks.length - 2} more</span>
                            )}
                            {(!plan.perks || !Array.isArray(plan.perks) || plan.perks.length === 0) && (
                              <span className="text-gray-500 text-xs">No perks</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(plan)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                              title="Edit plan"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(plan.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                              title="Delete plan"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(plan.id)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                plan.status === 'active'
                                  ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                                  : 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                              }`}
                              title={plan.status === 'active' ? 'Deactivate plan' : 'Activate plan'}
                            >
                              {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal for Add/Edit Plan */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">
                  {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Enter plan name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plan Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select Plan Type</option>
                      {planTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                    <input 
                      type="text" 
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 30 Days"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price (₱)</label>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        placeholder="0"
                        step="1"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Original Price (₱)</label>
                      <input 
                        type="number" 
                        value={formData.original_price}
                        onChange={(e) => handleInputChange('original_price', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        placeholder="0"
                        step="1"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Perks</label>
                    <div className="space-y-2">
                      {formData.perks.map((perk, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg px-3 py-2">
                          <span className="text-white text-sm">{perk}</span>
                          <button
                            type="button"
                            onClick={() => removePerk(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPerk}
                        className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg text-sm transition-colors"
                      >
                        + Add Perk
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button 
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}