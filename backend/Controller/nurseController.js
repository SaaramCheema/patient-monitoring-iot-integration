const User = require("../Models/User");
const Alert = require("../Models/Alert");
const Note = require("../Models/Note");

const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ roles: { $in: ["Patient"] } })
      .select("_id name email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPatientAlerts = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch alerts for the specified patient
      const alerts = await Alert.find({ userId }).sort({ timestamp: -1 });
  
      if (!alerts.length) {
        return res.status(404).json({ message: "No alerts found for this patient" });
      }
  
      // Fetch and attach notes for each alert
      const alertsWithNotes = await Promise.all(
        alerts.map(async (alert) => {
          const notes = await Note.find({ alertId: alert._id }).select(
            "content status createdAt updatedAt"
          );
          return { ...alert.toObject(), notes };
        })
      );
  
      res.status(200).json(alertsWithNotes);
    } catch (error) {
      console.error("Error fetching patient alerts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const updateNoteStatus = async (req, res) => {
    const { noteId } = req.params;
  
    try {
      // Find the note by its ID
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      // Update the status to "Acknowledged"
      note.status = "Acknowledged";
      await note.save();
  
      res.status(200).json({ message: "Note status updated successfully", note });
    } catch (error) {
      console.error("Error updating note status:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  module.exports = {
    getAllPatients,
    getPatientAlerts,
    updateNoteStatus,
  };