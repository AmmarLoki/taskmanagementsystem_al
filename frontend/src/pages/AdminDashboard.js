// // pages/AdminDashboard.js

// import React, { useEffect, useState } from 'react';
// import { fetchTaskCounts } from '../services/taskservice';
// import TaskCountCard from '../components/Task/TaskCountCard';

// const AdminDashboard = () => {
//   const [overallTaskCounts, setOverallTaskCounts] = useState({
//     Completed: 0,
//     InProgress: 0,
//     Pending: 0,
//   });
//   const [userTaskCounts, setUserTaskCounts] = useState([]);

//   useEffect(() => {
//     const getTaskCounts = async () => {
//       try {
//         const { overall, user } = await fetchTaskCounts();
//         setOverallTaskCounts({
//           Completed: overall.completedCount,
//           InProgress: overall.inProgressCount,
//           Pending: overall.pendingCount,
//         });
//         setUserTaskCounts(user);
//       } catch (error) {
//         console.error('Failed to fetch task counts:', error);
//       }
//     };

//     getTaskCounts();
//   }, []);

//   return (
//     <div className="admin-dashboard">
//       <h2>Overall Task Counts</h2>
//       <div className="task-counts">
//         <TaskCountCard status="Completed" count={overallTaskCounts.Completed} />
//         <TaskCountCard status="InProgress" count={overallTaskCounts.InProgress} />
//         <TaskCountCard status="Pending" count={overallTaskCounts.Pending} />
//       </div>

//       <h2>User Task Counts</h2>
//       <div className="user-task-counts">
//         {userTaskCounts.map((userCount) => (
//           <div key={userCount.userId} className="user-task-count">
//             <h3>User ID: {userCount.userId}</h3>
//             <TaskCountCard status="Completed" count={userCount.completedCount} />
//             <TaskCountCard status="InProgress" count={userCount.inProgressCount} />
//             <TaskCountCard status="Pending" count={userCount.pendingCount} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


/* src/pages/AdminDashboard.jsx */
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Grid,
  Paper,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TaskCountCard from "../components/Task/TaskCountCard";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { fetchTaskCounts } from "../services/taskservice";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const COLORS = ["#4caf50", "#2196f3", "#ff9800"];

export default function AdminDashboard() {
  const [overall, setOverall] = useState({ Completed: 0, InProgress: 0, Pending: 0 });
  const [userCounts, setUserCounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { overall: o, user } = await fetchTaskCounts();
        setOverall({ Completed: o.completedCount, InProgress: o.inProgressCount, Pending: o.pendingCount });
        setUserCounts(user);
      } catch {
        console.error("Dashboard load error");
      }
    })();
  }, []);

  const pieData = Object.entries(overall).map(([name, value]) => ({ name, value }));
  const barData = userCounts.map(u => ({
    user: `User #${u.userId}`,
    Completed: u.completedCount,
    InProgress: u.inProgressCount,
    Pending: u.pendingCount
  }));

  return (
    <Box sx={{
      display: "flex",
      background: "linear-gradient(-45deg, #23a6d5, #23d5ab, #ee7752, #e73c7e)",
      backgroundSize: "400% 400%",
      animation: "gradientBG 15s ease infinite",
      "@keyframes gradientBG": {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" }
      }
    }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)"
          }
        }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
            <DashboardIcon />
          </Avatar>
          <Typography variant="h6">TaskSync</Typography>
        </Toolbar>
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/profile")}>
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
            <DashboardIcon />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
            Admin Dashboard
          </Typography>
        </Box>

        {/* Count Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {["Completed", "InProgress", "Pending"].map(status => (
            <Grid item xs={12} sm={4} key={status}>
              <TaskCountCard status={status} count={overall[status]} />
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={6}>
          {/* Pie Chart */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 2, height: 400, width: 600}}>
              <Typography variant="h6" gutterBottom>
                Overall Distribution Of Tasks
              </Typography>
              <ResponsiveContainer width="100%" height="90%" color="#0012ff">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 2, height: 400 , width: 600}}>
              <Typography variant="h6" gutterBottom>
                Per‑User Task Status
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="user" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Completed" barSize={20} fill={COLORS[0]} />
                  <Bar dataKey="InProgress" barSize={20} fill={COLORS[1]} />
                  <Bar dataKey="Pending" barSize={20} fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}



