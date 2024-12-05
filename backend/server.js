// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./Routes/auth");
const monitorRoutes = require("./Routes/monitor");
  
dotenv.config();

const app = express();
const server = http.createServer(app); // Use HTTP server to work with Socket.io
const io = new Server(server, { cors: { origin: "http://localhost:3000" } }); // Replace with your frontend URL

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Route setup
app.use("/auth", authRoute);
app.use("/monitor", monitorRoutes);

// Data simulation and WebSocket setup
const generateValue = (min, max) => Math.random() * (max - min) + min;

const emitMonitoringData = () => {
  const data = {
    heartRate: generateValue(60, 140).toFixed(0),
    bloodPressure: {
      systolic: generateValue(70, 160).toFixed(0),
      diastolic: generateValue(50, 120).toFixed(0),
    },
    oxygenSaturation: generateValue(70, 110).toFixed(0),
    temperature: generateValue(36, 38).toFixed(1),
    timestamp: new Date().toISOString(),
  };
  io.emit("monitoringData", data);
};

io.on("connection", (socket) => {
  console.log("Client connected");
  const interval = setInterval(emitMonitoringData, 1000); // Emit every 0.5 seconds
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
