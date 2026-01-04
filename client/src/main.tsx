import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import Dashboard from "./pages/Dashboard";
import App from "./pages/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Dashboard /> */}
    <App />
  </React.StrictMode>
);
