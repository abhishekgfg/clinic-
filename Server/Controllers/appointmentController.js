const Appointment = require("../Models/Appointment");

exports.addAppointment = async (req, res) => {
  const { patientId, date, time, notes } = req.body;
  const username = req.headers.username;

  if (!patientId || !username || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newAppointment = new Appointment({
      patientId,
      date,
      time,
      notes,
      createdBy: username,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add appointment" });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const username = req.headers.username;
    const query = username === "abhi" ? {} : { createdBy: username };

    const appointments = await Appointment.find(query).populate("patientId");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Status updated", appointment: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const username = req.headers.username;
    if (username !== "abhi") {
      return res.status(403).json({ error: "Access Denied: Only abhi can delete." });
    }

    const found = await Appointment.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "Appointment not found" });

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
