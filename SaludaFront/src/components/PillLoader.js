import React from "react";
import "./PillLoader.css";

const PillLoader = ({ message }) => (
  <div className="pill-loader-container">
    <div className="pill-loader">
      <div className="pill-shape">
        <div className="shine"></div>
      </div>
    </div>
    <div className="pill-shadow"></div>
    {message && <div className="pill-message">{message}</div>}
  </div>
);

export default PillLoader; 