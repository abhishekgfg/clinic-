const mongoose = require("mongoose");

const courierRecordSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackageRecord",
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
    nextFollowUp: String,
    action: String,
    referenceNumber: String,
    chithiStatus: String,
    packageStatus: String,
    courierStatus: {
      type: String,
      enum: ["In Progress", "Courier Done"],
      default: "In Progress",
    },
    trackingId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourierRecord", courierRecordSchema);
