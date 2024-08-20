import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { MeetingProvider } from './context/MeetingContext';
import './styles/theme.css';  // Import global theme styles
import './styles/styles.css'; // Import additional global styles

function App() {
  return (
    <AuthProvider> {/* Provide authentication context to the entire app */}
      <MeetingProvider> {/* Provide meeting-related context to the entire app */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={<Navigate to="/login" />} // Redirect root path to login
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute> {/* Protect the dashboard route */}
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
