import React from "react";
import { Box, Typography } from "@mui/material";

const TaskDetail = ({ task }) => {
  if (!task) return <Typography>Task not found.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {task.taskName}
      </Typography>
      <Typography variant="body1">
        <strong>Status:</strong> {task.taskStatus.status}
      </Typography>
      <Typography variant="body1">
        <strong>Priority:</strong> {task.priority}
      </Typography>
      <Typography variant="body1">
        <strong>Category:</strong> {task.category}
      </Typography>
      <Typography variant="body1">
        <strong>Created By:</strong> {task.createdBy ? task.createdBy.email : "N/A"}
      </Typography>
      {task.assignedTo && (
        <Typography variant="body1">
          <strong>Assigned To:</strong> {task.assignedTo.email}
        </Typography>
      )}
      {task.taskCompletionDate && (
        <Typography variant="body1">
          <strong>Completion Date:</strong> {new Date(task.taskCompletionDate).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
};

export default TaskDetail;
