import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Get the current user from the AuthContext


  if (!currentUser) {
    return <Navigate to="/login" />; // If the user is not authenticated, redirect them to the login page
  }

  // If the user is authenticated, render the children components (These are the components or routes inside the ProtectedRoute that will only be rendered if the user is authenticated. Example, Dashboard.jsx is a child of ProtectedRoute.)
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
