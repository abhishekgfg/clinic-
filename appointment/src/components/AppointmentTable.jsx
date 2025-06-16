import React, { useEffect, useState } from "react";
import "../style/AppointmentTable.css";
import axios from "axios";

const statusOptions = ["Scheduled", "Cancelled", "Rescheduled"];

const AppointmentTable = ({ appointments, loggedInUser }) => {
  const [localAppointments, setLocalAppointments] = useState([]);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/appointments/${id}/status`, { status: newStatus });
      setLocalAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
    } catch (error) {
      console.error("Error updating status", error.response?.data || error.message);
      alert("Failed to update appointment status");
    }
  };

  const handleDelete = async (id) => {
    if (loggedInUser !== "abhi") {
      alert("Access Denied: You do not have permission to delete appointments.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/appointments/${id}`, {
        headers: { username: loggedInUser }
      });

      setLocalAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Error deleting appointment", error.response?.data || error.message);
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="appointment-card table-card">
      <h2>📋 Appointment Records</h2>
      <div className="appointment-table-container">
        <h2 className="appointment-heading">Appointment Schedule</h2>
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {localAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No appointments found</td>
              </tr>
            ) : (
              localAppointments.map((app) => (
                <tr key={app._id}>
                  <td>{app.patientId?.name || "N/A"}</td>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td>
                    <select
                      className="status-dropdown"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(app._id)}
                      disabled={loggedInUser !== "abhi"}
                      style={{
                        opacity: loggedInUser === "abhi" ? 1 : 0.5,
                        cursor: loggedInUser === "abhi" ? "pointer" : "not-allowed"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
