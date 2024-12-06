import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  AlertTriangle,
  Pencil,
  TrendingUp,
  Stethoscope,
  Activity,
  Droplet,
  Wind,
  Thermometer,
  FileText
} from "lucide-react";
import NoteModal from "./NoteModal";

const PatientAlertsPage = () => {
  const { patientId } = useParams();
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [patientName, setPatientName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientAndAlerts = async () => {
      try {
        const patientResponse = await fetch(`http://localhost:3001/doctor/patient-details/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });

        const alertsResponse = await fetch(`http://localhost:3001/doctor/alerts/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });

        if (patientResponse.ok) {
          const patientData = await patientResponse.json();
          setPatientName(patientData.name);
        }

        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json();
          setAlerts(alertsData);
        }
      } catch (error) {
        console.error("Error fetching patient details and alerts:", error);
      }
    };

    fetchPatientAndAlerts();
  }, [patientId]);

  const handleOpenModal = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getAlertTypeDetails = (type) => {
    const details = {
      heartRate: {
        color: 'text-red-500 bg-red-50 border-red-200',
        icon: <Activity className="h-5 w-5" />,
        label: 'Heart Rate'
      },
      bloodPressure: {
        color: 'text-blue-500 bg-blue-50 border-blue-200',
        icon: <Droplet className="h-5 w-5" />,
        label: 'Blood Pressure'
      },
      oxygenSaturation: {
        color: 'text-green-500 bg-green-50 border-green-200',
        icon: <Wind className="h-5 w-5" />,
        label: 'Oxygen Saturation'
      },
      temperature: {
        color: 'text-orange-500 bg-orange-50 border-orange-200',
        icon: <Thermometer className="h-5 w-5" />,
        label: 'Temperature'
      }
    };
    return details[type] || {
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
      icon: <AlertTriangle className="h-5 w-5" />,
      label: 'Alert'
    };
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
     
      <div className="max-w-6xl p-8 mx-auto mt-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <Stethoscope className="mr-4 text-indigo-600" size={40} />
              {patientName ? `Patient: ${patientName}` : "Patient Alerts"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive view of critical health alerts
            </p>
          </div>
          <div className="bg-indigo-50 rounded-full p-3">
            <AlertTriangle className="text-indigo-600" size={24} />
          </div>
        </header>
       
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4 border border-gray-100">
            <TrendingUp className="mx-auto h-16 w-16 text-indigo-500 mb-4 opacity-70" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">All Clear</h2>
            <p className="text-gray-500 text-lg">No active alerts for this patient at the moment.</p>
            <div className="flex justify-center">
              <div className="bg-indigo-100 rounded-full px-4 py-2 text-indigo-700 font-semibold">
                Patient Status: Stable
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const alertType = getAlertTypeDetails(alert.type);
              return (
                <div
                  key={alert._id}
                  className={`
                    ${alertType.color}
                    rounded-xl border shadow-md
                    hover:shadow-lg transition-all duration-300
                    transform hover:-translate-y-1 overflow-hidden group
                  `}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                          {alertType.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {alertType.label} Alert
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 space-x-2">
                        <span className="bg-white/60 rounded-full px-2 py-0.5">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenModal(alert)}
                      className="ml-3 flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:opacity-90 transition-all"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Notes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
     
      {showModal && (
        <NoteModal
          alert={selectedAlert}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PatientAlertsPage;