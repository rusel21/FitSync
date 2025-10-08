import axios from "axios";
import { useEffect, useState } from "react";
import NavStaff from "./NavStaff";
import "../../css/CheckInSystem.css";

export default function CheckInSystem() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/attendance");
      setMembers(res.data);
    } catch (err) {
      setMessage("Failed to fetch members");
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    if (!userId.trim()) return setMessage("Enter a user ID.");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/attendance/checkin", { user_id: userId });
      setMessage(res.data.message);
      setUserId("");
      fetchMembers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error checking in");
    }
  };

  const handleCheckOut = async () => {
    if (!selected) return setMessage("Select a member to check out.");
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/attendance/checkout/${selected}`);
      setMessage(res.data.message);
      setSelected(null);
      fetchMembers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error checking out");
    }
  };

  return (
    <>
      <NavStaff />
      <div className="checkin-container">
        <div className="left-panel">
          <h2>Check-in / <br /> Check-out</h2>
          <p>Enter user ID to check-in or select a member to check-out.</p>
          <input
            type="text"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <div className="buttons">
            <button className="checkin-btn" onClick={handleCheckIn}>Check-in</button>
            <button className="checkout-btn" onClick={handleCheckOut}>Check-out</button>
          </div>
          <p className="message">{message}</p>
        </div>

        <div className="right-panel">
          <h3>Checked-in Members</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className={selected === m.id ? "selected" : ""}
                  onClick={() => setSelected(m.id)}
                >
                  <td>{m.id}</td>
                  <td>{m.user_code || m.user_id}</td>
                  <td>{m.user_name || "-"}</td>
                  <td>{m.check_in ? new Date(m.check_in).toLocaleTimeString() : "-"}</td>
                  <td className={m.check_out ? "highlight" : ""}>
                    {m.check_out ? new Date(m.check_out).toLocaleTimeString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
