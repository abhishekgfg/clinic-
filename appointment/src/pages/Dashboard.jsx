import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentTable from "../components/AppointmentTable";
import "../style/Dashboard.css";
import "../style/Patients.css";
import AppointmentSection from '../components/AppointmentSection';
import { useAuth } from "../context/AuthContext";

// ✅ Add Patient Form
const AddPatientForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.contact) {
      alert("Please fill in all required fields.");
      return;
    }
    await onAdd(formData);
    setFormData({ name: "", age: "", contact: "", email: "" });
  };

  return (
    <form className="add-patient-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Contact"
        value={formData.contact}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email (optional)"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">➕ Add Patient</button>
    </form>
  );
};

const PatientsSection = ({ patients, fetchData }) => {
  const { user } = useAuth();
  const [selectedPatients, setSelectedPatients] = useState([]);

  const handleSelect = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedPatients.length === 0) return alert("No patients selected.");
    if (!window.confirm("Are you sure you want to delete selected patients?")) return;

    for (const id of selectedPatients) {
      await axios.delete(`/api/patients/delete/${id}`);
    }
    await fetchData();
    setSelectedPatients([]);
  };

  const handleEdit = async (p) => {
    const name = prompt("Edit Name", p.name);
    const age = prompt("Edit Age", p.age);
    const contact = prompt("Edit Contact", p.contact);
    const email = prompt("Edit Email", p.email);

    if (name && age && contact) {
      try {
        await axios.put(`/api/patients/update/${p._id}`, {
          name,
          age,
          contact,
          email
        });
        fetchData();
      } catch (err) {
        alert("Failed to update patient");
        console.error(err);
      }
    } else {
      alert("Name, Age, and Contact are required");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const patient of jsonData) {
          await axios.post("/api/patients/add", patient, {
            headers: {
              username: user?.username
            }
          });
        }

        await fetchData();
        alert("✅ Patients imported successfully!");
      } catch (err) {
        console.error("Import error:", err);
        alert("❌ Error importing patient data.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="card">
        <h2>➕ Add New Patient</h2>
        <AddPatientForm
          onAdd={async (data) => {
            await axios.post("/api/patients/add", data, {
              headers: {
                username: user?.username
              }
            });
            fetchData();
          }}
        />
        <div className="import-section">
          <h4>📁 Import from Excel/CSV</h4>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileUpload}
            className="file-upload"
          />
        </div>
      </div>

      <div className="table-card">
        <h2 className="section-heading">🧾 Patient Details</h2>

        {user?.role === "admin" && (
          <button className="delete-selected-btn" onClick={handleDeleteSelected}>
            🗑️ Delete Selected
          </button>
        )}

        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === patients.length && patients.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPatients(patients.map((p) => p._id));
                      } else {
                        setSelectedPatients([]);
                      }
                    }}
                  />
                </th>
                <th>Name</th>
                <th>Age</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(p._id)}
                        onChange={() => handleSelect(p._id)}
                      />
                    </td>
                    <td>{p.name || p.fullName || "N/A"}</td>
                    <td>{p.age || "N/A"}</td>
                    <td>{p.contact || p.phone || "N/A"}</td>
                    <td>{p.email || "N/A"}</td>
                    <td>
                      <select
                        value={p.status || "In Progress"}
                        className="status-dropdown"
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await axios.put(`/api/patients/update-status/${p._id}`, {
                              status: newStatus
                            });
                            fetchData();
                          } catch (err) {
                            console.error("Status update error:", err);
                            alert("❌ Failed to update status.");
                          }
                        }}
                      >
                        <option>In Progress</option>
                        <option>Call</option>
                        <option>Ready for Consultation</option>
                        <option>Payment Done</option>
                        <option>Scheduled</option>
                      </select>
                    </td>
                    <td>
                      {user?.role === "admin" && (
                        <>
                          <button className="edit-btn" onClick={() => handleEdit(p)}>
                            ✏️ Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={async () => {
                              if (window.confirm("Delete this patient?")) {
                                await axios.delete(`/api/patients/delete/${p._id}`);
                                fetchData();
                              }
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const generateTimeSlots = () => {
  const startHour = 9;
  const endHour = 20;
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = min === 0 ? "00" : "30";
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

const AppointmentsSection = ({ patients, appointments, fetchData }) => {
  const { user } = useAuth(); // ✅ using AuthContext for current user
  const timeSlots = generateTimeSlots();

  const eligiblePatients = patients.filter(
    (p) => p.status === "Payment Done" || p.status === "Scheduled"
  );

  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.date || !formData.time) {
      return alert("Please fill all required fields");
    }

    try {
      await axios.post("/api/appointments/add", formData, {
        headers: {
          username: user.username, // ✅ Send username to backend
        },
      });
      setFormData({ patientId: "", date: "", time: "", notes: "" });
      fetchData();
    } catch (error) {
      console.error("Appointment error:", error.response?.data || error.message);
      alert("Failed to schedule appointment");
    }
  };

  return (
    <div className="appointments-section">
      {/* Form Section */}
      <div className="appointment-form-container">
        <h2 className="section-title">📅 Schedule an Appointment</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {eligiblePatients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">Select Time</option>
            {timeSlots.map((slot, i) => (
              <option key={i} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <textarea
            name="notes"
            placeholder="Add any notes (optional)"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>

          <button type="submit">➕ Schedule</button>
        </form>
      </div>

      <AppointmentTable appointments={appointments} />
    </div>
  );
};
// ✅ Dashboard Overview


const DashboardHome = ({ patients, appointments, setActiveSection, setSelectedStatus }) => {
  const statusCounts = {
    "In Progress": 0,
    "Call": 0,
    "Ready for Consultation": 0,
    "Payment Done": 0,
    "Scheduled": 0,
    "Rescheduled": 0,
  };

  patients.forEach((p) => {
    const status = p.status || "In Progress";
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    }
  });

  const rescheduledAppointmentsCount = appointments.filter(
    (app) => app.status === "Rescheduled"
  ).length;

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setActiveSection("patients");
  };

  return (
    <>
      <div className="dashboard-header">
        <h1>🩺 Clinic Management Dashboard</h1>
        <p>Manage patients, appointments, and progress stages.</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card" onClick={() => handleStatusClick(null)}>
          <h3>Total Patients</h3>
          <p>{patients.length}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveSection("appointments")}>
          <h3>Total Appointments</h3>
          <p>{appointments.length}</p>
        </div>
        <div className="stat-card status-in-progress" onClick={() => handleStatusClick("In Progress")}>
          <h3>In Progress</h3>
          <p>{statusCounts["In Progress"]}</p>
        </div>
        <div className="stat-card status-call" onClick={() => handleStatusClick("Call")}>
          <h3>Call</h3>
          <p>{statusCounts["Call"]}</p>
        </div>
        <div className="stat-card status-consult" onClick={() => handleStatusClick("Ready for Consultation")}>
          <h3>Ready for Consultation</h3>
          <p>{statusCounts["Ready for Consultation"]}</p>
        </div>
        <div className="stat-card status-payment" onClick={() => handleStatusClick("Payment Done")}>
          <h3>Payment Done</h3>
          <p>{statusCounts["Payment Done"]}</p>
        </div>
        <div className="stat-card status-scheduled" onClick={() => handleStatusClick("Scheduled")}>
          <h3>Scheduled</h3>
          <p>{statusCounts["Scheduled"]}</p>
        </div>
        <div className="stat-card status-rescheduled" onClick={() => setActiveSection("appointments")}>
          <h3>Rescheduled Appointments</h3>
          <p>{rescheduledAppointmentsCount}</p>
        </div>
      </div>
    </>
  );
};

const Dashboard = ({ onLogout }) => {
  const { user } = useAuth(); // ✅ get logged-in user

  const [activeSection, setActiveSection] = useState("home");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const fetchData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        axios.get("/api/patients/all", {
          headers: { username: user.username }, // ✅ send username
        }),
        axios.get("/api/appointments/all", {
          headers: { username: user.username }, // ✅ send username
        }),
      ]);
      setPatients(pRes.data || []);
      setAppointments(aRes.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPatients = selectedStatus
    ? patients.filter((p) => (p.status || "In Progress") === selectedStatus)
    : patients;

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div
        className="dashboard-container"
        style={{ marginLeft: "240px", padding: "30px", width: "100%" }}
      >
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Welcome, {user.username}</h2> {/* ✅ replaced loggedInUser */}
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        {activeSection === "home" && (
          <DashboardHome
            patients={patients}
            appointments={appointments}
            setActiveSection={setActiveSection}
            setSelectedStatus={setSelectedStatus}
          />
        )}

        {activeSection === "patients" && (
          <PatientsSection
            patients={filteredPatients}
            fetchData={fetchData}
          />
        )}

        {activeSection === "appointments" && (
          <AppointmentsSection
            patients={patients}
            appointments={appointments}
            fetchData={fetchData}
          />
        )}
      </div>
    </div>
  );
};

<AppointmentSection />

export default Dashboard;
