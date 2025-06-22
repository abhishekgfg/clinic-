const Account = require("../models/Account");
const MedicineRecord = require("../models/MedicineRecord");

exports.getAllMedicineRecords = async (req, res) => {
  try {
    const accounts = await Account.find({}, {
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
    }).sort({ createdAt: -1 });

    const saved = await MedicineRecord.find();

    const combined = accounts.map((acc) => {
      const match = saved.find((r) => r.accountId.toString() === acc._id.toString());
      return {
        ...acc.toObject(),
        medicineStatus: match?.medicineStatus || "In Progress",
      };
    });

    res.status(200).json(combined);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch medicine records" });
  }
};

exports.saveMedicineRecord = async (req, res) => {
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
      medicineStatus,
    } = req.body;

    const existing = await MedicineRecord.findOne({ accountId });

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
        medicineStatus,
      });
      await existing.save();
    } else {
      await MedicineRecord.create({
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
        medicineStatus,
      });
    }

    res.status(200).json({ message: "Medicine record saved." });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Save failed" });
  }
};
