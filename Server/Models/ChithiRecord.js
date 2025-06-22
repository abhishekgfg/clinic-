const mongoose = require("mongoose");

const chithiRecordSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true,
    },
    displayId: String,
    patientName: String,
    contact: String,
    date: String,
    time: String,
    location: String,
    paymentStatus: String,
    details: String,
    medicineExplain: String,
    nextFollowUp: String,
    referenceNumber: String,
    action: String,
    chithiStatus: {
      type: String,
      enum: ["In Progress", "Chithi Done"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChithiRecord", chithiRecordSchema);
