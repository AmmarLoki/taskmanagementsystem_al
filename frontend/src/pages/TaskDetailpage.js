import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById , updateTask} from "../services/taskservice";
import { Container, Typography, Button, Box } from "@mui/material";
import TaskForm from "../components/Task/TaskForm";

const TaskDetailpage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const data = await getTaskById(taskId);
      setTask(data);
    };
    fetchTask();
  }, [taskId]);

  const handleUpdate = async updatedValues => {
    await updateTask(task.taskId, updatedValues);
    navigate("/tasks");
  };

  if (!task) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Task Detail</Typography>
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

      <TaskForm
        initialData={{
        taskName: task.taskName,
        taskStatusId: task.taskStatusId,
        assignedToId: task.assignedToId,
        priority: task.priority,
        category: task.category,
        taskCompletionDate: task.taskCompletionDate?.split("T")[0] || ""
      }}
      onSubmit={handleUpdate}
    />
      
    </Container>
  );
};

export default TaskDetailpage;
