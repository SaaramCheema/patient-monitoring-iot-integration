import React, { useEffect, useState } from "react";
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
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const ViewAlerts = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); 
  const [alerts, setAlerts] = useState([]); 

  const fetchUserName = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/getProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch user profile. Status:", response.status);
        return;
      }
  
      const userData = await response.json();
      setUserName(userData.name);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };  

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:3001/monitor/allAlerts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        const alertsData = await response.json();
        setAlerts(alertsData);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchAlerts();
  }, []);

  const renderAlertIcon = (type) => {
    const icons = {
      heartRate: <Activity className="w-6 h-6 text-red-500" />,
      bloodPressure: <Droplet className="w-6 h-6 text-blue-500" />,
      oxygenSaturation: <Wind className="w-6 h-6 text-green-500" />,
      temperature: <Thermometer className="w-6 h-6 text-orange-500" />,
    };
    return icons[type] || <AlertTriangle className="w-6 h-6 text-yellow-500" />;
  };

  const getAlertTypeDescription = (type) => {
    const descriptions = {
      heartRate: "Heart Rate",
      bloodPressure: "Blood Pressure",
      oxygenSaturation: "Oxygen Saturation",
      temperature: "Body Temperature"
    };
    return descriptions[type] || "Unknown Alert";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 flex justify-between h-16 items-center">
            <div className="flex items-center">
              <UserCircle className="h-8 w-8 text-indigo-600" />
              <span className="ml-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
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

      <div className="max-w-7xl p-8 mx-auto mt-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {userName ? `${userName}'s Alerts` : "Alerts"}
          </h1>
          <p className="text-gray-600">All recent alerts are displayed below</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Alert History</h3>
          </div>
          
          {alerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <div className="flex-shrink-0 mr-4">
                    {renderAlertIcon(alert.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {getAlertTypeDescription(alert.type)} Alert
                        </h4>
                        <p className="text-sm text-gray-600">
                          {alert.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-gray-600">No alerts at the moment. All systems are normal!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAlerts;