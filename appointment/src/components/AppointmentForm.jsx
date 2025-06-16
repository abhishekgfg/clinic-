import React, { useState } from 'react';

const AppointmentForm = ({ onAdd, patients = [] }) => {
  const [form, setForm] = useState({ 
    patientId: '', 
    doctor: '', 
    date: '', 
    time: '' 
  });

  const handleChange = (e) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patientId) {
      alert('Please select a patient');
      return;
    }
    onAdd(form);
    setForm({ patientId: '', doctor: '', date: '', time: '' });
  };

  return (
    <div className="appointment-form">
      <h3>Add New Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient</label>
          <select 
            name="patientId" 
            value={form.patientId} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Patient</option>
            {Array.isArray(patients) && patients.length > 0 ? (
              patients.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name}
                </option>
              ))
            ) : (
              <option disabled>No patients available</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Doctor</label>
          <input 
            name="doctor" 
            value={form.doctor} 
            onChange={handleChange} 
            placeholder="Doctor name" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input 
            name="date" 
            value={form.date} 
            onChange={handleChange} 
            type="date" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input 
            name="time" 
            value={form.time} 
            onChange={handleChange} 
            type="time" 
            required 
          />
        </div>

        <button type="submit" className="submit-btn">
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;