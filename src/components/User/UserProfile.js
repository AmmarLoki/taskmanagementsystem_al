import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Button
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getuserinfo, logout } from "../../services/authservice";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // While loading, render a loading indicator
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
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
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
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
            <AccountCircleIcon />
          </Avatar>
          <Typography variant="h6">TaskSync</Typography>
        </Toolbar>
        <List sx={{ flexGrow: 1 }}>
          {isAdmin ? (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/tasks">
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton selected>
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Paper
          sx={{
            p: 4,
            maxWidth: 600,
            mx: "auto",
            bgcolor: "rgba(255,255,255,0.9)"
          }}
        >
          <Typography variant="h5" gutterBottom>
            User Profile
          </Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography><strong>Role:</strong> {user.roleName}</Typography>
          <Typography><strong>Joined:</strong> {new Date(user.createdOn).toLocaleDateString()}</Typography>
          <Box mt={3}>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
