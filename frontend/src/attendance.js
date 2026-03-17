import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "./endpoints";

function Attendance() {

  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [username, setUsername] = useState("");

  const statusOptions = ["Full Day","Half Day","Holiday","Leave"];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const years = [2024,2025,2026,2027,2028];

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await fetch(ENDPOINTS.GET_USERS);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH ATTENDANCE =================
  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        `${ENDPOINTS.GET_ATTENDANCE}?year=${year}&month=${month+1}`
      );
      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, [month, year]);

  // ================= ADD USER =================
  const handleAddUser = async (e) => {
    e.preventDefault();

    await fetch(ENDPOINTS.ADD_USER,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ username })
    });

    setUsername("");
    setShowAddEmployee(false);
    fetchUsers();
  };

  // ================= CHANGE =================
  const handleChange = (username,day,value) => {
    setAttendance(prev => ({
      ...prev,
      [username]:{
        ...prev[username],
        [day]:value
      }
    }));
  };

  // ================= COUNT =================
  const getCounts = (username) => {
    const data = attendance?.[username] || {};

    let counts = {
      "Full Day":0,
      "Half Day":0,
      "Holiday":0,
      "Leave":0
    };

    Object.values(data).forEach(status=>{
      if(counts[status] !== undefined){
        counts[status]++;
      }
    });

    return counts;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    const payload = [];

    users.forEach(user => {
      days.forEach(day => {
        const status = attendance?.[user.username]?.[day];

        if(status){
          payload.push({
            username:user.username,
            date:`${year}-${month+1}-${day}`,
            status
          });
        }
      });
    });

    await fetch(ENDPOINTS.SUBMIT_ATTENDANCE,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    });

    alert("Attendance submitted");
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>

          <h2 style={styles.title}>Employee Attendance</h2>

          <div style={styles.controls}>

            <select
              style={styles.select}
              value={month}
              onChange={(e)=>setMonth(parseInt(e.target.value))}
            >
              {months.map((m,i)=>(
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <select
              style={styles.select}
              value={year}
              onChange={(e)=>setYear(parseInt(e.target.value))}
            >
              {years.map(y=>(
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <button 
              style={styles.addBtn}
              onClick={()=>setShowAddEmployee(true)}
            >
              + Add Employee
            </button>

          </div>

        </div>

        {/* ADD USER */}
        {showAddEmployee && (
          <form style={styles.addForm} onSubmit={handleAddUser}>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <button style={styles.saveBtn}>Save</button>
          </form>
        )}

        {/* TABLE */}
        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>Username</th>

                {days.map(day=>(
                  <th key={day} style={styles.th}>{day}</th>
                ))}

                <th style={styles.th}>Full</th>
                <th style={styles.th}>Half</th>
                <th style={styles.th}>Holiday</th>
                <th style={styles.th}>Leave</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user=>{

                const counts = getCounts(user.username);

                return (
                  <tr key={user.id}>

                    <td style={styles.usernameCell}>
                      {user.username}
                    </td>

                    {days.map(day=>(
                      <td key={day} style={styles.td}>
                        <select
                          style={styles.dropdown}
                          value={attendance?.[user.username]?.[day] || ""}
                          onChange={(e)=>handleChange(user.username,day,e.target.value)}
                        >
                          <option value="">-</option>
                          {statusOptions.map(status=>(
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    ))}

                    <td style={styles.total}>{counts["Full Day"]}</td>
                    <td style={styles.total}>{counts["Half Day"]}</td>
                    <td style={styles.total}>{counts["Holiday"]}</td>
                    <td style={styles.total}>{counts["Leave"]}</td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>

        <button style={styles.submitBtn} onClick={handleSubmit}>
          Submit Attendance
        </button>

      </div>
    </div>
  );
}

// ================= STYLES =================

const styles = {
  page:{
    background:"#f4f6fb",
    minHeight:"100vh",
    padding:"20px",
    fontFamily:"Arial"
  },

  card:{
    background:"white",
    padding:"20px",
    borderRadius:"10px",
    boxShadow:"0px 4px 12px rgba(0,0,0,0.1)"
  },

  header:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    flexWrap:"wrap",
    gap:"12px",
    marginBottom:"20px"
  },

  title:{
    fontSize:"24px",
    fontWeight:"bold"
  },

  controls:{
    display:"flex",
    alignItems:"center",
    gap:"10px",
    flexWrap:"wrap"
  },

  select:{
    padding:"6px 10px",
    fontSize:"14px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    minWidth:"110px"
  },

  addBtn:{
    background:"#2f80ed",
    color:"white",
    border:"none",
    padding:"8px 14px",
    fontSize:"14px",
    borderRadius:"6px",
    cursor:"pointer"
  },

  addForm:{
    marginBottom:"15px",
    display:"flex",
    gap:"10px",
    flexWrap:"wrap"
  },

  input:{
    padding:"7px",
    fontSize:"14px"
  },

  saveBtn:{
    background:"#27ae60",
    color:"white",
    border:"none",
    padding:"7px 12px",
    borderRadius:"5px"
  },

  tableWrapper:{
    overflowX:"auto"
  },

  table:{
    minWidth:"1100px",
    borderCollapse:"collapse"
  },

  th:{
    background:"#2f80ed",
    color:"white",
    padding:"7px",
    fontSize:"14px"
  },

  td:{
    border:"1px solid #ddd",
    padding:"5px"
  },

  usernameCell:{
    fontWeight:"bold",
    padding:"7px",
    border:"1px solid #ddd"
  },

  dropdown:{
    fontSize:"13px",
    padding:"4px"
  },

  total:{
    background:"#f1f1f1",
    fontWeight:"bold",
    textAlign:"center"
  },

  submitBtn:{
    marginTop:"20px",
    background:"#27ae60",
    color:"white",
    border:"none",
    padding:"10px 16px",
    fontSize:"16px",
    borderRadius:"5px"
  }
};

export default Attendance;
