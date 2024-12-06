const express = require("express");
const router = express.Router();
const verifyToken = require("./middleware");
const {
  getAllPatients,
  getPatientAlerts,
  updateNoteStatus,
} = require("../Controller/nurseController");

// Route to fetch all patients
router.get("/patients", verifyToken, getAllPatients);

// Route to fetch alerts and associated notes for a specific patient
router.get("/alerts/:userId", verifyToken, getPatientAlerts);

// Route to update the status of a note
router.put("/notes/:noteId/status", verifyToken, updateNoteStatus);

module.exports = router;
