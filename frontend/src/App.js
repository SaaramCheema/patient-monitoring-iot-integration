import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Singup";
import LoginPage from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import ViewAlerts from "./pages/ViewAlerts";
import Home from "./pages/Home";
import DoctorHome from "./pages/DoctorHome";
import PatientAlertsPage from "./pages/PatientAlertsPage";
import NoteModal from "./pages/NoteModal";
import DoctorNotes from "./pages/DoctorNotes";
import NurseHome from "./pages/NurseHome";


const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={MonitoringDashboard} />}
        />
        <Route path="/viewalerts" element={<ProtectedRoute element={ViewAlerts} />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/doctorhome" element={<ProtectedRoute element={DoctorHome} />} />
        <Route
          path="/doctor/patient-alerts/:patientId"
          element={<ProtectedRoute element={PatientAlertsPage} />}
        />
        <Route
          path="/doctor/note/:alertId"
          element={<ProtectedRoute element={NoteModal} />}
        />
        <Route path="/doctornotes" element={<ProtectedRoute element={DoctorNotes} />} />
        <Route path="/nursehome" element={<ProtectedRoute element={NurseHome} />} />

      </Routes>
    </Router>
  );
};

export default App;