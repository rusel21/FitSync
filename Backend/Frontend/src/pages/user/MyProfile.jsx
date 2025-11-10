import { useState, useEffect } from 'react';
import UserLayout from './UserLayout';
import { getToken } from '../../utils/auth';
import api from '../../utils/axiosConfig';

export default function MyProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    gender: '',
    address: '',
    picture: '',
    membership_type: '',
    user_id: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    checkinsThisMonth: 0,
    workoutsCompleted: 0,
    attendanceRate: 0
  });

  // Check authentication and fetch data on component mount
  useEffect(() => {
    console.log('🚀 MyProfile component mounted');
    
    const initializeProfile = async () => {
      const token = getToken();
      console.log('🔑 Token from auth helper:', token);
      
      if (!token) {
        console.error('❌ No authentication token found');
        setLoading(false);
        return;
      }
      
      await fetchProfileData();
      await fetchUserStats();
    };

    initializeProfile();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = getToken();
      console.log('📡 Fetching profile with token:', token);
      
      if (!token) {
        console.error('❌ No token available for API call');
        setLoading(false);
        return;
      }

      // Using axiosConfig for API call
      const response = await api.get('/profile');
      console.log('✅ Profile data received:', response.data);
      
      const userData = response.data;
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        contact: userData.contact || '',
        gender: userData.gender || '',
        address: userData.address || '',
        picture: userData.picture || '',
        membership_type: userData.membership_type || '',
        user_id: userData.user_id || '',
      });
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      if (error.response) {
        console.error('📨 Error response:', error.response.data);
        console.error('📨 Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Using axiosConfig for API call
      const response = await api.get('/profile/dashboard');
      console.log('📊 Dashboard data received:', response.data);
      
      const dashboardData = response.data;
      setStats({
        checkinsThisMonth: dashboardData.stats?.checkins_this_month || 0,
        workoutsCompleted: dashboardData.stats?.workouts_completed || 0,
        attendanceRate: dashboardData.stats?.attendance_rate || 0
      });
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      if (error.response) {
        console.error('📨 Stats error response:', error.response.data);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = getToken();
      if (!token) {
        alert('❌ No authentication token found. Please login again.');
        return;
      }
      
      const updateData = {
        name: profile.name,
        contact: profile.contact,
        gender: profile.gender,
        address: profile.address,
      };

      console.log('💾 Saving profile data:', updateData);

      // Using axiosConfig for API call
      const response = await api.put('/profile', updateData);
      console.log('✅ Update response:', response.data);
      
      // Update profile with the returned user data
      if (response.data.user) {
        setProfile(prev => ({
          ...prev,
          ...response.data.user
        }));
      }
      alert('✅ Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      if (error.response) {
        console.error('📨 Update error response:', error.response.data);
        alert(`❌ Error: ${error.response.data.message || 'Failed to update profile'}`);
      } else {
        alert('❌ Error updating profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const token = getToken();
      if (!token) {
        alert('❌ No authentication token found. Please login again.');
        return;
      }

      const formData = new FormData();
      formData.append('picture', file);

      // Using axiosConfig for API call
      const response = await api.post('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Picture upload response:', response.data);
      
      setProfile(prev => ({ 
        ...prev, 
        picture: response.data.user?.picture || response.data.picture_url 
      }));
      alert('✅ Profile picture updated successfully!');
    } catch (error) {
      console.error('❌ Error uploading picture:', error);
      if (error.response) {
        console.error('📨 Picture upload error:', error.response.data);
        alert(`❌ Error: ${error.response.data.message || 'Failed to upload picture'}`);
      } else {
        alert('❌ Error uploading picture. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchProfileData(); // Reload original data
  };

  const getInitials = () => {
    if (!profile.name) return 'US';
    const names = profile.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return profile.name.substring(0, 2).toUpperCase();
  };

  const getProfilePictureUrl = () => {
    if (!profile.picture) return null;
    
    // If it's already a full URL, return as is
    if (profile.picture.startsWith('http')) {
      return profile.picture;
    }
    
    // If it's a storage path, construct the URL properly
    return `http://localhost:8000/storage/${profile.picture}`;
  };

  // Debug function
  const debugAuth = () => {
    console.log('🐛 DEBUG - getToken():', getToken());
    console.log('🐛 DEBUG - localStorage token:', localStorage.getItem('token'));
    console.log('🐛 DEBUG - localStorage role:', localStorage.getItem('role'));
    console.log('🐛 DEBUG - All localStorage:', localStorage);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading your profile...</p>
            <button 
              onClick={debugAuth}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors"
            >
              Debug Authentication
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your personal information and preferences</p>
          
          {/* Debug Section */}
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-blue-400 font-bold">Authentication Status</h3>
              <button 
                onClick={debugAuth}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-400 transition-colors"
              >
                Check Auth Status
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-blue-300">Token Status:</span> 
                <span className={`ml-2 ${getToken() ? 'text-green-400' : 'text-red-400'}`}>
                  {getToken() ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
              <div>
                <span className="text-blue-300">User Role:</span> 
                <span className="ml-2 text-blue-200">
                  {localStorage.getItem('role') || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-red-600/50 overflow-hidden">
                  {getProfilePictureUrl() ? (
                    <img 
                      src={getProfilePictureUrl()} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('❌ Image failed to load, showing initials');
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {getInitials()}
                    </span>
                  )}
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full cursor-pointer hover:bg-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePictureUpload}
                      />
                    </label>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{profile.name || 'No Name'}</h2>
                <p className="text-gray-400 text-sm">{profile.email || 'No Email'}</p>
                <div className="mt-2">
                  <span className="inline-block bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs font-medium border border-red-600/30">
                    {profile.membership_type || 'No Membership'}
                  </span>
                  <div className="text-gray-400 text-xs mt-1">ID: {profile.user_id || 'N/A'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                  <div className="text-2xl font-bold text-red-400 mb-1">{stats.checkinsThisMonth}</div>
                  <div className="text-gray-400 text-sm">Check-ins This Month</div>
                </div>
                <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                  <div className="text-2xl font-bold text-green-400 mb-1">{stats.workoutsCompleted}</div>
                  <div className="text-gray-400 text-sm">Workouts Completed</div>
                </div>
                <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-600">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{stats.attendanceRate}%</div>
                  <div className="text-gray-400 text-sm">Attendance Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl border border-red-600/50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-red-500"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-red-500 flex items-center space-x-2 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled={true}
                      className="w-full bg-gray-600 border border-gray-600 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Membership Type</label>
                    <input
                      type="text"
                      value={profile.membership_type || 'Not assigned'}
                      disabled={true}
                      className="w-full bg-gray-600 border border-gray-600 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}