import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import '../styles/sidebar.css';

const Sidebar = ({ savedMeetings = {}, onDateClick, selectedDate, handleHomeClick }) => {
  const { logout, currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggles the visibility of the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handles the logout action
  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="sidebar">
      <header className="dashboard-header">
        <h1 className="sidebar-title">Welcome, {currentUser?.displayName}</h1>
        <img src={currentUser?.photoURL} alt="User profile" className="profile-image" />
        <div className="profile-info">
          <p>Email: {currentUser?.email}</p>
          <p>Last Login: {currentUser?.metadata?.lastSignInTime}</p>
        </div>
      </header>

      {/* Home button */}
      <div
        className={`date-item ${selectedDate === '' ? 'selected' : ''}`}
        onClick={handleHomeClick}
      >
        Home
      </div>

      {/* Dropdown for saved meetings */}
      <div className="dropdown">
        <div className="dropdown-toggle" onClick={toggleDropdown}>
          Saved Meeting Notes
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {Object.keys(savedMeetings).map((date) => (
              <div
                key={date}
                className={`date-item ${selectedDate === date ? 'selected' : ''}`}
                onClick={() => onDateClick(date)}
              >
                {date}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Sidebar;
