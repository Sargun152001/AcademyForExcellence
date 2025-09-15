// index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// ✅ Render React App directly, no MSAL login required
function renderReactApp() {
  const container = document.getElementById("root");
  const root = createRoot(container);

  root.render(<App />);
}

renderReactApp();
