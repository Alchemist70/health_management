import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>
            <i className="fas fa-phone-alt"></i> Contact Us
          </h4>
          <p>
            <i className="fas fa-envelope"></i> support@medcare.com
          </p>
          <p>
            <i className="fas fa-phone"></i> (555) 123-4567
          </p>
        </div>
        <div className="footer-section">
          <h4>
            <i className="fas fa-link"></i> Quick Links
          </h4>
          <div className="footer-links">
            <Link to="/about">
              <i className="fas fa-info-circle"></i> About Us
            </Link>
            <Link to="/services">
              <i className="fas fa-stethoscope"></i> Services
            </Link>
            <Link to="/contact">
              <i className="fas fa-paper-plane"></i> Contact
            </Link>
          </div>
        </div>
        <div className="footer-section">
          <h4>
            <i className="fas fa-share-alt"></i> Follow Us
          </h4>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          <i className="far fa-copyright"></i> 2024 MedCare. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
