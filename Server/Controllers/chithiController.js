const MedicineRecord = require("../models/MedicineRecord");
const ChithiRecord = require("../models/ChithiRecord");

// ✅ GET all chithi records (from MedicineRecord with medicineStatus "Medicine Ready")
exports.getAllChithiRecords = async (req, res) => {
  try {
    // Fetch only records with medicineStatus === "Medicine Ready"
    const medicineRecords = await MedicineRecord.find(
      { medicineStatus: "Medicine Ready" },
      {
        displayId: 1,
        patientName: 1,
        contact: 1,
        date: 1,
        time: 1,
        location: 1,
        paymentStatus: 1,
        details: 1,
        medicineExplain: 1,
        nextFollowUp: 1,
        referenceNumber: 1,
        action: 1,
        medicineStatus: 1,
      }
    ).sort({ createdAt: -1 });

    const saved = await ChithiRecord.find();

    const combined = medicineRecords.map((rec) => {
      const match = saved.find((r) => r.accountId.toString() === rec._id.toString());
      return {
        ...rec.toObject(),
        chithiStatus: match?.chithiStatus || "In Progress",
      };
    });

    res.status(200).json(combined);
  } catch (err) {
    console.error("Error fetching chithi records:", err);
    res.status(500).json({ error: "Failed to fetch chithi records" });
  }
};

// ✅ POST (Save or Update) chithi record
exports.saveChithiRecord = async (req, res) => {
  try {
    const {
      accountId,
      displayId,
      patientName,
      contact,
      date,
      time,
      location,
      paymentStatus,
      details,
      medicineExplain,
      nextFollowUp,
      referenceNumber,
      action,
      chithiStatus,
    } = req.body;

    const existing = await ChithiRecord.findOne({ accountId });

    if (existing) {
      Object.assign(existing, {
        displayId,
        patientName,
        contact,
        date,
        time,
        location,
        paymentStatus,
        details,
        medicineExplain,
        nextFollowUp,
        referenceNumber,
        action,
        chithiStatus,
      });
      await existing.save();
    } else {
      await ChithiRecord.create({
        accountId,
        displayId,
        patientName,
        contact,
        date,
        time,
        location,
        paymentStatus,
        details,
        medicineExplain,
        nextFollowUp,
        referenceNumber,
        action,
        chithiStatus,
      });
    }

    res.status(200).json({ message: "Chithi record saved." });
  } catch (err) {
    console.error("Error saving chithi record:", err);
    res.status(500).json({ error: "Save failed" });
  }
};
