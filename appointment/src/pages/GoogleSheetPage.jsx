import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../style/GoogleSheetPage.css";

const GoogleSheetPage = () => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchSavedSheet();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) handleAutoFetch();
    }, 15000);
    return () => clearInterval(interval);
  }, [isConnected, savedData]);

  const extractSheetId = (url) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? match[1] : "";
  };

  const clean = (value) => value?.replace(/^"|"$/g, "").trim();

  const fetchSavedSheet = async () => {
    try {
      const res1 = await axios.get("/api/google-sheet");
      if (res1.data?.sheetUrl) {
        setSheetUrl(res1.data.sheetUrl);
        setSheetData(res1.data.data || []);
        setIsConnected(true);
      }
    } catch {
      console.log("No saved sheet connected.");
    }

    try {
      const res2 = await axios.get("/api/google-patients/all");
      setSavedData(res2.data);
    } catch (error) {
      console.error("Error fetching saved patient data:", error);
    }
  };

  const formatAndFilterData = (csv) => {
    const rows = csv
      .split("\n")
      .map((row) => row.split(","))
      .filter((row) => row.length >= 4);

    return rows
      .slice(1)
      .map(([name, age, contact, email]) => ({
        name: clean(name),
        age: clean(age),
        contact: clean(contact),
        email: clean(email),
      }))
      .filter(
        (item) =>
          item.name &&
          ((item.contact && item.contact.length >= 5) ||
            (item.email && item.email.includes("@")))
      );
  };

  const handleFetch = async () => {
    if (!sheetUrl) return;
    setLoading(true);
    try {
      const sheetId = extractSheetId(sheetUrl);
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      const response = await axios.get(csvUrl);
      const formattedData = formatAndFilterData(response.data);

      setSheetData(formattedData);

      await axios.post("/api/google-sheet", {
        sheetUrl,
        sheetId,
        data: formattedData,
      });

      setIsConnected(true);
    } catch (error) {
      alert("Error fetching or saving sheet data.");
    }
    setLoading(false);
  };

  const handleAutoFetch = async () => {
    try {
      const sheetId = extractSheetId(sheetUrl);
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      const response = await axios.get(csvUrl);
      const formattedData = formatAndFilterData(response.data);

      const res = await axios.post("/api/google-patients/import", formattedData);
      console.log("✅ Synced:", res.data.message);
      fetchSavedSheet();
    } catch (error) {
      console.log("Auto-fetch failed:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/google-patients/${id}/status`, { status: newStatus });
      const updated = savedData.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      );
      setSavedData(updated);
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleRemoveConnection = async () => {
    if (!window.confirm("Are you sure you want to disconnect the sheet?")) return;
    try {
      await axios.delete("/api/google-sheet");
      setSheetUrl("");
      setSheetData([]);
      setIsConnected(false);
      alert("❌ Google Sheet disconnected.");
    } catch (error) {
      alert("Failed to disconnect sheet.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`/api/google-patients/${id}`);
      setSavedData(savedData.filter((item) => item._id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  const handleEdit = (item) => {
    alert(`Edit clicked for ${item.name}`);
    // You can implement a modal or inline editing here
  };

  return (
    <div className="google-sheet-page">
      <Sidebar />
      <div className="google-sheet-content">
        <h2>📄 Google Sheet Integration</h2>

        {!isConnected && (
          <div className="input-section">
            <div className="input-group1">
              <label htmlFor="sheet-link">🔗 Google Sheet Link</label>
              <input
                id="sheet-link"
                type="text"
                placeholder="Paste Google Sheet link here..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
            </div>
            <button onClick={handleFetch} disabled={loading}>
              {loading ? "Fetching..." : "Fetch & Connect"}
            </button>
          </div>
        )}

        {isConnected && (
          <>
            <p style={{ marginBottom: "10px", color: "#555" }}>
              ✅ Connected to: <b>{sheetUrl}</b>
            </p>
            <p style={{ color: "green" }}>🕒 Auto-sync active (every 15s)</p>
            <button
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "5px",
                width: "250px",
                marginTop: "10px",
              }}
              onClick={handleRemoveConnection}
            >
              ❌ Disconnect Sheet
            </button>
          </>
        )}

        {savedData.length > 0 && (
          <>
            <h3 style={{ marginTop: "40px" }}>📁 Saved Patient Records</h3>
            <div className="sheet-table-container">
              <table className="sheet-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedData.map((item, idx) => (
                    <tr key={item._id || idx}>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.contact}</td>
                      <td>{item.email}</td>
                      <td>
                        <select
                          value={item.status || ""}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        >
                          <option value="">--Select--</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Call Ready for Consultation">Call Ready for Consultation</option>
                          <option value="Again Call Schedule">Again Call Schedule</option>
                          <option value="Payment Done">Payment Done</option>
                          <option value="Scheduled">Scheduled</option>
                        </select>
                      </td>
                      <td className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(item)}>✏️ Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetPage;
