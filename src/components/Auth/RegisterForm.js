import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { register } from "../../services/authservice";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roleId = 2; // fixed User role
      await register(email, password, roleId);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(-45deg, #23a6d5, #23d5ab, #ee7752, #e73c7e)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        "@keyframes gradientBG": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "secondary.main", mb: 1 }}>
              <PersonAddOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">Sign Up</Typography>
            {error && <Alert severity="error" sx={{ width: "100%", mt: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
              <TextField
                fullWidth
                required
                label="Email Address"
                type="email"
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link component={RouterLink} to="/login" underline="hover">
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterForm;
