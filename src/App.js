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
import UserProfile from "./components/User/UserProfile"; // Import the UserProfile component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path = "/tasks" element={<TaskListPage />} />
        <Route path = "/new-task" element={<NewTaskPage />} />
        <Route path = "/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path = "/dashboard" element={<AdminDashboard />} />
        <Route path = "/profile" element={<UserProfile />} /> {/* User Profile route */}
        {/* Future routes: Dashboard, Task List, etc. */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

