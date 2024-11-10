const mongoose = require("mongoose");

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

module.exports = noteSchema;
