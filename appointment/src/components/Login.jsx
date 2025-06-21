import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const [adminExists, setAdminExists] = useState(true); // assume true initially

  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", password: "", role: "counser" });

  // 🔍 Check if admin already exists in DB
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/admin-exists");
        setAdminExists(res.data.exists);
      } catch (err) {
        setAdminExists(true); // fail-safe
      }
    };
    checkAdmin();
  }, []);

  // Handle input changes
  const handleChange = (e, isLogin) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
       const res = await axios.post("http://localhost:5000/api/auth/login", loginForm);
      const { username, role } = res.data;
      login(username, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // Handle signup (admin-only or first-time)
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", signupForm, {
        headers: { role: user?.role || "none" },
      });
      alert("User created successfully");
      setSignupForm({ username: "", password: "", role: "counser" });
      setIsSignup(false);
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isSignup ? "Create User" : "Clinic Panel Login"}</h2>
        {error && <div className="error-message">{error}</div>}

        {!isSignup ? (
          !adminExists ? (
            // First-time admin setup
            <form onSubmit={handleSignup}>
              <input
                type="text"
                name="username"
                placeholder="Create Admin Username"
                value={signupForm.username}
                onChange={(e) => handleChange(e, false)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create Admin Password"
                value={signupForm.password}
                onChange={(e) => handleChange(e, false)}
                required
              />
              <select name="role" value="admin" disabled>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Create Admin</button>
            </form>
          ) : (
            // Login form
            <form onSubmit={handleLogin}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => handleChange(e, true)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => handleChange(e, true)}
                required
              />
              <button type="submit">Login</button>

              {user?.role === "admin" && (
                <p style={{ marginTop: "10px" }}>
                  Want to create a new user?{" "}
                  <button type="button" onClick={() => setIsSignup(true)}>
                    Go to Signup
                  </button>
                </p>
              )}
            </form>
          )
        ) : (
          // Admin creates user
          <>
            {user?.role !== "admin" ? (
              <p>Access denied. Only admin can create users.</p>
            ) : (
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  name="username"
                  placeholder="New Username"
                  value={signupForm.username}
                  onChange={(e) => handleChange(e, false)}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={signupForm.password}
                  onChange={(e) => handleChange(e, false)}
                  required
                />
                <select name="role" value={signupForm.role} onChange={(e) => handleChange(e, false)}>
                  <option value="counser">Counser</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="account">Account</option>
                  <option value="medicine">Medicine</option>
                  <option value="chithi">Chithi</option>
                  <option value="packoing">Packoing</option>
                  <option value="courier">Courier</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit">Create User</button>
                <p style={{ marginTop: "10px" }}>
                  <button type="button" onClick={() => setIsSignup(false)}>
                    Back to Login
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
