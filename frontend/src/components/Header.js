import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import "../styles/Logo.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const formatRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/" className="logo" onClick={closeMenus}>
        <i className="fas fa-heartbeat"></i>
        <h1>
          Med<span>Care</span>
        </h1>
      </Link>

      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        <i className={`fas fa-${isMobileMenuOpen ? "times" : "bars"}`}></i>
      </button>

      <nav className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
        {userRole === "patient" && (
          <>
            <Link
              to="/patient-dashboard"
              className={`nav-link ${
                location.pathname === "/patient-dashboard" ? "active" : ""
              }`}
              onClick={closeMenus}
            >
              Dashboard
            </Link>
            <Link
              to="/book"
              className={`nav-link ${
                location.pathname === "/book" ? "active" : ""
              }`}
              onClick={closeMenus}
            >
              Book Appointment
            </Link>
            <Link
              to="/appointments"
              className={`nav-link ${
                location.pathname === "/appointments" ? "active" : ""
              }`}
              onClick={closeMenus}
            >
              My Appointments
            </Link>
          </>
        )}

        {userRole === "doctor" && (
          <>
            <Link
              to="/doctor-dashboard"
              className={`nav-link ${
                location.pathname === "/doctor-dashboard" ? "active" : ""
              }`}
              onClick={closeMenus}
            >
              Dashboard
            </Link>
            <Link
              to="/appointments"
              className={`nav-link ${
                location.pathname === "/appointments" ? "active" : ""
              }`}
              onClick={closeMenus}
            >
              Appointments
            </Link>
            <Link
              to="/manage-schedule"
              className={`nav-link ${
                location.pathname === "/manage-schedule" ? "active" : ""
              }`}
              onClick={closeMenus}
            >
              Manage Schedule
            </Link>
          </>
        )}
      </nav>

      {userRole ? (
        <div className="user-menu">
          <button className="user-button" onClick={toggleUserMenu}>
            <i className="fas fa-user-circle"></i>
            <div className="user-info">
              <span className="user-name">{userName || "User"}</span>
              <span className="user-role">{formatRole(userRole)}</span>
            </div>
            <i
              className={`fas fa-chevron-${isUserMenuOpen ? "up" : "down"}`}
            ></i>
          </button>

          {isUserMenuOpen && (
            <div className="dropdown-menu">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={closeMenus}
              >
                <i className="fas fa-user"></i> Profile
              </Link>
              <Link
                to="/settings"
                className="dropdown-item"
                onClick={closeMenus}
              >
                <i className="fas fa-cog"></i> Settings
              </Link>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="nav-link" onClick={closeMenus}>
            Login
          </Link>
          <Link to="/register" className="nav-link" onClick={closeMenus}>
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
