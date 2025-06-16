const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  contact: String,
  email: String,
  status: {
    type: String,
    enum: ['In Progress', 'Call', 'Ready for Consultation', 'Payment Done', 'Scheduled'],
    default: 'In Progress',
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
