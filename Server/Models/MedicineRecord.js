const mongoose = require("mongoose");

const medicineRecordSchema = new mongoose.Schema(
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
    medicineStatus: {
      type: String,
      enum: ["In Progress", "Medicine Ready"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicineRecord", medicineRecordSchema);
