import { useState } from "react";
import { 
  FaSave, 
  FaUpload, 
  FaDownload, 
  FaKey, 
  FaDatabase, 
  FaCreditCard, 
  FaCog 
} from "react-icons/fa";
import AdminLayout from "./AdminLayout";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    gymName: "FitSync Gym",
    gymAddress: "123 Fitness Street, Metro Manila",
    contactEmail: "admin@fitsync.com",
    contactPhone: "+63 912 345 6789",
    businessHours: "5:00 AM - 10:00 PM",
    
    // Payment Gateways
    stripeSecretKey: "sk_live_************",
    stripePublicKey: "pk_live_************",
    paypalClientId: "**************",
    paypalSecret: "**************",
    gcashApiKey: "gc_************",
    paymayaSecretKey: "sk_************",
    
    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: true,
    sessionTimeout: 30,
    
    // System
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    emailNotifications: true
  });

  const [activeTab, setActiveTab] = useState("general");
  const [logoPreview, setLogoPreview] = useState("https://via.placeholder.com/60");
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    alert("Settings saved successfully!");
  };

  const handleBackupDatabase = () => {
    alert("Database backup initiated. You will receive a notification when complete.");
  };

  const handleRestoreDatabase = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.sql,.backup';
    fileInput.onchange = (e) => {
      alert("Database restore process started...");
    };
    fileInput.click();
  };

  const handleChangePassword = () => {
    if (!settings.currentPassword) {
      alert("Please enter your current password");
      return;
    }
    if (settings.newPassword !== settings.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    alert("Password changed successfully!");
    setSettings(prev => ({ 
      ...prev, 
      currentPassword: "", 
      newPassword: "", 
      confirmPassword: "" 
    }));
  };

  const tabs = [
    { id: "general", name: "General", icon: FaCog },
    { id: "payment", name: "Payment", icon: FaCreditCard },
    { id: "security", name: "Security", icon: FaKey },
    { id: "database", name: "Database", icon: FaDatabase }
  ];

  return (
    <AdminLayout>
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">System Settings & Configuration</h1>
          <p className="text-gray-300">Manage your gym's system settings and preferences</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "border-red-500 text-red-400 bg-red-500/10"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-750"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium whitespace-nowrap">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gym Name</label>
                    <input
                      type="text"
                      value={settings.gymName}
                      onChange={(e) => handleInputChange("gymName", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gym Address</label>
                    <input
                      type="text"
                      value={settings.gymAddress}
                      onChange={(e) => handleInputChange("gymAddress", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Business Hours</label>
                    <input
                      type="text"
                      value={settings.businessHours}
                      onChange={(e) => handleInputChange("businessHours", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Gym Logo</label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={logoPreview}
                      alt="Gym Logo"
                      className="w-16 h-16 rounded-lg border border-gray-600 object-cover"
                    />
                    <div className="flex-1">
                      <label className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 border border-gray-600 inline-flex items-center space-x-2">
                        <FaUpload className="w-4 h-4" />
                        <span>Upload New Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-gray-400 text-sm mt-2">Recommended: 200x200px PNG or JPG</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Gateways */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Payment Gateways</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stripe Secret Key</label>
                    <input
                      type="password"
                      value={settings.stripeSecretKey}
                      onChange={(e) => handleInputChange("stripeSecretKey", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stripe Public Key</label>
                    <input
                      type="password"
                      value={settings.stripePublicKey}
                      onChange={(e) => handleInputChange("stripePublicKey", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">PayPal Client ID</label>
                    <input
                      type="password"
                      value={settings.paypalClientId}
                      onChange={(e) => handleInputChange("paypalClientId", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">PayPal Secret</label>
                    <input
                      type="password"
                      value={settings.paypalSecret}
                      onChange={(e) => handleInputChange("paypalSecret", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GCash API Key</label>
                    <input
                      type="password"
                      value={settings.gcashApiKey}
                      onChange={(e) => handleInputChange("gcashApiKey", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">PayMaya Secret Key</label>
                    <input
                      type="password"
                      value={settings.paymayaSecretKey}
                      onChange={(e) => handleInputChange("paymayaSecretKey", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">Payment Gateway Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Stripe: Connected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">GCash: Connected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-300">PayPal: Needs Setup</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={settings.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={settings.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={settings.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleChangePassword}
                      className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors duration-200 border border-red-500 flex items-center space-x-2"
                    >
                      <FaKey className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Security Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Enable Two-Factor Authentication</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Email Security Notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Database Settings */}
            {activeTab === "database" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Database Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-750 rounded-lg p-6 border border-gray-600">
                    <FaDownload className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Backup Database</h3>
                    <p className="text-gray-400 text-sm mb-4">Create a full backup of your system data</p>
                    <button
                      onClick={handleBackupDatabase}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-blue-500 w-full"
                    >
                      Backup Now
                    </button>
                  </div>
                  
                  <div className="bg-gray-750 rounded-lg p-6 border border-gray-600">
                    <FaUpload className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Restore Database</h3>
                    <p className="text-gray-400 text-sm mb-4">Restore system from a backup file</p>
                    <button
                      onClick={handleRestoreDatabase}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-green-500 w-full"
                    >
                      Restore Backup
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Automated Backups</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleInputChange("autoBackup", e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Enable Automatic Backups</span>
                    </label>
                    
                    <div className="flex items-center space-x-4">
                      <label className="text-gray-300 text-sm">Backup Frequency:</label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-red-500 flex items-center space-x-2 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;