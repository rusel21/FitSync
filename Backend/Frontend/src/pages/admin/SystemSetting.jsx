import NavAdmin from "./NavAdmin";
import "../../css/SystemSetting.css";

const SystemSettings = () => {
  return (
    <>
    <NavAdmin/>
    <div className="settings-container">
      {/* Header */}
      <h1>System Settings & Configuration</h1>

      {/* General Section */}
      <section>
        <h2>General</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Gym Name</label>
            <input type="text" placeholder="Enter gym name" />
          </div>
          <div className="form-group">
            <label>Gym Address</label>
            <input type="text" placeholder="Enter gym address" />
          </div>
        </div>

        <div className="form-group logo-upload">
          <label>Gym Logo</label>
          <div className="upload-row">
            <img
              src="https://via.placeholder.com/60"
              alt="Gym Logo"
              className="logo-preview"
            />
            <input type="file" />
          </div>
        </div>
      </section>

      {/* Payment Gateways Section */}
      <section>
        <h2>Payment Gateways</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Stripe Secret Key</label>
            <input type="password" placeholder="**************" />
          </div>
          <div className="form-group">
            <label>PayPal Client ID</label>
            <input type="password" placeholder="**************" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>GCash API Key</label>
            <input type="password" placeholder="**************" />
          </div>
          <div className="form-group">
            <label>PayMaya Secret Key</label>
            <input type="password" placeholder="**************" />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section>
        <h2>Security</h2>
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" placeholder="Enter current password" />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" />
        </div>
        <button className="orange-btn">Change Password</button>
      </section>

      {/* Database Section */}
      <section>
        <h2>Database</h2>
        <div className="button-group">
          <button className="gray-btn">Backup Database</button>
          <button className="gray-btn">Restore Database</button>
        </div>
      </section>

      <hr />

      {/* Save Button */}
      <div className="save-container">
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
    </>
  );
};

export default SystemSettings;
