const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ Correct path casing (case-sensitive in Linux/Render)
const patientRoutes = require("./Routes/patientRoutes");
const appointmentRoutes = require("./Routes/appointmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Optional root route to fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Clinic Backend is Live ✅");
});

// ✅ MongoDB connection (cleaned version)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
