const Account = require("../models/Account");

// ✅ Get all records with medicine-related fields
exports.getAllMedicineRecords = async (req, res) => {
  try {
   const records = await Account.find({}, {
  displayId: 1,
  patientName: 1,
  contact: 1,
  date: 1,
  time: 1,
  location: 1,
  details: 1,
  medicineExplain: 1,
  nextFollowUp: 1,
  referenceNumber: 1,
  action: 1,
  paymentStatus: 1, // ✅ ADD THIS LINE
}).sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching medicine records:", err);
    res.status(500).json({ error: "Failed to fetch medicine records" });
  }
};


