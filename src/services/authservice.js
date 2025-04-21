import axios from "axios";

// Adjust the API URL as needed (e.g., your backend localhost port)
const API_URL = "https://localhost:7125/api/auth/";

const getAuthToken = () => {
  return localStorage.getItem("authToken"); // Adjust the key as per your implementation
};

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

export const getuserinfo = async() =>{
  const response = await axios.get(API_URL + "me", {
    headers: {Authorization : `Bearer ${getAuthToken()}`},
  });
  return response.data;
  };

  export const logout = async () => {
    localStorage.removeItem("authToken"); // Remove the token from local storage
    
  };

