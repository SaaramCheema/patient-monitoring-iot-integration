import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LayoutDashboard, Bell, LogOut } from "lucide-react";

const NurseHome = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/nurse/patients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error("Failed to fetch patients");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPatients();
  }, []);

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
        <h2 className="text-2xl font-bold mb-4">Patients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="p-4 bg-white shadow-lg rounded-lg cursor-pointer"
              onClick={() => navigate(`/nurse/alerts/${patient._id}`)}
            >
              <UserCircle className="h-10 w-10 text-blue-500" />
              <h3 className="text-lg font-semibold mt-2">{patient.name}</h3>
              <p className="text-gray-600">{patient.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseHome;
