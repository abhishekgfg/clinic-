const PackageRecord = require("../models/PackageRecord");
const CourierRecord = require("../models/CourierRecord");

// 🔍 GET all package records (only if packageStatus = "Package Done")
exports.getAllCourierRecords = async (req, res) => {
  try {
    const packages = await PackageRecord.find({ packageStatus: "Package Done" }).sort({ createdAt: -1 });
    const savedCouriers = await CourierRecord.find();

    const merged = packages.map((rec) => {
      const match = savedCouriers.find(
        (c) => c.packageId.toString() === rec._id.toString()
      );

      return {
        ...rec.toObject(),
        courierStatus: match?.courierStatus || "In Progress",
        trackingId: match?.trackingId || "",
        packageId: rec._id,
      };
    });

    res.status(200).json(merged);
  } catch (err) {
    console.error("Error fetching courier records:", err);
    res.status(500).json({ error: "Failed to fetch courier records" });
  }
};

// 💾 Save or Update Courier Status
exports.saveCourierRecord = async (req, res) => {
  try {
    const {
      packageId,
      displayId,
      patientName,
      contact,
      date,
      time,
      location,
      paymentStatus,
      details,
      nextFollowUp,
      action,
      referenceNumber,
      chithiStatus,
      packageStatus,
      courierStatus,
      trackingId,
    } = req.body;

    const existing = await CourierRecord.findOne({ packageId });

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
        nextFollowUp,
        action,
        referenceNumber,
        chithiStatus,
        packageStatus,
        courierStatus,
        trackingId,
      });
      await existing.save();
    } else {
      await CourierRecord.create({
        packageId,
        displayId,
        patientName,
        contact,
        date,
        time,
        location,
        paymentStatus,
        details,
        nextFollowUp,
        action,
        referenceNumber,
        chithiStatus,
        packageStatus,
        courierStatus,
        trackingId,
      });
    }

    res.status(200).json({ message: "Courier record saved." });
  } catch (err) {
    console.error("Error saving courier record:", err);
    res.status(500).json({ error: "Save failed" });
  }
};
