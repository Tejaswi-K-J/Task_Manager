import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// MOST IMPORTANT → IMPORT TAILWIND / CSS
import "./index.css";

// ROUTER
import { BrowserRouter } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
