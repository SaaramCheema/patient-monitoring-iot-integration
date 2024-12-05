const express = require("express");
const router = express.Router();
const verifyToken = require("./middleware");
const { storeAlert, getAlerts } = require("../Controller/monitorController");

// Route to store an alert
router.post("/storeAlert", verifyToken, storeAlert);

// Route to get alerts for the logged-in user
router.get("/getAlerts", verifyToken, getAlerts);

module.exports = router;
