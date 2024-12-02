import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Singup";
import LoginPage from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import MonitoringDashboard from "./pages/MonitoringDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />

        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={MonitoringDashboard} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
