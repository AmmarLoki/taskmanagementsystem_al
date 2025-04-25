import React from "react";
import { List, ListItem, ListItemText, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const TaskList = ({ tasks, onDelete }) => {
  return (
    <Box>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.taskId} divider>
            <ListItemText
              primary={task.taskName}
              secondary={`Status: ${task.taskStatus.status} | Priority: ${task.priority} | Category: ${task.category}`}
            />
            <Box>
              <Button 
                variant="outlined" 
                component={Link} 
                to={`/tasks/${task.taskId}`} 
                sx={{ mr: 2 }}
                
              >
                View/Edit
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                sx={{ mr: 50 }}
                onClick={() => onDelete(task.taskId)}
              >
                Delete
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
