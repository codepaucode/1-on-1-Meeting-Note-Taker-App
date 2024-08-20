import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
