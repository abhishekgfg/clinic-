const ChithiRecord = require("../models/ChithiRecord");
const PackageRecord = require("../models/PackageRecord");

// ✅ GET all records where chithiStatus = "Chithi Done"
exports.getAllPackageRecords = async (req, res) => {
  try {
    const chithiRecords = await ChithiRecord.find({ chithiStatus: "Chithi Done" }).sort({ createdAt: -1 });
    const savedPackages = await PackageRecord.find();

    const combined = chithiRecords.map((rec) => {
      const match = savedPackages.find(
        (p) => p.accountId.toString() === rec.accountId.toString()
      );

      return {
        ...rec.toObject(),
        packageStatus: match?.packageStatus || "In Progress",
      };
    });

    res.status(200).json(combined);
  } catch (err) {
    console.error("Error fetching package records:", err);
    res.status(500).json({ error: "Failed to fetch package records" });
  }
};

// ✅ POST or UPDATE package status
exports.savePackageRecord = async (req, res) => {
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
      medicineStatus,
      packageStatus,
    } = req.body;

    const existing = await PackageRecord.findOne({ accountId });

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
        medicineStatus,
        packageStatus,
      });
      await existing.save();
    } else {
      await PackageRecord.create({
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
        medicineStatus,
        packageStatus,
      });
    }

    res.status(200).json({ message: "Package record saved." });
  } catch (err) {
    console.error("Error saving package record:", err);
    res.status(500).json({ error: "Save failed" });
  }
};
