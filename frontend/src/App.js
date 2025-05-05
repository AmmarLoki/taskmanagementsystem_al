// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// Before (v5):
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// After (v6):
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Loginpage";
import RegisterPage from "./pages/Registerpage";
import TaskListPage from "./pages/TaskListpage";
import TaskDetailPage from "./pages/TaskDetailpage";
import NewTaskPage from "./pages/NewTaskpage";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./components/User/UserProfile";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TaskListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-task"
          element={
            <PrivateRoute>
              <NewTaskPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <PrivateRoute>
              <TaskDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


