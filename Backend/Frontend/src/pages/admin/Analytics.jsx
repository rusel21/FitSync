import NavAdmin from "./NavAdmin";
import "../../css/Analytics.css";

const Analytics = () => {
  return (
    <>
   <NavAdmin/>
    <div className="dashboard">
      <h1 className="title">Admin Analytics & Reports Dashboard</h1>
      

      <div className="grid-container">
        {/* Revenue per Month */}
        <div className="card">
          <h3>Revenue per Month</h3>
          <h1 className="highlight">$12,500</h1>
          <p className="muted">
            Last 12 Months <span className="increase">↑15%</span>
          </p>
          <div className="line-chart">
            <svg width="100%" height="100" viewBox="0 0 300 100">
              <path
                d="M0,60 C50,40 100,50 150,30 C200,60 250,20 300,50"
                fill="none"
                stroke="#ff7a00"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Active vs Inactive Members */}
        <div className="card">
          <h3>Active vs Inactive Members</h3>
          <h1 className="highlight">85%</h1>
          <p className="muted">
            Current <span className="decrease">↓5%</span>
          </p>
          <div className="status-bar">
            <div className="active"></div>
            <div className="inactive"></div>
          </div>
          <div className="legend">
            <span>Active</span>
            <span>Inactive</span>
          </div>
        </div>

        {/* Attendance Trends */}
        <div className="card">
          <h3>Attendance Trends</h3>
          <h1 className="highlight">72%</h1>
          <p className="muted">
            Last 30 Days <span className="increase">↑10%</span>
          </p>
          <div className="bar-chart">
            <div className="bar" style={{ height: "40%" }}></div>
            <div className="bar" style={{ height: "60%" }}></div>
            <div className="bar" style={{ height: "55%" }}></div>
            <div className="bar" style={{ height: "50%" }}></div>
            <div className="bar" style={{ height: "80%" }}></div>
            <div className="bar" style={{ height: "45%" }}></div>
            <div className="bar" style={{ height: "35%" }}></div>
          </div>
          <div className="days">
            <span>Mon</span><span>Tue</span><span>Wed</span>
            <span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Popular Membership Plan */}
        <div className="card">
          <h3>Popular Membership Plan</h3>
          <h2 className="highlight-orange">Premium</h2>
          <p className="muted">
            45% of members <span className="increase">↑8%</span>
          </p>
          <div className="progress-container">
            <div className="label">
              <span>Premium</span><span>45%</span>
            </div>
            <div className="progress">
              <div className="bar orange" style={{ width: "45%" }}></div>
            </div>

            <div className="label">
              <span>Basic</span><span>30%</span>
            </div>
            <div className="progress">
              <div className="bar orange" style={{ width: "30%" }}></div>
            </div>

            <div className="label">
              <span>VIP</span><span>15%</span>
            </div>
            <div className="progress">
              <div className="bar orange" style={{ width: "15%" }}></div>
            </div>

            <div className="label">
              <span>Trial</span><span>10%</span>
            </div>
            <div className="progress">
              <div className="bar orange" style={{ width: "10%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
     </>
  );
};

export default Analytics;
