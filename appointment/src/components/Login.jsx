import React, { useState } from "react";
import LoginForm from "./LoginForm";
import "../style/Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validUsers = [
    { username: "abhi", password: "123", role: "admin" },
    { username: "doctor", password: "123", role: "doctor" },
    { username: "reception", password: "123", role: "reception" },
    { username: "staff", password: "123", role: "staff" }
  ];

  const handleLogin = ({ username, password }) => {
    const user = validUsers.find(u => u.username === username && u.password === password);
    if (user) {
      login(user.username, user.role);
      navigate("/dashboard"); // redirect after login
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
