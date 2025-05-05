// components/PrivateRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken"); // Adjust this logic as needed
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
