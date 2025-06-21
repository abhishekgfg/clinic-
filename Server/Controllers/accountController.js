// controllers/accountController.js
const AssistantDoctor = require("../models/AssistantDoctor");
const Account = require("../models/Account");

// ✅ Fetch joined data with all required fields
exports.getAllAccountRecords = async (req, res) => {
  try {
    const assistants = await AssistantDoctor.find().sort({ createdAt: -1 });

    const fullRecords = await Promise.all(
      assistants.map(async (record) => {
        const accountData = await Account.findOne({ assistantId: record._id });

        return {
          ...record.toObject(),
          referenceNumber: accountData?.referenceNumber || "",
          displayId: accountData?.displayId || record.displayId || "",
          details: accountData?.details || record.details || "",
          medicineExplain: accountData?.medicineExplain || record.medicineExplain || "",
          nextFollowUp: accountData?.nextFollowUp || record.nextFollowUp || "",
        };
      })
    );

    res.status(200).json(fullRecords);
  } catch (err) {
    console.error("Error fetching account data:", err);
    res.status(500).json({ error: "Failed to fetch account data" });
  }
};
// ✅ Update status
exports.updateAccountStatus = async (req, res) => {
  try {
    const { actionStatus } = req.body;
    const { id } = req.params;

    const record = await AssistantDoctor.findById(id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    record.action = actionStatus;
    await record.save();

    res.status(200).json({ message: "Status updated", data: record });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ✅ Save full account data
exports.saveFullAccountRecord = async (req, res) => {
  try {
    const {
      assistantId,
      displayId,
      patientName,
      contact,
      date,
      time,
      location,
      message,
      notes,
      paymentStatus,
      details,
      medicineExplain,
      nextFollowUp,
      action,
      referenceNumber,
    } = req.body;

    if (!assistantId || !patientName || !contact || !date || !time || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Account.findOne({ assistantId });
    if (existing) {
      return res.status(400).json({ error: "Account record already exists" });
    }

    const newRecord = new Account({
      assistantId,
      displayId,
      patientName,
      contact,
      date,
      time,
      location,
      message,
      notes,
      paymentStatus,
      details,
      medicineExplain,
      nextFollowUp,
      action,
      referenceNumber,
    });

    await newRecord.save();
    res.status(201).json({ message: "Full account record saved", data: newRecord });
  } catch (err) {
    console.error("Error saving full record:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get saved records
exports.getSavedAccountRecords = async (req, res) => {
  try {
    const records = await Account.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching saved records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

// ✅ Add payment reference (simple)
exports.addPaymentReference = async (req, res) => {
  try {
    const { assistantId, referenceNumber } = req.body;
    if (!assistantId || !referenceNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Account.findOne({ assistantId });
    if (existing) {
      return res.status(400).json({ error: "Reference already exists" });
    }

    const newRef = new Account({ assistantId, referenceNumber });
    await newRef.save();

    res.status(201).json({ message: "Reference saved", data: newRef });
  } catch (err) {
    console.error("Error saving reference:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update details (after record exists)
exports.updateAccountDetails = async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { details, medicineExplain, nextFollowUp } = req.body;

    const record = await Account.findOne({ assistantId });
    if (!record) {
      return res.status(404).json({ error: "Account record not found" });
    }

    record.details = details;
    record.medicineExplain = medicineExplain;
    record.nextFollowUp = nextFollowUp;

    await record.save();
    res.status(200).json({ message: "Account details updated", data: record });
  } catch (err) {
    console.error("Error updating details:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ✅ Update reference number if record already exists
exports.updateReferenceNumber = async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { referenceNumber } = req.body;

    if (!referenceNumber) {
      return res.status(400).json({ error: "Reference number is required" });
    }

    const record = await Account.findOne({ assistantId });
    if (!record) {
      return res.status(404).json({ error: "Account record not found" });
    }

    record.referenceNumber = referenceNumber;
    await record.save();

    res.status(200).json({ message: "Reference number updated", data: record });
  } catch (err) {
    console.error("Error updating reference:", err);
    res.status(500).json({ error: "Update failed" });
  }
};
