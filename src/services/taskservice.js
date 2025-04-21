// // src/services/taskService.js
// import api from './api'; // Import the custom Axios instance

// const API_URL = 'task/'; // Endpoint relative to the base URL

// export const getTasks = async () => {
//   const response = await api.get(API_URL);
//   return response.data;
// };

// export const getTaskById = async (id) => {
//   const response = await api.get(`${API_URL}${id}`);
//   return response.data;
// };

// export const createTask = async (taskData) => {
//   const response = await api.post(API_URL, taskData);
//   return response.data;
// };

// export const updateTask = async (id, taskData) => {
//   const response = await api.put(`${API_URL}${id}`, taskData);
//   return response.data;
// };

// export const deleteTask = async (id) => {
//   const response = await api.delete(`${API_URL}${id}`);
//   return response.data;
// };


import axios from "axios";
import {jwtDecode} from 'jwt-decode';

const API_URL = "https://localhost:7125/api/task/";
const USER_API_URL = "https://localhost:7125/api/Task/users"; // User API URL (replace this with your actual API)
const TASKSTATUS_API_URL = "https://localhost:7125/api/Task/taskstatuses"; // User API URL (replace this with your actual API)


const getAuthToken = () => {
  return localStorage.getItem("authToken"); // Adjust the key as per your implementation
};

// export const getUserIdFromToken = () => {
//   const token = getAuthToken();
//   if (!token) return null;
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.userId || decoded.sub; // Adjust based on your JWT structure
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// };

// In taskservice.js

// export const getTasks = async () => {
//   const userId = getUserIdFromToken();
//   const response = await axios.get(`${API_URL}?userId=${userId}`, {
//     headers: { Authorization: `Bearer ${getAuthToken()}` },
//   });
//   return response.data;
// };

// export const getTasks = async () => {
//   const response = await axios.get(API_URL,{
//     headers: { Authorization: `Bearer ${getAuthToken()}` },
//   });
//   return response.data;
// };


export const getTaskById = async (id) => {
  const response = await axios.get(`${API_URL}${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};


export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}${id}`, taskData, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

// New function to fetch task statuses
export const getTaskStatuses = async () => {
  const response = await axios.get(TASKSTATUS_API_URL, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

// New function to fetch users
export const getUsers = async () => {
  const response = await axios.get(USER_API_URL, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const fetchTaskCounts = async () => {
  try {
    const [overallResponse, userResponse] = await Promise.all([
      axios.get(`${API_URL}overall-taskcounts`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      axios.get(`${API_URL}user-taskcounts`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    ]);

    return {
      overall: overallResponse.data,
      user: userResponse.data,
    };
  } catch (error) {
    console.error('Error fetching task counts:', error);
    throw error;
  }
};

// 1️⃣ Search/filter + list
export const getTasks = async (search = "", statusId = "") => {
  const params = {};
  if (search)    params.search   = search;
  if (statusId) params.statusId = statusId;
  const response = await axios.get(API_URL, {
    params,
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
  return response.data;
};

// 2️⃣ Export CSV
export const exportTasks = async (search = "", statusId = "") => {
  const params = {};
  if (search)    params.search   = search;
  if (statusId) params.statusId = statusId;
  const response = await axios.get(`${API_URL}export`, {
    params,
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    responseType: "blob"
  });
  // trigger browser download
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tasks.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

//  Import CSV
export const importTasks = async (file, onProgress = () => {}) => {
  const form = new FormData();
  form.append("file", file);
  const response = await axios.post(`${API_URL}import`, form, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: (evt) => {
      const pct = Math.round((evt.loaded * 100) / evt.total);
      onProgress(pct);
    }
  });
  return response.data; // { ImportedCount }
};
