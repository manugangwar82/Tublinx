import { useState, useEffect } from "react";
import "../Navbar.css";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>Tublinx</span>
      </div>
     
      <div className="nav-actions">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
