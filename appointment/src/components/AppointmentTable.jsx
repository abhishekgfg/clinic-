// src/components/AppointmentTable.js
import React, { useEffect, useState } from "react";
import "../style/AppointmentTable.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const statusOptions = ["Scheduled", "Cancelled", "Rescheduled"];

const AppointmentTable = ({ appointments }) => {
  const [localAppointments, setLocalAppointments] = useState([]);
  const { user } = useAuth();

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
      alert("Failed to update appointment status");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/appointments/${id}`, {
        headers: { username: user.username }
      });
      setLocalAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="appointment-card table-card">
      <h2>📋 Appointment Records</h2>
      <div className="appointment-table-container">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {user.role === "admin" && <th>Action</th>}
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
                  {user.role === "admin" && (
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(app._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
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
