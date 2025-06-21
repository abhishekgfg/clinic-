import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../style/AccountPage.css";

const AccountPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentRefs, setPaymentRefs] = useState({});
  const [editMode, setEditMode] = useState({}); // Track edit mode per record

  const statusOptions = ["In Progress", "Payment Done", "Not Take Medicine"];

  // Fetch all assistant doctor records
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/account/all");
      const recordsWithFallbackId = res.data.map((r, i) => ({
        ...r,
        displayId: r.displayId || `M${String(i + 1).padStart(2, "0")}`,
      }));
      setRecords(recordsWithFallbackId);
    } catch (err) {
      console.error("Error fetching account data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle status dropdown change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/account/update/${id}`, { actionStatus: newStatus });
      setRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...r, action: newStatus } : r))
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  // Save or update reference number
  const handleReferenceSave = async (record) => {
    const refNumber = paymentRefs[record._id];
    if (!refNumber || refNumber.trim() === "") {
      return alert("Please enter a payment reference number.");
    }

    try {
      if (record.referenceNumber) {
        // ✅ Update existing reference number
        await axios.put(`/api/account/update-reference/${record._id}`, {
          referenceNumber: refNumber.trim(),
        });
      } else {
        // ✅ Save new full account record
        await axios.post("/api/account/add-full", {
          assistantId: record._id,
          displayId: record.displayId,
          patientName: record.patientName,
          contact: record.contact,
          date: record.date,
          time: record.time,
          location: record.location,
          message: record.message,
          notes: record.notes,
          paymentStatus: record.status,
          details: record.details,
          medicineExplain: record.medicineExplain,
          nextFollowUp: record.nextFollowUp,
          action: record.action,
          referenceNumber: refNumber.trim(),
        });
      }

      // ✅ Update local state
      setRecords((prev) =>
        prev.map((r) =>
          r._id === record._id
            ? { ...r, referenceNumber: refNumber.trim() }
            : r
        )
      );
      setEditMode((prev) => ({ ...prev, [record._id]: false }));
      alert("✅ Reference saved successfully.");
    } catch (err) {
      console.error("Error saving reference:", err);
      alert("❌ Failed to save reference.");
    }
  };

  const filteredRecords = records.filter((r) =>
    r.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="account-modern-page">
      <Sidebar />
      <div className="account-modern-content">
        <h2 className="account-modern-title">📑 Account - Assistant Records</h2>

        <input
          type="text"
          className="account-modern-search"
          placeholder="🔍 Search by Patient Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="account-modern-table-wrapper">
            <table className="account-modern-table">
              <thead>
                <tr>
                  <th>Display ID</th>
                  <th>Patient Name</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Payment</th>
                  <th>Payment Details</th>
                  <th>Explain</th>
                  <th>Follow Up</th>
                  <th>Payment Status</th>
                  <th>Payment Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r._id}>
                    <td>{r.displayId}</td>
                    <td>{r.patientName}</td>
                    <td>{r.contact}</td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{r.location}</td>
                    <td>{r.status}</td>
                    <td>{r.details || "-"}</td>
                    <td>{r.medicineExplain || "-"}</td>
                    <td>{r.nextFollowUp || "-"}</td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={r.action}
                        onChange={(e) => handleStatusChange(r._id, e.target.value)}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {r.action === "Payment Done" && (
                        <div className="ref-input-group-modern">
                          <input
                            type="text"
                            className="ref-input"
                            placeholder="Ref #"
                            value={
                              editMode[r._id]
                                ? paymentRefs[r._id] || ""
                                : r.referenceNumber || ""
                            }
                            onChange={(e) =>
                              setPaymentRefs((prev) => ({
                                ...prev,
                                [r._id]: e.target.value,
                              }))
                            }
                            disabled={!editMode[r._id]}
                          />
                          {editMode[r._id] ? (
                            <button
                              className="save-btn"
                              onClick={() => handleReferenceSave(r)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="edit-btn"
                              onClick={() =>
                                setEditMode((prev) => ({
                                  ...prev,
                                  [r._id]: true,
                                }))
                              }
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
