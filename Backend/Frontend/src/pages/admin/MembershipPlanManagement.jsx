import { FaPlus, FaEdit, FaTrash, FaStar, FaDumbbell, FaAppleAlt, FaHome } from "react-icons/fa";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function MembershipPlanManagement() {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Monthly",
      duration: "30 Days",
      price: "$59",
      originalPrice: "$59",
      discount: "0%",
      perks: ["Group Class Access", "Nutrition Consultation (1)", "Basic Gym Access"],
      status: "active",
      members: 45
    },
    {
      id: 2,
      name: "Quarterly",
      duration: "90 Days",
      price: "$159",
      originalPrice: "$177",
      discount: "10%",
      perks: [
        "Personal Training (1/mo)",
        "Group Class Access",
        "Nutrition Consultation (3)",
        "Premium Gym Access"
      ],
      status: "active",
      members: 28
    },
    {
      id: 3,
      name: "Yearly",
      duration: "365 Days",
      price: "$564",
      originalPrice: "$708",
      discount: "20%",
      perks: [
        "Personal Training (2/mo)",
        "Group Class Access",
        "Nutrition Consultation (12)",
        "Exclusive Facilities Access",
        "Priority Booking"
      ],
      status: "active",
      members: 15
    },
    {
      id: 4,
      name: "Basic",
      duration: "30 Days",
      price: "$39",
      originalPrice: "$39",
      discount: "0%",
      perks: ["Basic Gym Access", "Locker Usage"],
      status: "inactive",
      members: 12
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDelete = (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(plan => plan.id !== planId));
    }
  };

  const handleToggleStatus = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: plan.status === 'active' ? 'inactive' : 'active' }
        : plan
    ));
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const stats = [
    { label: 'Total Plans', value: plans.length, color: 'blue' },
    { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, color: 'green' },
    { label: 'Total Members', value: plans.reduce((sum, plan) => sum + plan.members, 0), color: 'purple' },
    { label: 'Avg. Price', value: '$200', color: 'yellow' }
  ];

  return (
   // <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Membership Plans</h1>
          <p className="text-gray-300">Create, edit, and delete membership packages</p>
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
              onClick={() => setShowModal(true)}
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
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PLAN NAME</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">DURATION</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PRICE</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">MEMBERS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">STATUS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PERKS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          plan.name === 'Yearly' ? 'bg-yellow-500/20' :
                          plan.name === 'Quarterly' ? 'bg-blue-500/20' :
                          plan.name === 'Monthly' ? 'bg-green-500/20' :
                          'bg-gray-500/20'
                        }`}>
                          <FaStar className={`w-5 h-5 ${
                            plan.name === 'Yearly' ? 'text-yellow-400' :
                            plan.name === 'Quarterly' ? 'text-blue-400' :
                            plan.name === 'Monthly' ? 'text-green-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{plan.name}</p>
                          {plan.discount !== "0%" && (
                            <p className="text-green-400 text-xs">Save {plan.discount}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{plan.duration}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-semibold">{plan.price}</p>
                        {plan.originalPrice !== plan.price && (
                          <p className="text-gray-400 text-sm line-through">{plan.originalPrice}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{plan.members}</span>
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
                        {plan.perks.slice(0, 2).map((perk, i) => (
                          <div key={i} className="flex items-center space-x-2 text-sm">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span className="text-gray-300 truncate">{perk}</span>
                          </div>
                        ))}
                        {plan.perks.length > 2 && (
                          <span className="text-blue-400 text-xs">+{plan.perks.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
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
                        >
                          {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <FaDumbbell className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" />
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Plan Analytics</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <FaAppleAlt className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" />
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Pricing Strategy</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-750 border border-gray-600 rounded-lg p-4 text-center transition-colors duration-200 group">
            <FaHome className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:text-red-300 transition-colors" />
            <span className="text-white text-sm group-hover:text-gray-200 transition-colors">Plan Templates</span>
          </button>
        </div>

        {/* Modal for Add/Edit Plan */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">
                  {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="Enter plan name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 30 Days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="$0.00"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-500">
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
   // </AdminLayout>
  );
}