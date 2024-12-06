const express = require("express");
const router = express.Router();
const verifyToken = require("./middleware");

const {
  getPatientsWithAlerts,
  addOrEditNote,
  getNotesForAlert,
  getPatients,
  getPatientAlerts,
  getDoctorNotes,
} = require("../Controller/doctorController");

// Get all patients with alerts
router.get("/patients-with-alerts", verifyToken, getPatientsWithAlerts);

// Add or edit a note for an alert
router.post("/note", verifyToken, addOrEditNote);

// Get notes for a specific alert
router.get("/notes/:alertId", verifyToken, getNotesForAlert);

// Route to get all unique patients
router.get("/patients", verifyToken, getPatients);

// Route to get alerts of a specific patient
router.get("/alerts/:patientId", verifyToken, getPatientAlerts);

// Route to get all notes for the logged-in doctor
router.get("/notes", verifyToken, getDoctorNotes);

module.exports = router;