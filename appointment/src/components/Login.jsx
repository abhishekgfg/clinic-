import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import "../style/Login.css";

const Login = ({ onLoginSuccess }) => {
  const [error, setError] = useState(null);

  const validUsers = [
    { username: "abhi", password: "123", role: "admin" },
    { username: "reception", password: "123", role: "reception" },
    { username: "doctor", password: "123", role: "doctor" },
    { username: "staff", password: "123", role: "staff" }
  ];

  const handleLogin = ({ username, password }) => {
    const user = validUsers.find(u => u.username === username && u.password === password);

    if (user) {
      onLoginSuccess(user.username, user.role);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Clinic Panel Login</h2>
        {error && <div className="error-message">{error}</div>}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
