import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import "./Login.css"; 

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGooglePopup();
      setCurrentUser(user);
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      setError("Failed to sign in. Please try again.");
      console.error("Sign-in error: ", error);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: "url('/background-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div className="login-box">
        <h2>Welcome to the 1-on-1 Meeting Note Taker App</h2>
        <img src="/login-image.png" alt="Login Illustration" className="login-image" />
        <p>Please sign in with your Google account to continue.</p>
        <button onClick={handleGoogleSignIn} className="google-signin-button">
          <img src="https://www.edigitalagency.com.au/wp-content/uploads/google-logo-png-transparent-background-large-new.png" alt="Google Logo" />
          Continue with Google
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
