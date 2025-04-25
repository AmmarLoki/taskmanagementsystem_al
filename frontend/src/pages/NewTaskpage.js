import React from "react";
import { createTask } from "../services/taskservice";
import { Container, Typography, Button, Box } from "@mui/material";
import TaskForm from "../components/Task/TaskForm";
import { useNavigate } from "react-router-dom";

const NewTaskPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (taskData) => {
    await createTask(taskData);
    navigate("/tasks");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Create New Task</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/tasks")}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Back to Task List
        </Button>
      </Box>

      <TaskForm onSubmit={handleCreate} />
    </Container>
  );
};

export default NewTaskPage;
