const PatientMonitoring = require("../Models/PatientMonitoring");

// Fetch monitoring data for the authenticated user
// monitoringController.js
const getMonitoringData = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const monitoringData = await PatientMonitoring.findOne({
      patientId: userId,
    });

    if (!monitoringData) {
      return res
        .status(404)
        .json({ message: "No monitoring data found for this user" });
    }

    res.status(200).json(monitoringData);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMonitoringData,
};
