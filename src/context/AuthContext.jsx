import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";

// Create the context for authentication (a way to pass data through the component tree without having to pass props down manually at every level).
const AuthContext = createContext(); //to manage and share authentication-related data across the app

export const useAuth = () => useContext(AuthContext); //useAuth is the access point for other components to get AuthContext.

export const AuthProvider = ({ children }) => { //AuthProvider component provides the AuthContext value to all its children components.
  const [currentUser, setCurrentUser] = useState(null); // Holds the authenticated user
  const [loading, setLoading] = useState(true); // Loading state for auth

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
