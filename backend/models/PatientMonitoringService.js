const mongoose = require("mongoose");

// Alert Schema
const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
    match:
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  acknowledged: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Note Schema
const noteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Threshold Schema
const thresholdSchema = new mongoose.Schema({
  heartRateThreshold: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  bloodPressureThreshold: {
    systolic: {
      type: Number,
      required: true,
    },
    diastolic: {
      type: Number,
      required: true,
    },
  },
});

// Main Patient Monitoring Schema
const patientMonitoringServiceSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    match:
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
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
  "PatientMonitoringService",
  patientMonitoringServiceSchema
);
