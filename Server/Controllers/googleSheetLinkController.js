const GoogleSheetLink = require("../models/GoogleSheetLinkModel");

// POST /api/google-sheet
const saveSheetLink = async (req, res) => {
  const { sheetUrl, sheetId, data, lastSyncedAt } = req.body;
  if (!sheetUrl || !data) return res.status(400).json({ message: "Sheet URL and data required" });

  try {
    const updated = await GoogleSheetLink.findOneAndUpdate(
      {},
      { sheetUrl, sheetId, data, lastSyncedAt },
      { upsert: true, new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to save Google Sheet", error });
  }
};

// GET /api/google-sheet
const getSheetLink = async (req, res) => {
  try {
    const saved = await GoogleSheetLink.findOne();
    if (!saved) return res.status(404).json({ message: "No Google Sheet connected." });
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Google Sheet", error });
  }
};

// DELETE /api/google-sheet
const deleteSheetLink = async (req, res) => {
  try {
    await GoogleSheetLink.deleteMany({});
    res.status(200).json({ message: "Google Sheet link removed." });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove link", error });
  }
};

module.exports = {
  saveSheetLink,
  getSheetLink,
  deleteSheetLink,
};
