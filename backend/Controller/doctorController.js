const Alert = require("../Models/Alert");
const User = require("../Models/User");
const Note = require("../Models/Note");

const getPatientsWithAlerts = async (req, res) => {
  try {
    const patientsWithAlerts = await Alert.aggregate([
      { $group: { _id: "$userId", alerts: { $push: "$$ROOT" } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $project: {
          _id: 1,
          alerts: 1,
          patient: { $arrayElemAt: ["$patient", 0] }, // Return single patient details
        },
      },
    ]);

    res.status(200).json(patientsWithAlerts);
  } catch (error) {
    console.error("Error fetching patients with alerts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addOrEditNote = async (req, res) => {
    const { alertId, content, status } = req.body;
    const doctorId = res.locals.userId;
  
    try {
      let note = await Note.findOne({ alertId, doctorId });
  
      if (note) {
        // Update existing note
        note.content = content;
        note.status = status;
        note.updatedAt = Date.now();
        await note.save();
      } else {
        // Create a new note
        note = new Note({
          alertId,
          doctorId,
          content,
          status,
        });
        await note.save();
      }
  
      res.status(200).json({ message: "Note saved successfully", note });
    } catch (error) {
      console.error("Error saving note:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const getNotesForAlert = async (req, res) => {
    const { alertId } = req.params;
  
    try {
      const notes = await Note.find({ alertId }).populate("doctorId", "name email");
      res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Fetch all unique patients
const getPatients = async (req, res) => {
    try {
      // Fetch distinct patient IDs from alerts
      const patients = await Alert.distinct("userId");
  
      // Fetch patient details
      const patientDetails = await User.find({ _id: { $in: patients } }).select(
        "_id name email"
      );
  
      res.status(200).json(patientDetails);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Fetch alerts of a specific patient
  const getPatientAlerts = async (req, res) => {
    try {
      const { patientId } = req.params;
  
      // Fetch alerts for the specified patient
      const alerts = await Alert.find({ userId: patientId }).sort({
        timestamp: -1,
      });
  
      res.status(200).json(alerts);
    } catch (error) {
      console.error("Error fetching patient alerts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }; 

  const getDoctorNotes = async (req, res) => {
    try {
      const doctorId = res.locals.userId;
  
      // Fetch all notes created by the logged-in doctor
      const notes = await Note.find({ doctorId })
        .populate({
          path: "alertId", // Populate the alertId
          select: "userId", // Only include the userId from the alert
        })
        .exec();
  
      // Transform notes to include patientId (userId from the alert)
      const transformedNotes = notes.map((note) => ({
        _id: note._id,
        alertId: note.alertId._id,
        patientId: note.alertId.userId, // Extract userId as patientId
        content: note.content,
        status: note.status,
      }));
  
      res.status(200).json(transformedNotes);
    } catch (error) {
      console.error("Error fetching doctor notes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  module.exports = {
    getPatientsWithAlerts,
    addOrEditNote,
    getNotesForAlert,
    getPatients,
    getPatientAlerts,  
    getDoctorNotes
  };