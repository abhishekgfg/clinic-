// src/components/Sidebar.jsx
import React, { useState } from "react";
import { FaHome, FaUserFriends, FaCalendarAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import "../style/Sidebar.css";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, key: "home" },
    { name: "Patients", icon: <FaUserFriends />, key: "patients" },
    { name: "Appointments", icon: <FaCalendarAlt />, key: "appointments" },
    { name: "Logout", icon: <FaSignOutAlt />, key: "logout" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FaBars />
      </div>
      <h2 className="logo">{!isCollapsed && "Clinic Admin"}</h2>
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={activeSection === item.key ? "active" : ""}
            onClick={() => {
              if (item.key === "logout") {
                handleLogout();
              } else {
                setActiveSection(item.key);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="icon">{item.icon}</span>
            {!isCollapsed && <span className="text">{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
