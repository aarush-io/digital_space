import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import WhyIDontLikeMyCountry from "./pages/WhyIDontLikeMyCountry.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/why-i-dont-like-my-country" element={<WhyIDontLikeMyCountry />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
