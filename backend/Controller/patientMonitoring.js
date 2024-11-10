// patientMonitoring.js
const PatientMonitoring = require("../Models/PatientMonitoring");
const DATA_GENERATION_INTERVAL = 5000; 
const MAX_DATA_ENTRIES = 50;


// Generate random data for monitoring
function generateRandomData() {
    return {
      heartRate: Math.floor(Math.random() * (120 - 60 + 1) + 60),
      bloodPressure: {
        systolic: Math.floor(Math.random() * (140 - 90 + 1) + 90),
        diastolic: Math.floor(Math.random() * (90 - 60 + 1) + 60),
      },
      temperature: Math.random() * (39 - 36) + 36,
      oxygenLevel: Math.floor(Math.random() * (100 - 90 + 1) + 90),
      timestamp: new Date(),
    };
  }

// Route to generate and save dummy data for a patient
//app.post("/api/patient-monitoring/:patientId",
async function updatePatientMonitoringData(patientId) {
    const newData = generateRandomData();
  
    const existingPatientData = await PatientMonitoring.findOne({ patientId });
  
    if (existingPatientData) {
      // Add new data and maintain a maximum number of entries
      existingPatientData.monitoringData.push(newData);
      if (existingPatientData.monitoringData.length > MAX_DATA_ENTRIES) {
        existingPatientData.monitoringData.shift(); // Remove oldest entry
      }
      await existingPatientData.save();
    } else {
      // Create new document if patient does not exist
      const patientMonitoringData = new PatientMonitoring({
        patientId,
        monitoringData: [newData],
      });
      await patientMonitoringData.save();
    }
  }


  function startDataGeneration(patientId) {
    setInterval(async () => {
      try {
        await updatePatientMonitoringData(patientId);
        console.log(`Generated new data for patient ID: ${patientId}`);
      } catch (error) {
        console.error(`Error updating data for patient ID: ${patientId}`, error);
      }
    }, DATA_GENERATION_INTERVAL);
  }


  const dataGeneration = async (req, res) => {
    const { patientId } = req.params;
    try {
      startDataGeneration(patientId);
      res.status(200).json({ message: `Started monitoring for patient ID: ${patientId}` });
    } catch (error) {
      res.status(500).json({ error: "Error starting monitoring" });
    }
  };

module.exports = {dataGeneration}
