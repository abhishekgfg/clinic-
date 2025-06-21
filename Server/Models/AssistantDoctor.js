  const mongoose = require("mongoose");

  const assistantDoctorSchema = new mongoose.Schema(
    {
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
      },
      displayId: {
        type: String,
        required: true,
        unique: true,
      },
      status: {
        type: String,
        enum: ["Paid", "Not Paid"],
        required: true,
      },
      details: { type: String },
      medicineExplain: { type: String },
      nextFollowUp: { type: String },
      patientName: { type: String, required: true },
      contact: { type: String, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      location: { type: String, required: true },
      message: { type: String },
      notes: { type: String },
      action: { type: String, default: "Saved" },
      
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("AssistantDoctor", assistantDoctorSchema);
