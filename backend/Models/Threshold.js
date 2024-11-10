const mongoose = require("mongoose");

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

module.exports = thresholdSchema;
