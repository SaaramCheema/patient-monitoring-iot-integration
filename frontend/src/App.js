import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Singup";
import LoginPage from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
<<<<<<< HEAD


=======
import MonitoringDashboard from "./pages/MonitoringDashboard";

>>>>>>> e3f7855bf26bd7242a7ed15c9c61fc939bd0a87c
const App = () => {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        
        <Route path="/" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        
        <Route
          path="/profile"
          element={<ProtectedRoute element={Profile} />}
        />

=======
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={MonitoringDashboard} />}
        />
>>>>>>> e3f7855bf26bd7242a7ed15c9c61fc939bd0a87c
      </Routes>
    </Router>
  );
};

export default App;
