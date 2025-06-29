const GooglePatient = require("../models/GooglePatientModel");

// GET /api/google-patients/all?status=Payment%20Done,Schedule
const getGooglePatients = async (req, res) => {
  try {
    const statusQuery = req.query.status;

    let filter = {};
    if (statusQuery) {
      const statuses = statusQuery.split(",");
      filter.status = { $in: statuses };
    }

    const data = await GooglePatient.find(filter).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

const mergeAndCleanPatients = (data) => {
  const merged = {};

  data.forEach((p) => {
    const name = p.name?.trim();
    const age = p.age?.trim();
    const contact = p.contact?.trim();
    const email = p.email?.trim().toLowerCase();

    const key = contact || email;
    if (!key || !name || (!contact && !email)) return;

    if (!merged[key]) {
      merged[key] = { name, age, contact, email };
    } else {
      merged[key].name = merged[key].name || name;
      merged[key].age = merged[key].age || age;
      merged[key].contact = merged[key].contact || contact;
      merged[key].email = merged[key].email || email;
    }
  });

  return Object.values(merged);
};

const importGooglePatients = async (req, res) => {
  try {
    const rawData = Array.isArray(req.body) ? req.body : [];
    if (rawData.length === 0) {
      return res.status(400).json({ message: "No patient data received." });
    }

    const incoming = mergeAndCleanPatients(rawData);
    const existing = await GooglePatient.find();
    const existingMap = new Map();

    existing.forEach((p) => {
      const key = (p.contact || p.email || "").toLowerCase();
      if (key) existingMap.set(key, p);
    });

    const toInsert = [];
    const toUpdate = [];

    for (const p of incoming) {
      const key = (p.contact || p.email || "").toLowerCase();
      const existing = existingMap.get(key);

      if (!existing) {
        toInsert.push(p);
      } else {
        if (
          existing.name !== p.name ||
          existing.age !== p.age ||
          existing.contact !== p.contact ||
          existing.email !== p.email
        ) {
          toUpdate.push({ _id: existing._id, ...p });
        }
      }
    }

    if (toInsert.length > 0) await GooglePatient.insertMany(toInsert);
    for (const p of toUpdate) await GooglePatient.findByIdAndUpdate(p._id, p);

    res.status(200).json({
      message: `${toInsert.length} added, ${toUpdate.length} updated`,
      added: toInsert.length,
      updated: toUpdate.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to import patients", error });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await GooglePatient.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({ message: "Status updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};

module.exports = { importGooglePatients, getGooglePatients, updateStatus };
