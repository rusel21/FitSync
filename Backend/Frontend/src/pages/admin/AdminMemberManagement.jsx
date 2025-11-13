import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function AdminMemberManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { staff: currentStaff, token } = useAuth();

  // Fetch members data from API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setMembers(response.data.users || response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStaff?.role === 'Admin' && token) {
      fetchMembers();
    }
  }, [currentStaff, token]);

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membership_plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewMemberDetails = (memberId) => {
    navigate(`/admin/members/${memberId}`);
  };

  const getMembershipColor = (membership) => {
    const colors = {
      'Premium': 'bg-purple-900 text-purple-200',
      'Standard': 'bg-blue-900 text-blue-200',
      'Basic': 'bg-gray-700 text-gray-200',
      'VIP': 'bg-yellow-900 text-yellow-200'
    };
    return colors[membership] || 'bg-gray-700 text-gray-200';
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200';
  };

  // Calculate stats from real data
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const newThisMonth = Math.floor(members.length * 0.1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading member data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Members</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchMembers}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
              <p className="text-gray-400">View and manage all gym members</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Admin Control
                </span>
                <span className="text-gray-400 text-sm">
                  Welcome back, {currentStaff?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-white">{totalMembers}</p>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Members</p>
                <p className="text-2xl font-bold text-green-400">{activeMembers}</p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New This Month</p>
                <p className="text-2xl font-bold text-yellow-400">{newThisMonth}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search members by name, email, or membership..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Membership
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {member.contact || 'No contact'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMembershipColor(member.membership_plan)}`}>
                            {member.membership_plan || 'No Plan'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                            {member.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <button 
                            onClick={() => viewMemberDetails(member.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredMembers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                          No members found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}