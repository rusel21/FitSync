import React from "react";
import Navbar from "../../components/navbar";
import "./../../css/Membership.css";

export default function Membership() {
  return (
    <div className="membership-page">
      <Navbar />
      <Header />
      <main className="main-content">
        <PageTitle title="Membership Dashboard" />

        <Section title="Active Memberships" action="See All">
          <MembershipTable
            columns={["Name", "Type", "Start", "End", "Status", "Action"]}
            data={[
              { name: "Sophia Clark", type: "Premium", start: "2023-01-15", end: "2024-01-14", status: "Active" },
              { name: "Ethan Carter", type: "Standard", start: "2023-03-20", end: "2024-03-19", status: "Active" },
              { name: "Olivia Bennett", type: "Basic", start: "2023-05-10", end: "2024-05-09", status: "Active" },
            ]}
            actionLabel="Renew"
          />
        </Section>

        <div className="grid-sections">
          <Section title="Expired Memberships" action="Manage">
            <MembershipTable
              columns={["Name", "End", "Action"]}
              data={[
                { name: "Liam Davis", end: "2023-11-30" },
                { name: "Ava Foster", end: "2023-10-14" },
              ]}
              actionLabel="Reactivate"
            />
          </Section>

          <Section title="Upcoming Renewals" action="Reminders">
            <MembershipTable
              columns={["Name", "Renewal", "Action"]}
              data={[
                { name: "Noah Harper", renewal: "2024-01-20" },
                { name: "Isabella Green", renewal: "2024-02-15" },
              ]}
              actionLabel="Remind"
            />
          </Section>
        </div>

        <Section title="Recent Attendance" action="View All">
          <MembershipTable
            columns={["Name", "Check-In", "Check-Out", "Duration"]}
            data={[
              { name: "Lucas Hayes", checkIn: "2023-12-01 09:00", checkOut: "2023-12-01 11:00", duration: "2h" },
              { name: "Mia Ingram", checkIn: "2023-12-01 10:30", checkOut: "2023-12-01 12:30", duration: "2h" },
              { name: "Jackson Reed", checkIn: "2023-12-01 11:00", checkOut: "2023-12-01 13:00", duration: "2h" },
            ]}
          />
        </Section>
      </main>
    </div>
  );
}

/* ====== Components ====== */

const Header = () => (
  <header className="header">
    <div className="header-inner">
      <Logo />
      <NavLinks />
      <ProfileAvatar />
    </div>
  </header>
);

const Logo = () => (
  <div className="logo">
    <svg className="logo-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
        fill="currentColor"
      />
    </svg>
    <h1 className="logo-text">FitSync MemberHub</h1>
  </div>
);

const NavLinks = () => (
  <nav className="nav">
    {["Dashboard", "Memberships"].map((link, i) => (
      <a key={i} href="#" className={link === "Memberships" ? "active" : ""}>
        {link}
      </a>
    ))}
  </nav>
);

const ProfileAvatar = () => (
  <div
    className="profile-avatar"
    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/...')" }}
  />
);

const PageTitle = ({ title }) => <h2 className="page-title">{title}</h2>;

/* ===== Section with Opposite Header ===== */
const Section = ({ title, children, action }) => (
  <section className="section">
    <div className="section-header">
      <h3>{title}</h3>
      {action && <span className="section-action">{action}</span>}
    </div>
    {children}
  </section>
);

const MembershipTable = ({ columns, data, actionLabel }) => (
  <table className="table">
    <thead>
      <tr>{columns.map((col, i) => <th key={i}>{col}</th>)}</tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx}>
          {columns.includes("Name") && <td>{row.name}</td>}
          {columns.includes("Type") && <td>{row.type}</td>}
          {columns.includes("Start") && <td>{row.start}</td>}
          {columns.includes("End") && <td>{row.end}</td>}
          {columns.includes("Renewal") && <td>{row.renewal}</td>}
          {columns.includes("Check-In") && <td>{row.checkIn}</td>}
          {columns.includes("Check-Out") && <td>{row.checkOut}</td>}
          {columns.includes("Duration") && <td>{row.duration}</td>}
          {columns.includes("Status") && <td><span className="badge">{row.status}</span></td>}
          {columns.includes("Action") && <td>{actionLabel && <a href="#">{actionLabel}</a>}</td>}
        </tr>
      ))}
    </tbody>
  </table>
);
