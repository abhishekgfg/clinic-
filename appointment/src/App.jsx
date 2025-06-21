// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AssistantDoctorPage from "./pages/AssistantDoctorPage";
import AccountPage from "./pages/AccountPage";
import MedicinePage from "./pages/MedicinePage";



import SignupPage from "./pages/SignupPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/patients"
  element={
    <ProtectedRoute>
      <PatientsPage /> {/* not Patients */}
    </ProtectedRoute>
  }
/>
 <Route
        path="/assistant-doctor" // ✅ Add this route
        element={
          <ProtectedRoute>
            <AssistantDoctorPage />
          </ProtectedRoute>
        }
      />

      <Route
  path="/account"
  element={
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/medicine"
  element={
    <ProtectedRoute>
      <MedicinePage />
    </ProtectedRoute>
  }
/>



      <Route
        path="/signup"
        element={
          <ProtectedRoute>
            <SignupPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/appointments"
  element={
    <ProtectedRoute>
      <AppointmentsPage />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
