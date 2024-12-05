const Alert = require("../Models/Alert");

// Controller to store an alert in the database
const storeAlert = async (req, res) => {
  try {
    const userId = res.locals.userId; // Extract logged-in user's ID from the token
    const { message, type } = req.body; // Extract alert data from the request body

    if (!message || !type) {
      return res.status(400).json({ message: "Message and type are required" });
    }

    // Create a new alert
    const alert = new Alert({
      userId,
      message,
      type,
      timestamp: new Date(),
      acknowledged: false,
    });

    await alert.save(); // Save the alert to the database

    res.status(201).json({ message: "Alert stored successfully", alert });
  } catch (error) {
    console.error("Error storing alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to retrieve all alerts for the logged-in user
const getAllAlerts = async (req, res) => {
    try {
      const userId = res.locals.userId; // Extract logged-in user's ID from the token
  
      // Retrieve all alerts for the user, sorted by timestamp
      const alerts = await Alert.find({ userId }).sort({ timestamp: -1 });
  
      res.status(200).json(alerts);
    } catch (error) {
      console.error("Error retrieving alerts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAlerts = async (req, res) => {
    try {
      const userId = res.locals.userId; // Extracted from the JWT in middleware
  
      // Fetch only the 5 most recent alerts for the user, sorted by timestamp descending
      const alerts = await Alert.find({ userId })
        .sort({ timestamp: -1 }) // Sort by timestamp in descending order
        .limit(5); // Limit to 5 alerts
  
      // Return the alerts as JSON
      res.status(200).json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };   
  
  module.exports = {
    storeAlert,
    getAlerts,
    getAllAlerts
  };

