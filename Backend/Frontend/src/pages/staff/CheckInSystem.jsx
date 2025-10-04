import { useState } from "react";
import NavStaff from "./NavStaff";
import "../../css/CheckInSystem.css";

export default function CheckInSystem() {
  const [members, setMembers] = useState([
    { id: 1, name: "Olivia Martinez", checkIn: "9:01 AM", checkOut: "-" },
    { id: 2, name: "Ethan Williams", checkIn: "9:03 AM", checkOut: "-" },
    { id: 3, name: "Sophia Brown", checkIn: "9:05 AM", checkOut: "10:15 AM" },
    { id: 4, name: "Liam Johnson", checkIn: "9:06 AM", checkOut: "-" },
    { id: 5, name: "Ava Garcia", checkIn: "9:10 AM", checkOut: "10:30 AM" },
    { id: 6, name: "Noah Miller", checkIn: "9:11 AM", checkOut: "-" },
  ]);

  const [selected, setSelected] = useState(null);
  const [guestName, setGuestName] = useState("");

  return (
    <>
      <NavStaff />
      <div className="checkin-container">
        {/* Left Panel */}
        <div className="left-panel">
          <h2>
            Check-in / <br /> Check-out
          </h2>
          <p>
            Enter the guest's name or ID to check them in or select a checked-in
            member to check them out.
          </p>
          <input
            type="text"
            placeholder="Enter guest name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <div className="buttons">
            <button className="checkin-btn">Check-in</button>
            <button className="checkout-btn">Check-out</button>
          </div>
          <p className="message">
            Confirmation or error message will appear here.
          </p>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h3>Checked-in Members</h3>
          <table>
            <thead>
              <tr className="table-header">
                <th>Member</th>
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
                  <td>
                    <input
                      type="radio"
                      name="member"
                      checked={selected === m.id}
                      readOnly
                    />
                    <span className="member-name">{m.name}</span>
                  </td>
                  <td className="time">{m.checkIn}</td>
                  <td
                    className={`time ${m.checkOut !== "-" ? "highlight" : ""}`}
                  >
                    {m.checkOut}
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
