const mongoose = require("mongoose");
const alertSchema = require("./Alert");
const noteSchema = require("./Note");
const thresholdSchema = require("./Threshold");

const patientMonitoringServiceSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
    min: 0,
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true,
      min: 0,
    },
    diastolic: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  oxygenSaturation: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  temperature: {
    type: Number,
    required: true,
    min: 30,
    max: 45,
  },
  alerts: [alertSchema],
  notes: [noteSchema],
  thresholds: {
    type: thresholdSchema,
    required: true,
  },
});

module.exports = mongoose.model(
  "PatientMonitoring",
  patientMonitoringServiceSchema
);
