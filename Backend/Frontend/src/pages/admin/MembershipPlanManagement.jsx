import NavAdmin from "./NavAdmin";
import "../../css/MembershipPlanManagement.css";

export default function MembershipPlanManagement() {
  return (
    <>
    <NavAdmin />
    <main className="membership-container">
      <div className="content-wrapper">
        <div className="title-section">
          <div className="title-text">
            <h2>Membership Plans Management</h2>
            <p>Create, edit, and delete membership packages.</p>
          </div>
          <button className="create-btn">
            <span className="material-symbols-outlined">add</span> Create New Plan
          </button>
        </div>

        <div className="grid-container">
          {/* Left Side - Plans */}
          <div className="plans-section">
            {[
              { name: "Monthly", price: 59, members: 234 },
              { name: "Quarterly", price: 53, members: 158 },
              { name: "Yearly", price: 47, members: 421 },
            ].map((plan) => (
              <div key={plan.name} className="plan-card">
                <div className="plan-header">
                  <div>
                    <h4>{plan.name}</h4>
                    <span className="plan-price">
                      ${plan.price}
                      <span className="plan-period">/mo</span>
                    </span>
                  </div>
                  <div className="plan-actions">
                    <button className="icon-btn">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="icon-btn">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="plan-footer">
                  <p>
                    <span className="material-symbols-outlined group-icon">
                      group
                    </span>
                    {plan.members} Members
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Customize Perks */}
          <div className="perks-section">
            <h3>
              Customize Perks for <span className="highlight">Monthly</span> Plan
            </h3>

            <div className="perk-item">
              <input type="checkbox" id="personal-training" />
              <div className="perk-info">
                <label htmlFor="personal-training">
                  Personal Training Sessions
                </label>
                <p>Customize session frequency and cost.</p>
              </div>
              <div className="perk-inputs">
                <input type="number" defaultValue="1" />
                <span>/mo</span>
                <input type="text" defaultValue="$50" />
              </div>
            </div>

            <hr />

            <div className="perk-item">
              <input type="checkbox" id="group-class" defaultChecked />
              <div className="perk-info">
                <label htmlFor="group-class">Group Class Access</label>
                <p>Unlimited access.</p>
              </div>
              <div className="perk-inputs">
                <input type="text" defaultValue="$30" />
              </div>
            </div>

            <hr />

            <div className="perk-item">
              <input type="checkbox" id="nutrition" />
              <div className="perk-info">
                <label htmlFor="nutrition">Nutrition Consultation</label>
                <p>Customize session count.</p>
              </div>
              <div className="perk-inputs">
                <input type="number" defaultValue="1" />
                <span>session(s)</span>
                <input type="text" defaultValue="$75" />
              </div>
            </div>

            <hr />

            <div className="perk-item">
              <input type="checkbox" id="exclusive-access" />
              <div className="perk-info">
                <label htmlFor="exclusive-access">
                  Exclusive Gym Facilities Access
                </label>
                <p>Sauna, pool, etc.</p>
              </div>
              <div className="perk-inputs">
                <input type="text" defaultValue="$20" />
              </div>
            </div>

            <div className="save-container">
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
