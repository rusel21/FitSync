import React from "react";
import "../../css/MembershipPlanManagement.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import NavAdmin from "./NavAdmin"; // ✅ import your existing sidebar

export default function MembershipPlanManagement() {
  const plans = [
    {
      name: "Monthly",
      duration: "30 Days",
      price: "$59",
      perks: ["Group Class Access", "Nutrition Consultation (1)"],
    },
    {
      name: "Quarterly",
      duration: "90 Days",
      price: "$159",
      perks: [
        "Personal Training (1/mo)",
        "Group Class Access",
        "Nutrition Consultation (3)",
      ],
    },
    {
      name: "Yearly",
      duration: "365 Days",
      price: "$564",
      perks: [
        "Personal Training (2/mo)",
        "Group Class Access",
        "Nutrition Consultation (12)",
        "Exclusive Facilities Access",
      ],
    },
  ];

  return (
    <div className="admin-layout">
      {/* ✅ Sidebar */}
      <NavAdmin />

      {/* ✅ Main Content */}
      <div className="membership-container">
        <div className="membership-header">
          <div>
            <h1>Membership Plans</h1>
            <p>Create, edit, and delete membership packages.</p>
          </div>
          <button className="add-btn">
            <FaPlus /> Add New Plan
          </button>
        </div>

        <table className="membership-table">
          <thead>
            <tr>
              <th>PLAN NAME</th>
              <th>DURATION</th>
              <th>PRICE</th>
              <th>PERKS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={index}>
                <td>{plan.name}</td>
                <td>{plan.duration}</td>
                <td>{plan.price}</td>
                <td>
                  {plan.perks.map((perk, i) => (
                    <div key={i}>{perk}</div>
                  ))}
                </td>
                <td className="actions">
                  <FaEdit className="edit-icon" />
                  <FaTrash className="delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
