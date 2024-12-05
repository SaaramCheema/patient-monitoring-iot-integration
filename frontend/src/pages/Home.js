import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  LayoutDashboard,
  Bell,
  AlertTriangle,
  Activity,
  Droplet,
  Wind,
  Thermometer,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [recentAlerts, setRecentAlerts] = useState([]);

  // Fetch user name
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

  // Fetch recent alerts
  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const response = await fetch("http://localhost:3001/monitor/getAlerts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const alerts = await response.json();
          setRecentAlerts(alerts.slice(0, 5)); // Limit to 5 recent alerts
        }
      } catch (error) {
        console.error("Failed to fetch recent alerts:", error);
      }
    };

    fetchRecentAlerts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Function to navigate to other pages
  const handleNavigate = (path) => {
    navigate(path);
  };

  const renderAlertIcon = (type) => {
    const icons = {
      heartRate: <Activity className="w-6 h-6 text-red-500" />,
      bloodPressure: <Droplet className="w-6 h-6 text-blue-500" />,
      oxygenSaturation: <Wind className="w-6 h-6 text-green-500" />,
      temperature: <Thermometer className="w-6 h-6 text-orange-500" />,
    };
    return icons[type] || <AlertTriangle className="w-6 h-6 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {userName ? `Welcome, ${userName}!` : "Welcome to Patient Portal"}
          </h1>
          <p className="text-gray-600">
            Stay updated with your latest alerts and health information.
          </p>
        </header>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickLink
            title="Dashboard"
            description="View your vital signs in real-time."
            onClick={() => handleNavigate("/dashboard")}
          />
          <QuickLink
            title="Alerts"
            description="Check all recent alerts."
            onClick={() => handleNavigate("/viewalerts")}
          />
          <QuickLink
            title="Settings"
            description="Manage your profile and preferences."
            onClick={() => handleNavigate("/settings")}
          />
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Recent Alerts</h3>
          </div>
          
          {recentAlerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentAlerts.map((alert, index) => (
                <div 
                  key={index} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <div className="flex-shrink-0 mr-4">
                    {renderAlertIcon(alert.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <span className="text-xs text-gray-500 ml-4">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No recent alerts available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ title, description, onClick }) => (
  <div
    className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow transform hover:-translate-y-1"
    onClick={onClick}
  >
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);

export default HomePage;