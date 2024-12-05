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

// Controller to retrieve alerts for the logged-in user
const getAlerts = async (req, res) => {
  try {
    const userId = res.locals.userId; // Extract logged-in user's ID from the token

    // Retrieve the last 5 alerts for the user, sorted by timestamp
    const alerts = await Alert.find({ userId }).sort({ timestamp: -1 }).limit(5);

    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error retrieving alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  storeAlert,
  getAlerts,
};
