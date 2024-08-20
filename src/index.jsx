import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/styles.css"; // Import global styles

// Render the main application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode> {/* Enable strict mode for highlighting potential issues */}
    <App />
  </React.StrictMode>
);
