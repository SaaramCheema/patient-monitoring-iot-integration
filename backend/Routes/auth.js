const express = require("express");
const router = express.Router();
const verifyToken = require("./middleware");
const {
  RegisterUser,
  LoginUser,
  VerifyEmail,
  RegisterUserGoogle,
  LoginGoogle,
  GetUserProfile,
  ProtectedRoute,
} = require("../Controller/authController");

const { getMonitoringData } = require("../Controller/monitoringController");

// Existing routes
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/verifyEmail", VerifyEmail);
router.post("/registerGoogle", RegisterUserGoogle);
router.post("/loginGoogle", LoginGoogle);
router.post("/getProfile", verifyToken, GetUserProfile);
router.post("/protectedRoute", verifyToken, ProtectedRoute);

// New route for fetching monitoring data
router.get("/monitoringData", verifyToken, getMonitoringData);

module.exports = router;
