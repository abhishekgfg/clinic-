import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import "../style/Login.css";

const Login = ({ onLoginSuccess }) => {
  const [error, setError] = useState(null);

  const handleLogin = async ({ username, password }) => {
    try {
      const validUsers = [
        { username: "abhi", password: "123" }, // Admin-like user
        { username: "user", password: "123" }  // Regular user
      ];

      const isValid = validUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (isValid) {
        onLoginSuccess(username); // Pass the username to parent
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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
