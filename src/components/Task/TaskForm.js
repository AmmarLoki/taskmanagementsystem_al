// import React, { useState, useEffect } from "react";
// import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography } from "@mui/material";

// const TaskForm = ({ onSubmit, initialData = {} }) => {
//   const [taskName, setTaskName] = useState(initialData.taskName || "");
//   const [taskStatusId, setTaskStatusId] = useState(initialData.taskStatusId || "");
//   const [createdById, setCreatedById] = useState(initialData.createdById || "");
//   const [assignedToId, setAssignedToId] = useState(initialData.assignedToId || "");
//   const [priority, setPriority] = useState(initialData.priority || "");
//   const [category, setCategory] = useState(initialData.category || "");
//   const [taskCompletionDate, setTaskCompletionDate] = useState(initialData.taskCompletionDate || "");
  
//   // State to hold the dynamically fetched options
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);

//   useEffect(() => {
//     // Fetch task statuses from backend
//     const fetchTaskStatuses = async () => {
//       const response = await fetch('/api/taskstatus');
//       const data = await response.json();
//       setStatusOptions(data);
//     };

//     // Fetch users from backend
//     const fetchUsers = async () => {
//       const response = await fetch('/api/users');
//       const data = await response.json();
//       setUserOptions(data);
//     };

//     fetchTaskStatuses();
//     fetchUsers();
//   }, []);

//   const priorityOptions = ["Low", "Medium", "High"];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({
//       taskName,
//       taskStatusId: parseInt(taskStatusId),
//       createdById: parseInt(createdById),
//       assignedToId: assignedToId ? parseInt(assignedToId) : null,
//       priority,
//       category,
//       taskCompletionDate: taskCompletionDate ? new Date(taskCompletionDate) : null,
//     });
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//       <Typography variant="h6">Task Form</Typography>
//       <TextField
//         fullWidth
//         margin="normal"
//         label="Task Name"
//         value={taskName}
//         onChange={(e) => setTaskName(e.target.value)}
//         required
//       />
//       <FormControl fullWidth margin="normal" required>
//         <InputLabel id="status-label">Status</InputLabel>
//         <Select
//           labelId="status-label"
//           value={taskStatusId}
//           label="Status"
//           onChange={(e) => setTaskStatusId(e.target.value)}
//         >
//           {statusOptions.map((status) => (
//             <MenuItem key={status.taskStatusId} value={status.taskStatusId}>
//               {status.status}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       <TextField
//         fullWidth
//         margin="normal"
//         label="Created By (User ID)"
//         type="number"
//         value={createdById}
//         onChange={(e) => setCreatedById(e.target.value)}
//         required
//       />
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="assignedTo-label">Assign To</InputLabel>
//         <Select
//           labelId="assignedTo-label"
//           value={assignedToId}
//           label="Assign To"
//           onChange={(e) => setAssignedToId(e.target.value)}
//         >
//           <MenuItem value="">None</MenuItem>
//           {userOptions.map((user) => (
//             <MenuItem key={user.userId} value={user.userId}>
//               {user.email}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="priority-label">Priority</InputLabel>
//         <Select
//           labelId="priority-label"
//           value={priority}
//           label="Priority"
//           onChange={(e) => setPriority(e.target.value)}
//         >
//           {priorityOptions.map((p) => (
//             <MenuItem key={p} value={p}>
//               {p}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       <TextField
//         fullWidth
//         margin="normal"
//         label="Category"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//       />
//       <TextField
//         fullWidth
//         margin="normal"
//         label="Completion Date"
//         type="date"
//         value={taskCompletionDate}
//         onChange={(e) => setTaskCompletionDate(e.target.value)}
//       />
//       <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//         Submit
//       </Button>
//     </Box>
//   );
// };

// export default TaskForm;


// src/components/TaskForm.js
// src/components/TaskForm.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { getTaskStatuses, getUsers } from "../../services/taskservice";

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [taskName, setTaskName] = useState(initialData.taskName || "");
  const [taskStatusId, setTaskStatusId] = useState(initialData.taskStatusId || "");
  const [assignedToId, setAssignedToId] = useState(initialData.assignedToId || "");
  const [priority, setPriority] = useState(initialData.priority || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [taskCompletionDate, setTaskCompletionDate] = useState(initialData.taskCompletionDate || "");

  const [statusOptions, setStatusOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = await getTaskStatuses();
        setStatusOptions(
          statuses.map((status) => ({
            id: status.taskStatusId,
            name: status.status,
          }))
        );

        const users = await getUsers();
        setUserOptions(
          users.map((user) => ({
            id: user.userId,
            email: user.email,
          }))
        );
      } catch (error) {
        console.error("Error fetching task statuses or users", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      taskName,
      taskStatusId: taskStatusId || "",
      assignedToId: assignedToId || "",
      priority,
      category,
      taskCompletionDate: taskCompletionDate ? new Date(taskCompletionDate) : "",
    });
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        mt: 5,
        px: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {initialData.taskId ? "Edit Task" : "Create Task"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskStatusId}
              label="Status"
              onChange={(e) => setTaskStatusId(e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={assignedToId}
              label="Assign To"
              onChange={(e) => setAssignedToId(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {userOptions.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              {["Low", "Medium", "High"].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />

          <TextField
            label="Completion Date"
            type="date"
            value={taskCompletionDate}
            onChange={(e) => setTaskCompletionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              py: 1.3,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: "#1976d2",
              ":hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            Submit Task
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskForm;







