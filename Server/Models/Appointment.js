const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  date: String,
  time: String,
  notes: String,
  location: { type: String, required: true },
  message: { type: String },
  createdBy: { type: String, required: true },
  status: { type: String, default: "Scheduled" },

  // ✅ Add these fields for payment info:
  paymentStatus: { type: String, enum: ["Paid", "Not Paid"], default: "Not Paid" },
  paymentDetails: { type: String },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
