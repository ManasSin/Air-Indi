import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./components/Context/userContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </UserContextProvider>
);
