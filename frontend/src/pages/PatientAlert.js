import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import NoteManagementModal from "./NoteManagementModal";
import { useNavigate } from "react-router-dom";

import {
    UserCircle,
    LogOut,
    LayoutDashboard,
    Bell,
    Activity,
    Thermometer,
    Droplet,
    Wind,
    AlertTriangle
  } from "lucide-react";

const PatientAlerts = () => {
  const { userId } = useParams();
  const [alerts, setAlerts] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/nurse/alerts/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        } else {
          console.error("Failed to fetch alerts");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAlerts();
  }, [userId]);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 flex justify-between h-16 items-center">
            <div className="flex items-center">
              <UserCircle className="h-8 w-8 text-indigo-600" />
              <span 
                onClick={() => navigate("/home")} 
                className="ml-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent cursor-pointer"
              >
                HealthCare
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => navigate("/viewalerts")}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <Bell className="h-5 w-5 mr-2" />
                Alerts
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Alerts</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Alert</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Note</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id} className="border-b">
                <td className="px-4 py-2">{alert.message}</td>
                <td className="px-4 py-2">{new Date(alert.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {alert.notes?.length ? alert.notes[0].content : "No note"}
                </td>
                <td className="px-4 py-2">
                  {alert.notes?.length ? (
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleNoteClick(alert.notes[0])}
                    >
                      Manage Note
                    </button>
                  ) : (
                    "No actions"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedNote && (
        <NoteManagementModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </div>
  );
};

export default PatientAlerts;
