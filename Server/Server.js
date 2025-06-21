const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const assistantDoctorRoutes = require("./routes/assistantDoctorRoutes"); // ✅ FIXED lowercase
const accountRoutes = require("./routes/accountRoutes"); 
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-url.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Clinic Backend is Live ✅");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assistant", assistantDoctorRoutes); // ✅ Route will now work
app.use("/api/account", accountRoutes);
app.use("/api/medicine", medicineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
