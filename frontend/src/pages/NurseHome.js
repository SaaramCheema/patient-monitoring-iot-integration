import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  AlertTriangle,
  Activity,
  Stethoscope,
  FileText
} from "lucide-react";

const NurseHomePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/getProfile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/doctor/patients-with-alerts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 flex justify-between h-16 items-center">
            <div className="flex items-center">
              <UserCircle className="h-8 w-8 text-indigo-600" />
              <span 
                onClick={() => navigate("/doctorhome")} 
                className="ml-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent cursor-pointer"
              >
                HealthCare
              </span>
            </div>
            <div className="flex items-center space-x-4">
            <button
                onClick={() => navigate("/doctornotes")}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <FileText className="h-5 w-5 mr-2" />
                My Notes
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl p-8 mx-auto mt-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <Stethoscope className="mr-4 text-indigo-600" size={40} />
              {userName ? `Welcome ${userName}` : "Welcome Nurse"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage patients and their critical alerts
            </p>
          </div>
          <div className="bg-indigo-50 rounded-full p-3">
            <Activity className="text-indigo-600" size={24} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
              onClick={() => navigate(`/doctor/patient-alerts/${patient._id}`)}
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 rounded-full p-3 mr-4">
                  <UserCircle className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {patient.patient.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{patient.patient.email}</p>
                </div>
              </div>
              <div className="flex items-center bg-red-50 rounded-lg p-2">
                <AlertTriangle className="text-red-500 w-6 h-6 mr-2" />
                <span className="text-red-600 font-semibold">
                  {patient.alerts.length} Critical Alerts
                </span>
              </div>
            </div>
          ))}
        </div>

        {patients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-xl">
              No patients with active alerts at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseHomePage;