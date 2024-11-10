require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const PatientMonitoringService = require("../models/PatientMonitoringService");
const User = require("../models/User");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

async function createSyntheticUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = new User({
      id: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      roles: ["Patient"],
      status: "active",
    });
    users.push(user.save());
  }
  await Promise.all(users);
}

async function createSyntheticPatientData(patientId, recordCount) {
  const records = [];
  for (let i = 0; i < recordCount; i++) {
    const alerts = [];

    // Conditionally add alerts if thresholds are exceeded
    if (Math.random() > 0.7) {
      // 30% chance of generating an alert
      alerts.push({
        alertId: faker.string.uuid(),
        message: "Threshold exceeded",
        timestamp: new Date(),
        acknowledged: false,
      });
    }

    const record = new PatientMonitoringService({
      patientId: patientId,
      heartRate: faker.number.int({ min: 60, max: 100 }),
      bloodPressure: {
        systolic: faker.number.int({ min: 110, max: 140 }),
        diastolic: faker.number.int({ min: 70, max: 90 }),
      },
      oxygenSaturation: faker.number.int({ min: 90, max: 100 }),
      temperature: faker.number.float({ min: 36.5, max: 37.5, precision: 0.1 }),
      thresholds: {
        heartRateThreshold: { min: 50, max: 120 },
        bloodPressureThreshold: { systolic: 140, diastolic: 90 },
      },
      alerts: alerts,
      notes: [
        {
          note: "Routine check-up",
          author: "System",
          timestamp: new Date(),
        },
      ],
    });
    records.push(record.save());
  }
  await Promise.all(records);
}

async function generateData() {
  await createSyntheticUsers(10); // Create 10 synthetic users
  for (let i = 0; i < 10; i++) {
    const patientId = faker.string.uuid();
    await createSyntheticPatientData(patientId, 50); // 50 records per patient
  }
  console.log("Synthetic data generation complete");
  mongoose.disconnect();
}

generateData();
