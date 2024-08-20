import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { MeetingProvider } from './context/MeetingContext';
import './styles/theme.css';  // Import theme
import './styles/styles.css'; // Import global styles

function App() {
  return (
    <AuthProvider>
      <MeetingProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={<Navigate to="/login" />} // Redirect to login by default
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </MeetingProvider>
    </AuthProvider>
  );
}

export default App;
