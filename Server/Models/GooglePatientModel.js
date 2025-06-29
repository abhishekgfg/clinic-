const mongoose = require("mongoose");

const googlePatientSchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    contact: String,
    email: String,
    status: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError during hot reloads
module.exports = mongoose.models.GooglePatient || mongoose.model("GooglePatient", googlePatientSchema);
