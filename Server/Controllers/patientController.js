const Patient = require('../Models/Patient');

// Get all patients (admin sees all, others see only theirs)
exports.getAllPatients = async (req, res) => {
  try {
    const username = req.headers.username;
    const query = username === 'abhi' ? {} : { createdBy: username };

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// Add a new patient
exports.addPatient = async (req, res) => {
  const { name, age, contact, email } = req.body;
  const username = req.headers.username;

  if (!name || !username) return res.status(400).json({ error: 'Name and username required' });

  try {
    const newPatient = new Patient({ name, age, contact, email, createdBy: username });
    await newPatient.save();
    res.status(201).json({ message: 'Patient added', patient: newPatient });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add patient' });
  }
};

// Bulk Add Patients
exports.bulkAddPatients = async (req, res) => {
  const username = req.headers.username;
  const data = req.body;

  if (!Array.isArray(data) || !username) {
    return res.status(400).json({ error: 'Invalid data or missing username' });
  }

  try {
    const valid = data.filter(p => p.name).map(p => ({ ...p, createdBy: username }));
    const inserted = await Patient.insertMany(valid);
    res.status(201).json({ message: `${inserted.length} patients added`, patients: inserted });
  } catch (err) {
    res.status(500).json({ error: 'Bulk import failed' });
  }
};

// Update patient status only
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Status updated', patient: updated });
  } catch (err) {
    res.status(500).json({ error: 'Status update failed' });
  }
};

// Edit full patient details
exports.updatePatient = async (req, res) => {
  const { name, age, contact, email } = req.body;
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, contact, email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient updated', patient: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
