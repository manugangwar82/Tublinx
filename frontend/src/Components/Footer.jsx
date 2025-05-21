import React from "react";
import "../Footer.css"; // CSS File Import

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-title">Tublinx</h2>

        <nav className="footer-links">
          <a href="#">Youtube Shorts</a> | <a href="#">Youtube Long</a> | <a href="#">Reels</a>
        </nav>
        <p className="footer-copy">
          © 2020-2025 Tublinx. All rights reserved. by "Manu Gangwar"
        </p>
      </div>
    </footer>
  );
};

export default Footer;
