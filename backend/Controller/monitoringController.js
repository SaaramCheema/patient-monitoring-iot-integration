const PatientMonitoring = require("../Models/PatientMonitoring");
const Alert = require("../Models/Alert");

const getMonitoringData = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const monitoringData = await PatientMonitoring.findOne({
      patientId: userId,
    });

    if (!monitoringData) {
      return res.status(404).json({ message: "No monitoring data found for this user" });
    }

    // Check thresholds and create alerts
    checkThresholds(monitoringData);

    res.status(200).json(monitoringData);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkThresholds = async (monitoringData) => {
  const { heartRate, bloodPressure, oxygenSaturation, temperature } = monitoringData;

  // Manually define threshold ranges
  const heartRateThreshold = { min: 60, max: 100 };  // bpm
  const bloodPressureThreshold = { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } }; // mmHg
  const oxygenSaturationThreshold = { min: 90, max: 100 };  // %
  const temperatureThreshold = { min: 35, max: 37.5 };  // Celsius

  // Check heart rate
  if (heartRate < heartRateThreshold.min || heartRate > heartRateThreshold.max) {
    await createAlert(`Abnormal heart rate: ${heartRate} bpm`);
  }

  // Check blood pressure
  if (
    bloodPressure.systolic < bloodPressureThreshold.systolic.min ||
    bloodPressure.systolic > bloodPressureThreshold.systolic.max ||
    bloodPressure.diastolic < bloodPressureThreshold.diastolic.min ||
    bloodPressure.diastolic > bloodPressureThreshold.diastolic.max
  ) {
    await createAlert(`Abnormal blood pressure: ${bloodPressure.systolic}/${bloodPressure.diastolic} mmHg`);
  }

  // Check oxygen saturation
  if (oxygenSaturation < oxygenSaturationThreshold.min || oxygenSaturation > oxygenSaturationThreshold.max) {
    await createAlert(`Low oxygen saturation: ${oxygenSaturation}%`);
  }

  // Check temperature
  if (temperature < temperatureThreshold.min || temperature > temperatureThreshold.max) {
    await createAlert(`Abnormal temperature: ${temperature}°C`);
  }
};

const createAlert = async (message) => {
  const alert = new Alert({
    alertId: new mongoose.Types.ObjectId(),
    message,
    timestamp: new Date(),
    acknowledged: false,
  });

  await alert.save();
};

module.exports = {
  getMonitoringData,
};

