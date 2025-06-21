import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../style/MedicinePage.css";

const MedicinePage = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  const fetchRecords = async () => {
    try {
      const res = await axios.get("/api/medicine/all");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching medicine data:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = records.filter((r) =>
    r.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="medicine-dept-page">
      <Sidebar />
      <div className="medicine-dept-content">
        <h2 className="medicine-dept-title">💊 Medicine Department</h2>

        <input
          type="text"
          className="medicine-dept-search"
          placeholder="🔍 Search by Patient Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
                <th>Payment Status</th>
                <th>Payment Details</th>
                <th>Explain</th>
                <th>Follow Up</th>
                <th>Medicine Action</th>
                <th>Reference No</th>
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
                  <td>{r.paymentStatus || "-"}</td>
                  <td>{r.details || "-"}</td>
                  <td>{r.medicineExplain || "-"}</td>
                  <td>{r.nextFollowUp ? new Date(r.nextFollowUp).toLocaleString() : "-"}</td>
                  <td>{r.action || "-"}</td>
                  <td>{r.referenceNumber || "-"}</td>
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
