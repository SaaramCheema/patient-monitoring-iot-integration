const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  type: {
    type: String,
    enum: ['heartRate', 'bloodPressure', 'oxygenSaturation', 'temperature'],
    required: true
  },
  acknowledged: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;