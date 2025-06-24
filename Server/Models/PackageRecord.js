const mongoose = require("mongoose");

const packageRecordSchema = new mongoose.Schema(
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
    chithiStatus: String,
    medicineStatus: String,
    packageStatus: {
      type: String,
      enum: ["In Progress", "Package Done"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PackageRecord", packageRecordSchema);
