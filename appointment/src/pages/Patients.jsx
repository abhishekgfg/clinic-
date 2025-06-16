import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import '../style/Patients.css';

const statusOptions = [
  "In Progress",
  "Call",
  "Ready for Consultation",
  "Payment Done",
  "Scheduled",
];

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/patients/all');
      setPatients(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.contact) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('/api/patients/add', formData);
      setFormData({ name: '', age: '', contact: '', email: '' });
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert('Failed to add patient');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/patients/update-status/${id}`, { status: newStatus });
      setPatients((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert('❌ Failed to update status');
      console.error(err);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const patient of jsonData) {
          await axios.post('/api/patients/add', patient);
        }
        await fetchPatients();
        alert('✅ Patients imported successfully!');
      } catch (err) {
        console.error('Import error:', err);
        alert('❌ Error importing patient data.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  if (loading) return <div className="loader-container">Loading patients...</div>;
  if (error) return <div className="error-container"><p>{error}</p></div>;

  return (
    <div className="patients-container">
      <h1 className="patients-heading">👨‍⚕️ Patient Management</h1>

      {/* Add New Patient Form */}
      <div className="card">
        <h2>Add New Patient</h2>
        <form className="add-patient-form" onSubmit={handleAddPatient}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit">➕ Add Patient</button>
        </form>

        <div className="import-section" style={{ marginTop: '20px' }}>
          <h4>📁 Import from Excel/CSV</h4>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileUpload}
            className="file-upload"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="table-card redesigned-table" style={{ marginTop: '40px' }}>
        <h2>🧾 Patient Details</h2>
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="patients-no-data">No patients found.</td>
                </tr>
              ) : (
                patients.map((p, index) => (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>{p.name || p.fullName || 'N/A'}</td>
                    <td>{p.age || 'N/A'}</td>
                    <td>{p.contactNumber || p.phone || p.mobile || p.contact || 'N/A'}</td>
                    <td>{p.email || 'N/A'}</td>
                    <td>
                      <select
                        value={p.status || 'In Progress'}
                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        className="status-dropdown"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default Patients;
