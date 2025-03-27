import axios from "axios";

// Adjust the API URL as needed (e.g., your backend localhost port)
const API_URL = "https://localhost:7125/api/auth/";

export const register = async (email, password, roleId) => {
  const response = await axios.post(API_URL + "register", {
    email,
    password,
    roleId,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(API_URL + "login", {
    email,
    password,
  });
  return response.data;
};
