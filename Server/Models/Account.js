const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    assistantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssistantDoctor",
      required: true,
    },
    displayId: { type: String, required: true }, // e.g., M01, M02

    patientName: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    message: { type: String },
    notes: { type: String },

    paymentStatus: { type: String },
    details: { type: String },
    medicineExplain: { type: String },
    nextFollowUp: { type: String },

    action: { type: String },
    referenceNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
