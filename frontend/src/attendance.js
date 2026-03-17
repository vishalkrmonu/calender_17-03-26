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

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    const res = await fetch(ENDPOINTS.GET_USERS);
    const data = await res.json();
    setUsers(data);
  };

  // =========================
  // FETCH ATTENDANCE
  // =========================

  const fetchAttendance = async () => {
    const res = await fetch(
      ENDPOINTS.GET_ATTENDANCE + `?year=${year}&month=${month+1}`
    );
    const data = await res.json();
    setAttendance(data);
  };

  // ✅ FIXED (disable eslint warning for deployment)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, [month, year]);

  // =========================
  // ADD USER
  // =========================

  const handleAddUser = async (e) => {
    e.preventDefault();

    await fetch(ENDPOINTS.ADD_USER,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username:username
      })
    });

    setUsername("");
    setShowAddEmployee(false);

    fetchUsers();
  };

  // =========================
  // DROPDOWN CHANGE
  // =========================

  const handleChange = (username,day,value) => {
    setAttendance(prev => ({
      ...prev,
      [username]:{
        ...prev[username],
        [day]:value
      }
    }));
  };

  // =========================
  // SUBMIT ATTENDANCE
  // =========================

  const handleSubmit = async () => {

    const payload = [];

    users.forEach(user => {
      days.forEach(day => {

        const status = attendance?.[user.username]?.[day];

        if(status){
          payload.push({
            username:user.username,
            date:`${year}-${month+1}-${day}`,
            status:status
          });
        }

      });
    });

    await fetch(ENDPOINTS.SUBMIT_ATTENDANCE,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
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

        {/* ADD USER FORM */}

        {showAddEmployee && (

          <form style={styles.addForm} onSubmit={handleAddUser}>

            <input
              style={styles.input}
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />

            <button style={styles.saveBtn} type="submit">
              Save
            </button>

          </form>

        )}

        {/* TABLE */}

        <div style={styles.tableWrapper}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>Username</th>

              {days.map(day=>(
                <th style={styles.th} key={day}>{day}</th>
              ))}

            </tr>

          </thead>

          <tbody>

            {users.map(user=>(
              
              <tr key={user.id}>

                <td style={styles.usernameCell}>
                  {user.username}
                </td>

                {days.map(day=>(

                  <td style={styles.td} key={day}>

                    <select
                      style={styles.dropdown}
                      value={attendance?.[user.username]?.[day] || ""}
                      onChange={(e)=>handleChange(user.username,day,e.target.value)}
                    >

                      <option value="">Select</option>

                      {statusOptions.map(status=>(
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}

                    </select>

                  </td>

                ))}

              </tr>

            ))}

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

const styles = {
  page:{
    background:"#f4f6fb",
    minHeight:"100vh",
    padding:"40px",
    fontFamily:"Arial"
  },
  card:{
    background:"white",
    padding:"25px",
    borderRadius:"10px",
    boxShadow:"0px 4px 12px rgba(0,0,0,0.1)"
  },
  header:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px"
  },
  title:{
    fontSize:"26px",
    fontWeight:"bold"
  },
  controls:{
    display:"flex",
    gap:"10px",
    alignItems:"center"
  },
  select:{
    padding:"7px",
    fontSize:"15px"
  },
  addBtn:{
    background:"#2f80ed",
    color:"white",
    border:"none",
    padding:"9px 15px",
    borderRadius:"5px",
    cursor:"pointer"
  },
  addForm:{
    marginBottom:"20px",
    display:"flex",
    gap:"10px"
  },
  input:{
    padding:"8px",
    fontSize:"15px"
  },
  saveBtn:{
    background:"#27ae60",
    color:"white",
    border:"none",
    padding:"8px 14px",
    borderRadius:"5px",
    cursor:"pointer"
  },
  tableWrapper:{
    overflowX:"auto"
  },
  table:{
    width:"100%",
    borderCollapse:"collapse"
  },
  th:{
    background:"#2f80ed",
    color:"white",
    padding:"8px"
  },
  td:{
    border:"1px solid #ddd",
    padding:"5px"
  },
  usernameCell:{
    border:"1px solid #ddd",
    padding:"8px",
    fontWeight:"bold"
  },
  dropdown:{
    padding:"5px",
    fontSize:"14px"
  },
  submitBtn:{
    marginTop:"20px",
    background:"#27ae60",
    color:"white",
    border:"none",
    padding:"10px 18px",
    borderRadius:"5px",
    fontSize:"16px",
    cursor:"pointer"
  }
};

export default Attendance;
