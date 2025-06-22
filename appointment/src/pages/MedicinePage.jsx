import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../style/MedicinePage.css";

const MedicinePage = () => {
  const [records, setRecords] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  // Search filters
  const [searchFields, setSearchFields] = useState({
    displayId: "",
    patientName: "",
    contact: "",
    date: "",
    time: "",
    location: "",
    details: "",
    followUp: "",
    referenceNumber: "",
    medicineStatus: "",
  });

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicine/all");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching medicine data:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleStatusChange = (id, value) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitStatus = async (r) => {
    const selectedStatus = statusUpdates[r._id];
    if (!selectedStatus) return alert("Please select a status before saving.");

    try {
      await axios.post("http://localhost:5000/api/medicine/save", {
        accountId: r._id,
        displayId: r.displayId,
        patientName: r.patientName,
        contact: r.contact,
        date: r.date,
        time: r.time,
        location: r.location,
        paymentStatus: r.paymentStatus,
        details: r.details,
        medicineExplain: r.medicineExplain,
        nextFollowUp: r.nextFollowUp,
        referenceNumber: r.referenceNumber,
        action: r.action,
        medicineStatus: selectedStatus,
      });
      alert("✅ Medicine status updated.");
      fetchRecords();
    } catch (err) {
      console.error("Failed to update medicine status:", err);
      alert("❌ Error saving medicine status.");
    }
  };

  const filtered = records.filter((r) => {
    return (
      r.displayId?.toLowerCase().includes(searchFields.displayId.toLowerCase()) &&
      r.patientName?.toLowerCase().includes(searchFields.patientName.toLowerCase()) &&
      r.contact?.toLowerCase().includes(searchFields.contact.toLowerCase()) &&
      r.date?.includes(searchFields.date) &&
      r.time?.toLowerCase().includes(searchFields.time.toLowerCase()) &&
      r.location?.toLowerCase().includes(searchFields.location.toLowerCase()) &&
      r.details?.toLowerCase().includes(searchFields.details.toLowerCase()) &&
      r.referenceNumber?.toLowerCase().includes(searchFields.referenceNumber.toLowerCase()) &&
      r.medicineStatus?.toLowerCase().includes(searchFields.medicineStatus.toLowerCase()) &&
      (searchFields.followUp === "" ||
        (r.nextFollowUp &&
          new Date(r.nextFollowUp).toISOString().slice(0, 16) === searchFields.followUp))
    );
  });

  return (
    <div className="medicine-dept-page">
      <Sidebar />
      <div className="medicine-dept-content">
        <h2 className="medicine-dept-title">💊 Medicine Department</h2>

        {/* 🔍 Labeled search filters */}
       <div className="search-filters">
  <div className="filter-group">
    <label>Display ID</label>
    <input
      placeholder="Enter Display ID"
      value={searchFields.displayId}
      onChange={(e) => setSearchFields({ ...searchFields, displayId: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Patient Name</label>
    <input
      placeholder="Enter Patient Name"
      value={searchFields.patientName}
      onChange={(e) => setSearchFields({ ...searchFields, patientName: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Contact</label>
    <input
      placeholder="Enter Contact"
      value={searchFields.contact}
      onChange={(e) => setSearchFields({ ...searchFields, contact: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Appointment Date</label>
    <input
      type="date"
      value={searchFields.date}
      onChange={(e) => setSearchFields({ ...searchFields, date: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Time</label>
    <input
      placeholder="Enter Time"
      value={searchFields.time}
      onChange={(e) => setSearchFields({ ...searchFields, time: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Location</label>
    <input
      placeholder="Enter Location"
      value={searchFields.location}
      onChange={(e) => setSearchFields({ ...searchFields, location: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Payment Details</label>
    <input
      placeholder="Enter Payment Details"
      value={searchFields.details}
      onChange={(e) => setSearchFields({ ...searchFields, details: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Follow Up Date & Time</label>
    <input
      type="datetime-local"
      value={searchFields.followUp}
      onChange={(e) => setSearchFields({ ...searchFields, followUp: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Reference Number</label>
    <input
      placeholder="Enter Reference Number"
      value={searchFields.referenceNumber}
      onChange={(e) => setSearchFields({ ...searchFields, referenceNumber: e.target.value })}
    />
  </div>
  <div className="filter-group">
    <label>Medicine Status</label>
    <input
      placeholder="In Progress / Ready"
      value={searchFields.medicineStatus}
      onChange={(e) => setSearchFields({ ...searchFields, medicineStatus: e.target.value })}
    />
  </div>
</div>

        <div className="medicine-dept-table-wrapper">
          <table className="medicine-dept-table">
            <thead>
              <tr>
                <th>Display ID</th>
                <th>Patient Name</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Payment Details</th>
                <th>Follow Up</th>
                <th>Reference</th>
                <th>Medicine Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td>{r.displayId || "-"}</td>
                  <td>{r.patientName || "-"}</td>
                  <td>{r.contact || "-"}</td>
                  <td>{r.date || "-"}</td>
                  <td>{r.time || "-"}</td>
                  <td>{r.location || "-"}</td>
                  <td>{r.details || "-"}</td>
                  <td>{r.nextFollowUp ? new Date(r.nextFollowUp).toLocaleString() : "-"}</td>
                  <td>{r.referenceNumber || "-"}</td>
                  <td>
                    <select
                      style={{ width: "180px" }}
                      value={statusUpdates[r._id] ?? r.medicineStatus ?? ""}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Medicine Ready">Medicine Ready</option>
                    </select>
                    <button onClick={() => handleSubmitStatus(r)}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicinePage;
