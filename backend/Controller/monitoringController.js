// const PatientMonitoring = require("../Models/PatientMonitoring");
// const Alert = require("../Models/Alert");

// const createAlert = async (userId, message, type) => {
//   try {
//     const alert = new Alert({
//       userId,
//       message,
//       type,
//       timestamp: new Date(),
//       acknowledged: false,
//     });

//     await alert.save();
//     return alert;
//   } catch (error) {
//     console.error("Error creating alert:", error);
//     return null;
//   }
// };

// const checkThresholds = async (monitoringData) => {
//   const { heartRate, bloodPressure, oxygenSaturation, temperature } = monitoringData;

//   // Manually define threshold ranges
//   const heartRateThreshold = { min: 60, max: 100 };  // bpm
//   const bloodPressureThreshold = { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } }; // mmHg
//   const oxygenSaturationThreshold = { min: 90, max: 100 };  // %
//   const temperatureThreshold = { min: 35, max: 37.5 };  // Celsius

//   // Check heart rate
//   if (heartRate < heartRateThreshold.min || heartRate > heartRateThreshold.max) {
//     await createAlert(userId, `Abnormal heart rate: ${heartRate} bpm`, 'heartRate');
//   }

//   // Check blood pressure
//   if (
//     bloodPressure.systolic < bloodPressureThreshold.systolic.min ||
//     bloodPressure.systolic > bloodPressureThreshold.systolic.max ||
//     bloodPressure.diastolic < bloodPressureThreshold.diastolic.min ||
//     bloodPressure.diastolic > bloodPressureThreshold.diastolic.max
//   ) {
//     await createAlert(userId, `Abnormal blood pressure: ${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`, 'bloodPressure');
//   }

//   // Check oxygen saturation
//   if (oxygenSaturation < oxygenSaturationThreshold.min || oxygenSaturation > oxygenSaturationThreshold.max) {
//     await createAlert(userId, `Low oxygen saturation: ${oxygenSaturation}%`, 'oxygenSaturation');
//   }

//   // Check temperature
//   if (temperature < temperatureThreshold.min || temperature > temperatureThreshold.max) {
//     await createAlert(userId, `Abnormal temperature: ${temperature}°C`, 'temperature');
//   }
// };

// const getAlerts = async (req, res) => {
//   try {
//     const userId = res.locals.userId;
//     const alerts = await Alert.find({ userId }).sort({ timestamp: -1 }).limit(5);
//     res.status(200).json(alerts);
//   } catch (error) {
//     console.error("Error fetching alerts:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = {
//   checkThresholds,
//   getAlerts
// };

