import React, { useState } from "react";
import Navbar from "../../components/navbar";
import "../../css/Membership.css";

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
    <div className="page">
      {/* Navbar (your existing component) */}
      <Navbar />

      {/* Main Membership Form */}
      <main className="main">
        <div className="form-container">
          <h2 className="heading"> FitSync Membership</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="membership-type">Membership Type</label>
              <select
                id="membership-type"
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
              >
                <option>Premium</option>
                <option>Yearly</option>
                <option>Quarterly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="date-row">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end-date">End Date (auto-calculated)</label>
                <input type="date" id="end-date" value={endDate} disabled />
              </div>
            </div>

            <div className="addons">
              <h3>Add-ons</h3>
              <label className="addon">
                <input
                  type="checkbox"
                  name="personalTrainer"
                  checked={addons.personalTrainer}
                  onChange={handleAddonChange}
                />
                <span>Personal Trainer</span>
              </label>

              <label className="addon">
                <input
                  type="checkbox"
                  name="groupClasses"
                  checked={addons.groupClasses}
                  onChange={handleAddonChange}
                />
                <span>Group Classes</span>
              </label>
            </div>

            <div className="actions">
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
