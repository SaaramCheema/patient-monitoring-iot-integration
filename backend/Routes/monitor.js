const express = require("express");
const router = express.Router();
const verifyToken = require("./middleware");
const { storeAlert, getAllAlerts } = require("../Controller/monitorController");

// Route to store an alert
router.post("/storeAlert", verifyToken, storeAlert);

// Route to get all alerts for the logged-in user
router.get("/allAlerts", verifyToken, getAllAlerts);

module.exports = router;
