import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentTable from "../components/AppointmentTable";

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/appointments/${id}`);
      // ✅ Remove from local state
      setAppointments((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment123334");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/appointments/${id}/status`, { status: newStatus });
      // ✅ Update local state
      setAppointments((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <AppointmentTable
        appointments={appointments}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AppointmentsSection;
