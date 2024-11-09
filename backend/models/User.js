const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      description: "Unique identifier for the user",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      description: "Username of the user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Invalid email format"],
      description: "User's email address",
    },
    passwordHash: {
      type: String,
      required: true,
      description: "Hashed password for the user",
    },
    roles: {
      type: [String],
      required: true,
      enum: [
        "Patient",
        "Doctor",
        "Nurse",
        "Admin",
        "SuperAdmin",
        "Pharmacist",
        "LabTechnician",
      ],
      description: "Roles assigned to the user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      required: true,
      default: "active",
      description: "Current status of the user account",
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      description: "Date and time when the user was created",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      description: "Date and time when the user was last updated",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
