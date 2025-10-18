import NavAdmin from "./NavAdmin";
import '../../css/AdminDashboard.css';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Active Members', value: 250, icon: '👥' },
    { title: 'Revenue (This Month)', value: '$15,000', icon: '💰' },
    { title: 'Check-ins Today', value: 75, icon: '🕒' },
    { title: 'Active Plans', value: 5, icon: '📋' },
    { title: 'Pending Renewals', value: 12, icon: '🔄' },
  ];

  const members = [
    { name: 'Sophia Clark', plan: 'Premium', date: '2024-07-15', status: 'Expiring Soon' },
    { name: 'Ethan Carter', plan: 'Standard', date: '2024-07-20', status: 'Active' },
    { name: 'Olivia Bennett', plan: 'Basic', date: '2024-07-25', status: 'Expiring Soon' },
    { name: 'Liam Foster', plan: 'Premium', date: '2024-08-01', status: 'Active' },
    { name: 'Ava Hughes', plan: 'Standard', date: '2024-08-05', status: 'Active' },
  ];

  return (
    <div className="dashboard">
        <NavAdmin/>
      <h1>Admin Dashboard Overview</h1>
      <p className="subtitle">A full-width display of key gym statistics.</p>

      <div className="cards">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="icon">{stat.icon}</div>
            <div>
              <p className="card-title">{stat.title}</p>
              <h2 className="card-value">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Pending Renewals / Expiring Memberships</h2>

      <table className="members-table">
        <thead>
          <tr>
            <th>MEMBER NAME</th>
            <th>MEMBERSHIP PLAN</th>
            <th>EXPIRY DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, i) => (
            <tr key={i}>
              <td>{member.name}</td>
              <td>{member.plan}</td>
              <td>{member.date}</td>
              <td>
                <span className={`status ${member.status === 'Active' ? 'active' : 'expiring'}`}>
                  {member.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;


  