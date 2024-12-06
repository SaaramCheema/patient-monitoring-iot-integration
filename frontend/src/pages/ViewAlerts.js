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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <div className="max-w-7xl p-8 mx-auto mt-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <Bell className="mr-4 text-indigo-600" size={40} />
              {userName ? `${userName}'s Alerts` : "Alerts"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">All recent alerts are displayed below</p>
          </div>
          <div className="bg-indigo-50 rounded-full p-3">
            <Bell className="text-indigo-600" size={24} />
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="mr-3 text-indigo-600" size={20} />
              Alert History
            </h3>
          </div>
          
          {alerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className="px-6 py-5 hover:bg-indigo-50 transition-all duration-300 ease-in-out flex items-center group"
                >
                  <div className="flex-shrink-0 mr-5">
                    {renderAlertIcon(alert.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {getAlertTypeDescription(alert.type)} Alert
                        </h4>
                        <p className="text-sm text-gray-600">
                          {alert.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4 opacity-70" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">All Clear</h2>
              <p className="text-gray-500 text-lg">No alerts at the moment. All systems are normal!</p>
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full px-6 py-3 text-green-700 font-semibold text-lg">
                  System Status: Stable
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAlerts;