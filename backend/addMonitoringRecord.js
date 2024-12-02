require("dotenv").config();
const mongoose = require("mongoose");
const PatientMonitoring = require("./Models/PatientMonitoring"); // Adjust the path if needed

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to add a monitoring record
async function addMonitoringRecord() {
  try {
    const monitoringRecord = new PatientMonitoring({
      patientId: new mongoose.Types.ObjectId("6730a80063a19cd4148062de"),
      heartRate: 72,
      bloodPressure: {
        systolic: 120,
        diastolic: 80,
      },
      oxygenSaturation: 98,
      temperature: 37.0,
      alerts: [
        {
          alertId: "a1b2c3d4-e5f6-7890-a123-456789abcdef",
          message: "Heart rate threshold exceeded",
          acknowledged: false,
        },
      ],
      notes: [
        {
          note: "Patient reported feeling dizzy.",
          author: "Nurse",
        },
      ],
      thresholds: {
        heartRateThreshold: { min: 60, max: 100 },
        bloodPressureThreshold: { systolic: 120, diastolic: 80 },
      },
    });

    // Save the monitoring record
    const savedRecord = await monitoringRecord.save();
    console.log("Monitoring record saved:", savedRecord);
  } catch (err) {
    console.error("Error saving monitoring record:", err);
  } finally {
    mongoose.disconnect();
  }
}

addMonitoringRecord();
