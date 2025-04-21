// // components/Task/TaskCountCard.js

// import React from 'react';
// import { Card, CardContent, Typography } from '@mui/material';

// const TaskCountCard = ({ status, count }) => {
//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" component="div">
//           {status}
//         </Typography>
//         <Typography variant="h4">
//           {count}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default TaskCountCard;

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Avatar } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const colorMap = {
  Completed: '#4caf50',   // green
  InProgress: '#2196f3',  // blue
  Pending: '#ff9800'      // orange
};

const TaskCountCard = ({ status, count }) => {
  const bg = colorMap[status] || '#757575';
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', background: bg, color: 'white', minWidth: 200, boxShadow: 4 }}>
      <Box sx={{ p: 2 }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}>
          <AssignmentIcon htmlColor="white" />
        </Avatar>
      </Box>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {status}
        </Typography>
        <Typography variant="h3">
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default TaskCountCard;

