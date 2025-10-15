import NavAdmin from "./NavAdmin";
import "../../css/RoleManagement.css";

const RoleManagement = () => {
  const roles = [
    {
      name: "Admin",
      description: "Full access to all features.",
      permissions: ["All"],
    },
    {
      name: "Staff",
      description: "Manage attendance and member information.",
      permissions: ["Attendance", "Members"],
    },
    {
      name: "Trainer",
      description: "Manage sessions and assigned members.",
      permissions: ["Sessions", "Assigned Members"],
    },
    {
      name: "Member",
      description: "View-only dashboard access.",
      permissions: ["Dashboard"],
    },
  ];

  return (
    <>
    <NavAdmin/>
    
    <div className="role-container">
      <div className="header">
        <div>
          <h1>Role Management & Access Control</h1>
          <p>Manage roles and permissions within the system.</p>
        </div>
        <button className="add-role">+ Add Role</button>
      </div>

      <table className="role-table">
        <thead>
          <tr>
            <th>ROLE NAME</th>
            <th>DESCRIPTION</th>
            <th>PERMISSIONS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={index}>
              <td className="bold">{role.name}</td>
              <td>{role.description}</td>
              <td>
                {role.permissions.map((perm, i) => (
                  <span key={i} className="badge">
                    {perm}
                  </span>
                ))}
              </td>
              <td>
                <button className="edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default RoleManagement;
