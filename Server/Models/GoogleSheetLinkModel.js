const mongoose = require("mongoose");

const googleSheetLinkSchema = new mongoose.Schema({
  sheetUrl: { type: String, required: true },
  sheetId: String,
  lastSyncedAt: Date,
  data: [
    {
      name: String,
      age: String,
      contact: String,
      email: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("GoogleSheetLink", googleSheetLinkSchema);
