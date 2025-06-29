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
import Chithi from "./pages/ChithiPage"; 
import PackagePage from "./pages/PackagePage"; // ✅ correct
import CourierPage from "./pages/CourierPage";
import GoogleSheetPage from "./pages/GoogleSheetPage";




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
<Route
  path="/chithi"
  element={
    <ProtectedRoute>
      <Chithi />
    </ProtectedRoute>
  }
/>

<Route
  path="/packaging" // ✅ corrected path
  element={
    <ProtectedRoute>
      <PackagePage />
    </ProtectedRoute>
  }
/>

<Route
  path="/courier"
  element={
    <ProtectedRoute>
      <CourierPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/google-sheet"
  element={
    <ProtectedRoute>
      <GoogleSheetPage />
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
