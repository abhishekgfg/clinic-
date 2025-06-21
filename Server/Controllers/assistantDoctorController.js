const Appointment = require("../models/Appointment");
const AssistantDoctor = require("../models/AssistantDoctor");

exports.getConfirmedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "confirmed" }).populate("patientId");
    const records = await AssistantDoctor.find();

    const paymentMap = {};
    for (const record of records) {
      paymentMap[record.appointmentId] = record;
    }

    const merged = appointments.map((appt) => {
      const payment = paymentMap[appt._id] || {};
      return {
        ...appt._doc,
        paymentStatus: payment.status || "",
        paymentDetails: payment.details || "",
        medicineExplain: payment.medicineExplain || "",
        nextFollowUp: payment.nextFollowUp || "",
        isSaved: !!payment.status,
        displayId: payment.displayId || "",
      };
    });

    res.status(200).json(merged);
  } catch (err) {
    console.error("Error fetching confirmed appointments:", err);
    res.status(500).json({ error: "Failed to fetch confirmed appointments" });
  }
};

exports.savePaymentInfo = async (req, res) => {
  const { status, details, username, medicineExplain, nextFollowUp, displayId } = req.body;
  const { appointmentId } = req.params;

  if (!status || !username || !displayId) {
    return res.status(400).json({ message: "Status, username, and displayId are required." });
  }

  try {
    const appointment = await Appointment.findById(appointmentId).populate("patientId");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // ✅ Check if displayId already exists for a different appointment
    const duplicateDisplayId = await AssistantDoctor.findOne({
      displayId,
      appointmentId: { $ne: appointmentId },
    });

    if (duplicateDisplayId) {
      return res.status(409).json({ message: "Display ID already exists." });
    }

    const patientName = appointment.patientId?.name || "N/A";
    const contact = appointment.patientId?.contact || "N/A";

    const payload = {
      appointmentId,
      username,
      status,
      details,
      displayId,
      medicineExplain,
      nextFollowUp,
      patientName,
      contact,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      message: appointment.message,
      notes: appointment.notes,
      action: "Saved",
    };

    let existing = await AssistantDoctor.findOne({ appointmentId });

    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      return res.status(200).json({ message: "Payment info updated", data: existing });
    }

    const newRecord = new AssistantDoctor(payload);
    await newRecord.save();

    res.status(200).json({ message: "Payment info saved successfully", data: newRecord });
  } catch (error) {
    console.error("Error saving assistant payment info:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




