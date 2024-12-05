import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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
import { io } from "socket.io-client";

const MAX_DATA_POINTS = 50;

// Custom tooltip component for better aesthetics
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-lg shadow-lg">
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: pld.color }}
            ></div>
            <span className="font-medium text-gray-700">
              {pld.name}: {pld.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MonitoringDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // State to store user's name
  const [data, setData] = useState({
    heartRate: Array(MAX_DATA_POINTS).fill({ value: 0, time: new Date() }),
    bloodPressure: Array(MAX_DATA_POINTS).fill({
      systolic: 0,
      diastolic: 0,
      time: new Date(),
    }),
    oxygenSaturation: Array(MAX_DATA_POINTS).fill({
      value: 0,
      time: new Date(),
    }),
    temperature: Array(MAX_DATA_POINTS).fill({ value: 0, time: new Date() }),
  });
  const [currentValues, setCurrentValues] = useState({
    heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    oxygenSaturation: 0,
    temperature: 0,
  });
  const [alerts, setAlerts] = useState([]);

  // Thresholds for vital signs
  const THRESHOLDS = {
    heartRate: { min: 65, max: 135 },
    bloodPressure: { 
      systolic: { min: 75, max: 155 }, 
      diastolic: { min: 55, max: 115 } 
    },
    oxygenSaturation: { min: 75, max: 105 },
    temperature: { min: 36.5, max: 37.5 }
  };

  const updateDataArray = useCallback((oldData, newValue, key = "value") => {
    const newData = [...oldData];
    newData.push({ ...newValue, time: new Date() });
    if (newData.length > MAX_DATA_POINTS) {
      newData.shift();
    }
    return newData;
  }, []);

  // Function to send alert to the backend
  const sendAlertToBackend = async (alert) => {
    try {
      await fetch("http://localhost:3001/monitor/storeAlert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(alert),
      });
    } catch (error) {
      console.error("Error sending alert to backend:", error);
    }
  };

  useEffect(() => {
    // Fetch user's profile data to get the name
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

    fetchUserName();

    const socket = io("http://localhost:3001");

    socket.on("monitoringData", (newData) => {
      setCurrentValues(newData);

      setData((prevData) => ({
        heartRate: updateDataArray(prevData.heartRate, {
          value: Number(newData.heartRate),
        }),
        bloodPressure: updateDataArray(prevData.bloodPressure, {
          systolic: Number(newData.bloodPressure.systolic),
          diastolic: Number(newData.bloodPressure.diastolic),
        }),
        oxygenSaturation: updateDataArray(prevData.oxygenSaturation, {
          value: Number(newData.oxygenSaturation),
        }),
        temperature: updateDataArray(prevData.temperature, {
          value: Number(newData.temperature),
        }),
      }));

      const newAlerts = [];

      // Heart Rate Alert
      if (
        newData.heartRate < THRESHOLDS.heartRate.min || 
        newData.heartRate > THRESHOLDS.heartRate.max
      ) {
        newAlerts.push({
          message: `Abnormal heart rate: ${newData.heartRate} bpm`,
          timestamp: new Date(),
          type: 'heartRate'
        });
      }

      // Blood Pressure Alerts
      if (
        newData.bloodPressure.systolic < THRESHOLDS.bloodPressure.systolic.min ||
        newData.bloodPressure.systolic > THRESHOLDS.bloodPressure.systolic.max ||
        newData.bloodPressure.diastolic < THRESHOLDS.bloodPressure.diastolic.min ||
        newData.bloodPressure.diastolic > THRESHOLDS.bloodPressure.diastolic.max
      ) {
        newAlerts.push({
          message: `Abnormal blood pressure: ${newData.bloodPressure.systolic}/${newData.bloodPressure.diastolic} mmHg`,
          timestamp: new Date(),
          type: 'bloodPressure'
        });
      }

      // Oxygen Saturation Alert
      if (
        newData.oxygenSaturation < THRESHOLDS.oxygenSaturation.min || 
        newData.oxygenSaturation > THRESHOLDS.oxygenSaturation.max
      ) {
        newAlerts.push({
          message: `Abnormal oxygen saturation: ${newData.oxygenSaturation}%`,
          timestamp: new Date(),
          type: 'oxygenSaturation'
        });
      }

      // Temperature Alert
      if (
        newData.temperature < THRESHOLDS.temperature.min || 
        newData.temperature > THRESHOLDS.temperature.max
      ) {
        newAlerts.push({
          message: `Abnormal temperature: ${newData.temperature}°C`,
          timestamp: new Date(),
          type: 'temperature'
        });
      }

      // Send alerts to backend
      newAlerts.forEach((alert) => sendAlertToBackend(alert));

      // Update alerts, keeping only the last 5
      setAlerts((prev) => [...prev, ...newAlerts].slice(-5));
    });

    return () => socket.disconnect();
  }, [updateDataArray]);

  const VitalSignCard = ({ title, icon, value, unit, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 font-semibold">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline">
        <span className={`text-4xl font-bold ${color}`}>{value}</span>
        <span className="ml-1 text-gray-500 text-lg">{unit}</span>
      </div>
    </div>
  );

  const ModernChart = ({ title, data, config }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis dataKey="time" tick={false} axisLine={false} />
            <YAxis
              type="number"
              domain={config.yAxisDomain}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            {config.lines.map((line) => (
              <Line
                key={line.id}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Modify the Alerts section to show alerts for all types
  const renderAlertIcon = (type) => {
    const icons = {
      heartRate: <Activity className="w-5 h-5 mr-2" />,
      bloodPressure: <Droplet className="w-5 h-5 mr-2" />,
      oxygenSaturation: <Wind className="w-5 h-5 mr-2" />,
      temperature: <Thermometer className="w-5 h-5 mr-2" />
    };
    return icons[type] || <AlertTriangle className="w-5 h-5 mr-2" />;
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
            {userName ? `${userName}'s Vitals` : "Patient Vitals Monitor"}
          </h1>
          <p className="text-gray-600">
            Real-time vital signs monitoring dashboard
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <VitalSignCard
            title="Heart Rate"
            icon={<Activity className="w-6 h-6 text-red-500" />}
            value={currentValues.heartRate}
            unit="bpm"
            color="text-red-500"
          />
          <VitalSignCard
            title="Blood Pressure"
            icon={<Droplet className="w-6 h-6 text-blue-500" />}
            value={`${currentValues.bloodPressure.systolic}/${currentValues.bloodPressure.diastolic}`}
            unit="mmHg"
            color="text-blue-500"
          />
          <VitalSignCard
            title="SpO2"
            icon={<Wind className="w-6 h-6 text-purple-500" />}
            value={currentValues.oxygenSaturation}
            unit="%"
            color="text-purple-500"
          />
          <VitalSignCard
            title="Temperature"
            icon={<Thermometer className="w-6 h-6 text-orange-500" />}
            value={currentValues.temperature}
            unit="°C"
            color="text-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernChart
            title="Heart Rate Trend"
            data={data.heartRate}
            config={{
              yAxisDomain: [50, 120],
              lines: [{ id: "heartRate", dataKey: "value", color: "#EF4444" }],
            }}
          />

          <ModernChart
            title="Blood Pressure Trend"
            data={data.bloodPressure}
            config={{
              yAxisDomain: [60, 140],
              lines: [
                {
                  id: "systolic",
                  dataKey: "systolic",
                  color: "#3B82F6",
                },
                {
                  id: "diastolic",
                  dataKey: "diastolic",
                  color: "#10B981",
                },
              ],
            }}
          />

          <ModernChart
            title="Oxygen Saturation Trend"
            data={data.oxygenSaturation}
            config={{
              yAxisDomain: [90, 100],
              lines: [
                {
                  id: "oxygen",
                  dataKey: "value",
                  color: "#8B5CF6",
                },
              ],
            }}
          />

          <ModernChart
            title="Temperature Trend"
            data={data.temperature}
            config={{
              yAxisDomain: [35, 38],
              lines: [
                {
                  id: "temperature",
                  dataKey: "value",
                  color: "#F97316",
                },
              ],
            }}
          />
        </div>

        {/* Alerts section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-2">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center text-red-500 bg-red-50 p-3 rounded"
                >
                  {renderAlertIcon(alert.type)}
                  <span>
                    {alert.message} - {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
