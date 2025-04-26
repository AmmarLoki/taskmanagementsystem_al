// import React, { useEffect, useState } from "react";
// import { getTasks, deleteTask } from "../services/taskservice";
// import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
// import { Link } from "react-router-dom";

// const TaskListPage = () => {
//   const [tasks, setTasks] = useState([]);

//   const fetchTasks = async () => {
//     const data = await getTasks();
//     setTasks(data);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const handleDelete = async (id) => {
//     await deleteTask(id);
//     fetchTasks();
//   };

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ mt: 2 }}>
//         Task List
//       </Typography>
//       <Button variant="contained" component={Link} to="/new-task" sx={{ mt: 2 }}>
//         Create New Task
//       </Button>
//       <List>
//         {tasks.map((task) => (
//           <ListItem key={task.taskId} secondaryAction={
//             <Button variant="outlined" color="error" onClick={() => handleDelete(task.taskId)}>
//               Delete
//             </Button>
//           }>
//             <ListItemText
//               primary={task.taskName}
//               secondary={`Status: ${task.taskStatus.status} | Priority: ${task.priority} | Category: ${task.category}`}
//             />
//             <Button variant="outlined" component={Link} to={`/tasks/${task.taskId}`}>
//               View / Edit
//             </Button>
//           </ListItem>
//         ))}
//       </List>
//     </Container>
//   );
// };

// export default TaskListPage;


// import React, { useEffect, useState } from "react";
// import { getTasks, deleteTask } from "../services/taskservice";
// import { Container, Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import { Link } from "react-router-dom";

// const TaskListPage = () => {
//   const [tasks, setTasks] = useState([]);

//   const fetchTasks = async () => {
//     const data = await getTasks();
//     setTasks(data);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getTasks();
//       setTasks(data);
//     };
//     fetchData();
//   }, []);

//   const handleDelete = async (id) => {
//     await deleteTask(id);
//     fetchTasks();
//   };

//   return (
//     <Box sx={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar */}
//       <Box sx={{ width: 250, bgcolor: '#2c3e50', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
//         <Button variant="contained" component={Link} to="/new-task" sx={{ bgcolor: '#3498db', mb: 3 }}>
//           Create New Task
//         </Button>
//         <Button variant="outlined" sx={{ marginTop: 'auto', color: 'white' }} component={Link} to="/profile">
//           User Profile
//         </Button>
//       </Box>

//       {/* Main content */}
//       <Box sx={{ flex: 1, p: 3 }}>
//         <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '2px solid #3498db', pb: 1 }}>
//           Task List
//         </Typography>
        
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Task Name</TableCell>
//                 <TableCell>Assigned To</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tasks.map((task) => (
//                 <TableRow key={task.taskId}>
//                   <TableCell>{task.taskName}</TableCell>
//                   <TableCell>{task.assignedTo ? task.assignedTo.email : 'Not Assigned'}</TableCell>
//                   <TableCell>{task.taskStatus.status}</TableCell>
//                   <TableCell align="center">
//                     <Button variant="outlined" component={Link} to={`/tasks/${task.taskId}`} sx={{ mr: 1 }}>
//                       View/Edit
//                     </Button>
//                     <Button variant="outlined" color="error" onClick={() => handleDelete(task.taskId)}>
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };

// export default TaskListPage;


// src/pages/TaskListPage.js
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  CssBaseline,
} from "@mui/material";
import { AccountCircle, Assignment, Dashboard } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  getTasks,
  deleteTask,
  exportTasks,
  importTasks
} from "../services/taskservice";
import { getuserinfo } from "../services/authservice";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const TaskListPage = () => {
  const [tasks, setTasks]             = useState([]);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [importFile, setImportFile]   = useState(null);
  const [uploadPct, setUploadPct]     = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await getTasks(search, statusFilter);
    setTasks(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchData();
  };

  const handleExport = () => {
    exportTasks(search, statusFilter);
  };

  const handleImport = async () => {
    if (!importFile) return;
    const result = await importTasks(importFile, setUploadPct);
    alert(`Imported ${result.importedCount} tasks`);
    setUploadPct(0);
    setImportFile(null);
    fetchData();
  };

  useEffect(() => {
      (async () => {
        try {
          const profile = await getuserinfo();
          // Extract roleName from the role object
          const roleName =  profile.role;
          setUser({ ...profile, roleName });
        } catch {
          navigate("/login");
        }
      })();
    }, [navigate]);

    if (!user) {
        return (
          <Box
            sx={{
              display: "flex",
              minHeight: "100vh",
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(-45deg, #23d5ab, #ee7752, #e73c7e, #23a6d5)",
              backgroundSize: "400% 400%",
              animation: "gradientBG 15s ease infinite",
              "@keyframes gradientBG": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" }
              }
            }}
          >
            <Typography variant="h6" color="white">Loading...</Typography>
          </Box>
        );
      }
    
      const isAdmin = user.role?.toLowerCase() === "admin";

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
          <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(6px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Toolbar>
        <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
          <Assignment />
        </Avatar>
        <Typography variant="h6">TaskSync</Typography>
      </Toolbar>

      {/* Top Nav Items */}
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tasks">
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </ListItem>

        {/* Only show Dashboard link if the user is an admin */}
        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* Push Profile button to the bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom Profile Button */}
      <List sx={{ mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile">
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: 'linear-gradient(-45deg, #23a6d5, #23d5ab, #ee7752, #e73c7e)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite',
          minHeight: '100vh',
          '@keyframes gradientBG': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
              My Tasks
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            label="Search by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="outlined"
            sx={{ minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={e => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Pending</MenuItem>
              <MenuItem value="2">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={fetchData}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="outlined" component="label">
            Import CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={e => setImportFile(e.target.files[0])}
            />
          </Button>
          {importFile && (
            <Button variant="contained" onClick={handleImport}>
              Upload ({uploadPct}%)
            </Button>
          )}
          <Button
            variant="contained"
            component={Link}
            to="/new-task"
            sx={{ ml: 'auto' }}
          >
            + New Task
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}>Task Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Assigned To</TableCell>
                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                <TableCell align="right" sx={{ color: '#fff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => (
                <TableRow
                  key={task.taskId}
                  hover
                  sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  <TableCell>{task.taskName}</TableCell>
                  <TableCell>{task.assignedTo?.email || 'Unassigned'}</TableCell>
                  <TableCell>{task.taskStatus.status}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      component={Link}
                      to={`/tasks/${task.taskId}`}
                      sx={{ mr: 1 }}
                    >
                      View/Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(task.taskId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TaskListPage;

