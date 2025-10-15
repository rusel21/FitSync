import React, {  useState } from 'react';
import "../../css/AttendanceLogs.css";
import NavAdmin from './NavAdmin';

const AttendanceLogs = () => {
    const[seacrch,setsearch]=useState("");
    const[date,setDate]=useState("2024-07-29");

    const members=[{
        name:"Rex Felicio",
        checkIn:"9:00 AM",
        checkOut:"5:00 PM",
    },
    {
     name:"Darell Daigan",
        checkIn:"10:00 AM",
        checkOut:"6:00 PM",   
    },
    {
         name:"Marc Uy",
        checkIn:"11:00 AM",
        checkOut:"4:00 PM",   
    },
    
];

//Filter by search
const filtered=members.filter((m)=>
m.name.toLowerCase().includes(seacrch.toLowerCase())
);

return(
    <div>
    <NavAdmin/>
    <div className='attendance-container'>
        <div className='attendance-header'>
        <h1>Attendance Logs</h1>
        <p>View and manage daiy attendance records.</p>
        </div>
    </div>

    <div className='search-bar'>
        <input type="text" placeholder='Search by member name...' value={seacrch} onChange={(e)=>setsearch(e.target.value)}/>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
    </div>
    <table className='attendance-table'>
        <thead>
            <tr>
                <th>Member Name</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
            </tr>
        </thead>
        <tbody>
            {filtered.map((m,i)=>(
                <tr key ={i}>
                    <td>{m.name}</td>
                    <td>{m.checkIn}</td>
                    <td>{m.checkOut}</td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
);
};

export default AttendanceLogs;