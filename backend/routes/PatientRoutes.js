const express = require("express");
const router = express.Router();
const { getPatientData } = require("../controllers/PatientController");

router.get("/patient", getPatientData);

module.exports = router;
