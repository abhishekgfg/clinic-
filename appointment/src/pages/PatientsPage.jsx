import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import PatientsSection from "../components/PatientsSection";
import { useAuth } from "../context/AuthContext"; // ✅ Add this
import "../style/Patients.css";

const PatientsPage = () => {
  const { user } = useAuth(); // ✅ Get current user from context
  const [patients, setPatients] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/patients/all", {
        headers: {
          username: user?.username, // ✅ Send username to backend
        },
      });
      setPatients(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch patients", err);
      setPatients([]); // fallback
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchData(); // ✅ Only fetch after user is loaded
    }
  }, [user]);

  return (
    <div className="main-container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="content" style={{ flex: 1, padding: "20px" }}>
        <PatientsSection patients={patients} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default PatientsPage;
