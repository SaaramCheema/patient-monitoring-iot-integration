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


// Existing routes
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/verifyEmail", VerifyEmail);
router.post("/registerGoogle", RegisterUserGoogle);
router.post("/loginGoogle", LoginGoogle);
router.get("/getProfile", verifyToken, GetUserProfile);
router.post("/protectedRoute", verifyToken, ProtectedRoute);

// New route for fetching monitoring data

module.exports = router;
