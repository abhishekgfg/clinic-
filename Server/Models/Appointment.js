const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  date: String,
  time: String,
  notes: String,
  createdBy: { type: String, required: true },
  status: { type: String, default: "Scheduled" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
